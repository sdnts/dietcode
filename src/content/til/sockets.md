---
title: "Sockets"
description: "Talking about sockets and file descriptors"
date: "2022-11-11"
tags: ["network", "tcp"]
---

This word comes up **all** the time when you do network programming, but unfortunately
no one really explains _what_ a socket is. A Socket is a file descriptor. It is
a number that uniquely represents a resource in your process. a "resource" can be an open
file, or an open connection to some other process (which may be running on a
completely different computer over the Internet), among other things.

On a high level, when you ask the Unix/Linux kernel to open a TCP connection to another
process that is running on some IP:port (on the same computer or not), it gives you back
a file descriptor, or a socket. You can then use other syscalls, like `read`/`write`
to read raw bytes from or write raw bytes to this socket. The kernel will transparently
transport these bytes to the other end of your connection, which can then do the same.
You may be able to imagine how TCP is built on top of this basic idea.

All processes on a Unix/Linux based systems have limits to how many file descriptors
they can have open at any time. You can find out what this limit is (or even override it)
by running `ulimit -n`. Unless I'm mistaken, this is 4096 by default on macOS. I have it
set to `10240`.

Practically, this also means that a process can "run out of" file descriptors. For
example, this limits how many active connections a database process can maintain.
