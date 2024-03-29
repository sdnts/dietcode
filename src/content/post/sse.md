---
title: "Better loading states with Server-Sent Events"
description: "SSE streams are one-way WebSocket connections that are miles easier to build"
date: "2023-09-10"
---

A couple of years ago when I was working on the first version of [Prisma's Data Platform](https://cloud.prisma.io),
we built this dashboard that had a "Create Project" flow that would provision
a Heroku database for you if you pressed a button. When you did, the browser
would send a request to our backend, who would in turn talk to Heroku, provision
the database, get credentials, and forward them to the browser, which would then
display it for you.

The problem though, was that this took around 30s to finish when all was said and
done. That's an astronomically long time for a user to be looking at a spinner.

One way to address this problem is to poll your server every few seconds.
This is really hard to implement though. You need some kind of state on the server,
which usually involves a database, AND you've got more complexity on the client
too. Sure, modern browsers will keep a TCP connection open with your origin if
you set things up just right, but even then, you're paying for round trips every
time you poll.

Another way around this was to make the spinner a bit more interactive, make it rotate
through a few phrases, like `Crunching numbers`, or `Contacting satellite`, anything
that assures the user that stuff's going down. You may have seen these as Slack /
Sentry / Discord fire up. But these phrases are often superficial
and (intentionally) absurd because there's isn't an easy way to get "live updates"
from our server.

An even more complex way around this is to use WebSockets, but that sounds overkill
as well, at least today.

Enter Server-Sent-Events (SSE)! They're like one-way WebSockets, so they're more
limited, but in a really good way. SSE streams are a long running HTTP/2
response that emits events every so often. The browser can "subscribe" to these
events just like a WebSocket connection. Heck, the browser even reconnects for
you, which massively improves resiliency compared to WebSockets.

---

One pre-requisite to understanding SSE is the realization that HTTP requests and
responses aren't concrete blobs of text that you throw about in one piece. You
generally break this blob up into smaller pieces, and transport these smaller
pieces (that's what a stream is). When you respond to an HTTP request from your
server, you read the request's body stream, build up a response, then send this
response back in pieces (as a stream). Granted, _you_ don't do this, but your
runtime (Node.js, or `workerd`, or `bun`) does. None of this is HTTP-specific
by the way, that's just how TCP does things.

If you're not familiar with streams, you'd generally build up a `Response` in your
server's memory before sending it back, but a way to "speed things up" is to start
your `Response` stream immediately and send that back to the client. Then you can
write pieces of your actual payload as they become available. This way, your client
gets the first bytes very quickly (a low TTFB), but the data arrives in a "streaming"
fashion. This technique is fundamental to modern SSR-focused JavaScript frameworks
(but that isn't super relevant here).

---

Okay let's set up an SSE stream on our server now (I'm using a Cloudflare Worker,
but this works on Node.js as well):

```typescript
const createProject = () => {
  const { readable, writable } = new TransformStream();

  return new Response(readable, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
};
```

The `TransformStream` stuff might look a _little_ intimidating, but all we've
done is set up a "pipe". Anything you write to the writable end of this pipe will
be forwarded to the readable end of this pipe **as-is**, which is the `Response`.
More accurately, we've set up an ["identity"](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream#parameters)
`TransformStream`. **In essence, we can append to the response after we've sent
it back.**

Also noteworthy here is the `Content-Type` of the response. This tells the browser
to treat this response as an SSE stream instead of a regular HTTP response. This
allows us to consume this stream much more easily, as we'll see in just a bit.

So now all we need to do is to actually append to the response (AKA write to this
stream), let's do that in an asynchronous loop to begin with, and in a specific
"format", we'll look into why we chose this format in juuust a little bit:

```typescript
const createProject = () => {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const te = new TextEncoder();

  let i = 0;
  const interval = setInterval(() => {
    writer.write(te.encode(`data: Count is\n`));
    writer.write(te.encode(`data: ${i++}\n`));
    writer.write(te.encode(`data: (${5 - i} left)\n`));
    writer.write(te.encode(`\n`));

    if (i === 4) {
      writer.close();
      clearInterval(interval);
    }
  }, 1000);

  return new Response(readable, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
};
```

We'll dig deeper into this code, but before we do, this is what this request looks
like:

![The GIF shows an HTTP request being sent via Postman. The request receives a response immediately, but it does not "finish". Instead, we receive a new line of the response every second. After 5 such seconds, the response finishes.](/p/sse/demo.gif "A demo of an SSE stream")

Pretty cool! We get back a message (or an "event") every second. Every time we
append to our `Response`, Postman sees an event.

Let's consume this stream from our client (the browser) instead of Postman though:

```typescript
const es = new EventSource(`https://localhost:8787`);
es.addEventListener("open", (e) => console.log("Stream started"));
es.addEventListener("error", (e) => console.log("Stream errored"));
es.addEventListener("message", (e) => console.log("Message:", e.data));
```

That's... it. Even though this is HTTP, you don't use `fetch` to consume an SSE
stream. Instead, you use an [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).
It (intentionally) looks just like a WebSocket connection. If you run this in your
browser, you now get the exact same output as Postman did.

From the outside, this looks like the server calling our client whenever it wants,
which is why we call this a server-sent event stream. Let's dissect this to understand
the mechanics of this.

---

Every "event" in an SSE stream looks like this:

```
data: part of\n
data: your message\n
data: goes here\n
\n
```

Your event can have multiple lines, but each line must be prefixed with `data: `,
and suffixed by the newline character. An empty line indicates the end of one event.
Your browser will receive this event like this:

```
part of\n
your message\n
goes here\n
```

So that's what were doing on our server. We send back a `ReadableStream` immediately, but every
second, we write one event to this stream. Note that you cannot actually write to
a `ReadableStream`, which is why we need the `IdentityTransformStream` to begin with.
Another quirk is that streams generally transport actual bytes, so we use [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
to convert from human-readable text to raw bytes. But the rest should make sense
now. Here it is again:

```typescript
let i = 0;
const interval = setInterval(() => {
  writer.write(te.encode(`data: Count is\n`));
  writer.write(te.encode(`data: ${i++}\n`));
  writer.write(te.encode(`data: (${5 - i} left)\n`));
  writer.write(te.encode(`\n`));

  if (i === 4) {
    writer.close(); // End the stream, it has to happen _sometime_
    clearInterval(interval);
  }
}, 1000);
```

---

What you write after the `data: ` prefix is completely up to you, and is delivered
as-is to the browser, which means you can actually stuff a JSON in there:

```
data: { "status": "Creating Heroku project" }\n
\n
```

or, you could split it into multiple lines:

```
data: {\n
data:   "status": "Creating Heroku project"\n
data: }\n
\n
```

`JSON.parse` is indifferent to spacing, so you can `JSON.parse(e.data)` in your
`EventSource`'s `message` handler just fine! This means you now have a way to
transport structured data from the server to the client.

**The only thing to note is that because this is HTTP based, SSE events are text-based
as well. You cannot transport binary data (raw bytes) over an SSE stream unless
they're serializable to text.**

(Someone did figure out a way to send binary data using a custom encoding though:
[https://github.com/luciopaiva/binary-sse](https://github.com/luciopaiva/binary-sse).
This is the kind of chaotic behaviour I can get behind.)

---

### Soo... loading states?

Ah right. Coming back to our original problem, we can display actually useful
information in our loading states by using an SSE stream. We might send back events
like these from our server:

```
data: Connecting to Heroku\n
\n

// A few seconds later

data: Created Heroku project\n
\n

// A few seconds later

data: Provisioned database\n
\n

// A few seconds later

data: Received credentials\n
\n
```

There's no databases involved, all you need to do is hold on a `WritableStreamDefaultWriter`
reference and `.write()` to it for every significant thing you do. When you're done,
just `.close()` the writer, like we did with our `setInterval`.

### What next?

Loading states are just one idea. I think it helps to see this as a read-only
WebSocket connection, so you _should_ be able to take this as far as a read-only
Google Docs page.

I mentioned this before, but SSE streams automatically reconnect. There's an `id: `
field that you can attach to each event that helps to "resume" a stream. Essentially,
the browser sends you the ID of the last event it received when it reconnects,
and you can use that to prune the events you send back from your server. Web.dev
has a cool post that goes a little deeper with this stuff [here](https://web.dev/eventsource-basics/).
(Note that the securty warning about origin checks is unnecesary, since it relates
to `postMessage`)

I think SSE is extremely cool tech that unfortunately got hit with the serverless
wave, where long-running responses like this can be challenging. Still sick though!
