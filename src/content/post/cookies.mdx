---
title: "Cookies are a distributed storage mechanism"
description: "Cookies can be so much more than vessels for authentication tokens"
date: "2023-10-08"
tags: ["http", "cookies"]
---

Someone somewhere used cookies for authentication once, and for some reason
they became synonymous. I'm here to tell you that cookies are so much more. A
cookie is how a server stores arbitrary data on a browser. Better yet, the browser
automatically sends this data back to the server with every request, without
needing any developer intervention. This is cool because the server can now store stuff in
cookies, and it'll be available to it (and _only_ it) any time the browser reaches
out.

Let's see how far we can take this; let's write a key-value store that is backed
by cookies! (It's not as unhinged as you might think). Code for all this is public
if you want to skip all the shenanigans:
[https://github.com/sdnts/cookeys](https://github.com/sdnts/cookeys)

---

(If you're already familiar with cookies, I'd recommend just skipping over this
section)

A `Cookie` is a special header that your browser attaches to all requests to the
server that created it. Here's an HTTP server in TypeScript that logs all received
cookies, and sets one in return:

```typescript
import { serve } from "bun";

serve({
  async fetch(request: Request) {
    console.log("Received cookies:", request.headers.get("cookie"));

    return new Response("ok", {
      headers: {
        "Set-Cookie": "foo=bar",
      },
    });
  },
});
```

I'm using [Bun](https://bun.sh)'s HTTP Server. The runtime is irrelevant here,
Bun just happens to be the quickest way to get a local HTTP server up and running.
If you're using something else, all you'll need to change is how you launch your
HTTP server, everything else remains the same.

When you hit `localhost:3000` from your browser, your server will log `Received cookies: null`
the first time, and `Received cookies: foo=bar` every time after that. We already
have a key-value store right here -- one that's shared between our server and
our browser, and one that no other browser can see. Heck, if we make this an
HTTP-only cookie, not even client-side JS can mess with it.

---

What all this means for your server is that if you receive a `Cookie` header in an
HTTP request, you can _guarantee_ that it was you the server, that set it. Of course
practically-speaking the Internet is not a trustworthy place, so we generally
encrypt or sign our cookie before setting it, but we can still _guarantee_ that
the cookie was set by us.

The most obvious application of this guarantee is auth tokens. An encrypted user
ID in a cookie lets your server identify the user talking to you, and you can use
this information to look up the user's name in your database and slightly change
the HTML you return to them (or show a login page).

You can also use an encrypted cookie to remember a user's light / dark theme
preference so your server can render appropriate styles before sending HTML back,
avoiding a blinding flash of unstyled content.

You basically have a key-value store at your disposal, for free. You could store
your entire app's state in a collection of cookies if you want really. (the reason
we don't do this is because users can just clear cookies out without notice. Also
it is absurd.)

Let's try this though, for science -- you set a perpetual cookie by sending back a `Set-Cookie`
header from your server. Deleting cookies is only a tiny bit more complex because
you need to set an expiration date in the past (I like to just set it to `0`).
The browser will automatically clean out cookies that it thinks have expired.

Here's an HTTP server that exposes a KV Store backed by cookies:

```typescript
import { serve } from "bun";
import { parse, serialize } from "cookie";

serve({
  fetch(request: Request) {
    const url = new URL(request.url);
    // Parse incoming cookie string into a JavaScript object
    const cookies = parse(request.headers.get("cookie") ?? "");

    // Clone this object so we can track deletes
    const db = Object.assign({}, cookies);

    if (url.pathname === "/put") {
      // Add each query param to our cloned JS object
      url.searchParams.forEach((v, k) => (db[k] = v));
    } else if (url.pathname === "/delete") {
      // Remove all query params from our cloned JS object
      url.searchParams.forEach((_, k) => delete db[k]);
    }

    const headers = new Headers();
    Object.keys(cookies).forEach((k) => {
      if (db[k]) {
        // If a key existed in the incoming cookies and in our cloned object, its
        // value was possibly just updated, set a corresponding cookie.
        headers.append("Set-Cookie", serialize(k, db[k]));
      } else {
        // If a key existed in the incoming cookies but not in our cloned object,
        // it was deleted, so set a corresponding cookie with an expiry in the past.
        headers.append(
          "Set-Cookie",
          serialize(k, "❌", { expires: new Date(0) }),
        );
      }
    });

    return Response.json(db, { headers });
  },
});
```

When you hit `localhost:3000` the first time around, you should see an empty object
in your browser. Add a key to your "database" by hitting `localhost:3000/put?foo=bar`.
Do this a few times (you can even update an existing key this way). Then delete
a key by hitting `localhost:3000/delete?foo`. If you keep your browser's DevTools
open on the "Cookies" section, you'll see them update!

Slap on some UI controls, and you get something like this:
![An editable table with key-value pairs in its columns. Each row also has a button to delete a KV pair](/p/cookies/cookeys.png)

Code for this is public if you want to peek:
[https://github.com/sdnts/cookeys](https://github.com/sdnts/cookeys)

---

One could argue that this is all unnecessary when we have `localStorage`, and
they'd be right, but knowing that your server has a client-isolated KV store can
help elegantly solve quite a few niche problems without needing to hook up a
database to it, and without shipping any JS. Use this information as you will!
(but be careful because browsers can still change cookies; always sign / encrypt
them to verify legitimacy)
