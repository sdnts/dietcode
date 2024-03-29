---
title: "Preflight requests in CORS"
description: "When do CORS preflight requests go out?"
date: "2022-11-29"
---

**Cross-origin requests are only preflighted if the browser thinks that the request might cause a server-side mutation**.
If you make a cross-origin `XMLHttpRequest` / `fetch` request, it gets classified
into one of two categories: "simple" or "preflighted".

Simple requests are ones where it is (conventionally) safe to piggyback off the
actual request to determine the CORS policy. I say "conventionally" because REST/HTTP
does not enforce that you only read on `GET` requests, or that `PUT` will create-or-replace,
there are only conventions.

Anyway, if your request has a `HEAD` / `GET` method, the browser can assume that the
origin server will not do any mutations when processing this request, so it just
looks for the `Access-Control-Allow-Origin` header in the actual request's response,
AKA CORS policies are inferred from the actual request. This is considered safe
to do, and it saves one round-trip.

For `PUT` / `DELETE` though, sending the actual request might trigger server-side
mutations (like creating or deleting a row in a database), so the browser needs to
make sure that the origin making this request is allowed to do so _before_ making
the actual request. It _cannot_ piggyback off the actual request to infer CORS policies
because doing so defeats the purpose of CORS -- the origin was able to mutate the host
without explicit permission. Sure, the origin might not get to see the host's response,
but the damage is already done. This is why the browser must "preflight" the actual
request, AKA send a separate (`OPTIONS`) request to explicitly ask the host if the
request it intends to send is allowed. This (preflight) `OPTIONS` request has the
headers `Access-Control-Request-Method` that describes what method the actual request
will be, and `Access-Control-Request-Headers`, that lists the headers the actual
request will have. _Only_ if the host server says that the origin is allowed to
send a request with the method in `Access-Control-Request-Method` and the headers
in `Access-Control-Request-Headers`, is the actual request sent out.

The decision to preflight a request lies entirely in the hands of the client (which
is a web browser in most cases). It tries its best to _not_ send an additional request,
within the bounds of the CORS contract. Unfortunately, this decision is not based
on the request method alone, there are edge cases that may cause even a `GET` request
to be preflighted.

[MDN's CORS documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
is actually a great read, and expands on how the browser decides if a request needs
to be preflighted.
