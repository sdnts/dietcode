---
title: "Writing to stdout is only as fast as your terminal"
description: "Would you believe me if I told you what terminal you use heavily impacts how many requests-per-second your server can handle?"
date: "2023-04-07"
---

Consider this barebones HTTP server:

```rust
use anyhow::Result;
use std::{
  io::{Read, Write},
  net::TcpListener,
};

fn main() -> Result<()> {
  let listener = TcpListener::bind("0.0.0.0:7096")?;
  let mut buf = [0u8; 4096];

  for stream in listener.incoming() {
    let mut stream = stream?;
    loop {
      if let Ok(n) = stream.read(&mut buf) {
        if n == 0 {
          break;
        }

        _ = stream.write_all(
          b"HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello World!",
        );
      }
    }
  }

  Ok(())
}
```

The language isn't relevant for this post, so don't focus too much on it. For people
unfamiliar with Rust, this server is just returning a `Hello World!` response to
any HTTP requests that come its way.

It is single-threaded, and can only work with one connection at a time, so it's
pretty bad, but let's see what kind of performance we can get:

```sh
$ wrk -t1 -c1 -d10s http://127.0.0.1:7096
```

I'm using [`wrk`](https://github.com/wg/wrk) here, which is an HTTP benchmarking
tool. I've told it to use one thread (`-t1`) and one connection (`-c1`), and to
run the benchmark for ten seconds (`-d10s`). Here are the results:

```
Running 10s test @ http://127.0.0.1:7096
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    16.51us    2.17us 170.00us   90.68%
    Req/Sec    57.17k     0.91k   57.77k    98.02%
  573678 requests in 10.10s, 27.90MB read
Requests/sec:  56801.42
Transfer/sec:      2.76MB
```

I"m running this on my measly M2 MacBook Air, but we're still able to handle about
56000 requests per second.

Let's now place a single log line in our server to tell us when we receive a request,
keeping everything else exactly the same:

```rust
// ..snip
fn main() -> Result<()> {
  // ..snip

  println!("Incoming request!"); // <- Our log line

  _ = stream.write_all(
    b"HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello World!",
  );
  // ..snip
}
```

And run our benchmark again:

```sh
$ wrk -t1 -c1 -d10s http://127.0.0.1:7096
Running 10s test @ http://127.0.0.1:7096
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    39.37ms   81.52ms 418.46ms   85.34%
    Req/Sec    18.43k    14.01k   55.23k    63.89%
Requests/sec:  15062.45
Transfer/sec:    750.18KB
```

Oh boy, our performance took a nosedive. We're only able to do 15000 requests a
second now?! Normally you'd profile to figure out what your bottleneck is, but in
this case it is pretty obviously our `println!`.

`stdout` is a blocking, buffered stream whose "write-end" is attached to your
process, while the "read-end" attaches to your terminal. When you write to
this stream, your bytes go to a buffer, and stay there until you write a newline
character (`\n`), at which point all your bytes are sent to your terminal to display
(in other words, `stdout` is "flushed").

**What this means is that you can only really write to `stdout` as fast as your
terminal can consume it.** If you write too quickly, your process's `write` will
block till `stdout` is flushed, meaning your process (or one of it's threads) will
stop making progress. In our case, `wrk` sends multiple HTTP requests on the same
connection, and we attempt to write the static string `Incoming request!` to `stdout`.
I ran my server (`cargo run --release`) in VSCode's terminal, which isn't the fastest,
so it slowed down our entire program. What's slow here is the VSCode terminal's
`flush`.

I'll repeat this exact same experiment, except I'll run my server on [iTerm2](https://iterm2.com/)
and [Alacritty](https://alacritty.org/) this time (remember what matters is where
I'm _printing_ from, not where I run `wrk` from):

```sh
# Server on iTerm2
$ wrk -t1 -c1 -d10s http://127.0.0.1:7096
Running 10s test @ http://127.0.0.1:7096
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    22.83us    8.80us   1.20ms   96.70%
    Req/Sec    42.06k   743.20    43.55k    93.07%
  422480 requests in 10.10s, 20.55MB read
Requests/sec:  41829.62
Transfer/sec:      2.03MB
```

```sh
# Server on Alacritty
$ wrk -t1 -c1 -d10s http://127.0.0.1:7096
Running 10s test @ http://127.0.0.1:7096
  1 threads and 1 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.58us    3.56us 240.00us   92.80%
    Req/Sec    51.27k     1.11k   53.01k    97.03%
  515471 requests in 10.10s, 25.07MB read
Requests/sec:  51039.99
Transfer/sec:      2.48MB
```

Alacritty can _almost_ keep up!

This post is mostly a PSA for myself. I'm yet to figure out how to have my cake
and eat it too -- how to log but not tank my RPS.
