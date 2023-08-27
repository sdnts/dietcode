---
title: "gzip-ed, streaming uploads from browsers"
description: "Can you compress files on your browser before you upload them to your server?"
date: "2023-08-27"
tags: ["javascript", "compression"]
---

You will not believe how simple this is (I didn't!). Assuming `file` is a file handle
you've somehow acquired (either by letting the user pick a file or by using the
File System API), here's all you need to do:

```
const gzippedStream = file
  .stream()
  .pipeThrough(new CompressionStream("gzip"))
```

That's it. You can now take this gzipped stream and use it as a `Request` body in
a `fetch` call:

```
fetch(
  "https://file-gobbler.com/upload",
  {
    body: file
      .stream()
      .pipeThrough(new CompressionStream("gzip"))
  }
)
```

and the browser will `gzip` your file on-the-fly, and your server will receive
the compressed blob.
