---
title: "Doing exactly one thing at a time"
description: "Just re-broadcasting Alex Vasquez of CodePen"
date: "2022-11-14"
---

I first heard this from Alex Vasquez of CodePen:

> Only do one of these at a time: learn new tech or solve a new problem. Do not do
> both. One is a magical number. Do one thing at a time.

(Here's where they say it, the entire podcast is a great listen:
[https://blog.codepen.io/2022/08/03/379-chris-alex-have-been-running-codepen-for-10-years-what-have-they-learned-heres-the-top-10/#t=00:23:25](https://blog.codepen.io/2022/08/03/379-chris-alex-have-been-running-codepen-for-10-years-what-have-they-learned-heres-the-top-10/#t=00:23:25))

It sounds so simple, so obvious, but is such incredible advice. It has taken me a
while to really internalize why, and how to apply it.

Alex quotes a similar example, but for this blog, I was tempted to experiment with
new, shiny tech as I usually like to do, but I stopped myself. You see the whole
reason I even built this was to make sure I had a place to write about new things
I [learn](/til) when I learn them. You might not believe this, but this is how I
ended up here:

1. I was talking to a friend over Zoom, and thought really? This is the best we
   can do? Let me see why video conferencing is so hard.
2. I went in deep, and as I was building the website, realized that I wanted to
   fetch fonts from a CDN. I wasn't about to feed Google, so I thought I'd take a
   detour and build a font service on Cloudflare Workers.
3. I spent a week on this (I'll release it when the frontend is ready and the performance
   is acceptable), and realized that there wasn't a cheap, fast replicated database
   to match the distributed-ness of my Workers.
4. I know! Let me see what it'll take to deploy RocksDB to Fly.io regions across
   the world! One thing led to another and I'm reading up on Raft and building a
   distributed database of my own. Oh, and I'll build it in Rust because I've been
   itching to find a decently large project to learn how to ship bigger things in
   that language.
5. Gotta learn about TLS if I'm to secure this. Like, _really_ learn TLS, all the
   details.
6. I've been learninig _tons_ of new things everyday, and I wanted to be able to
   write them down, mostly for my future self. I would have liked to tweet about it,
   but I never gather to motivation to do it, so I'll just write stuff down on Notion.
7. Hey I'll build a blog, shouldn't take more than a day.

I fully intend to unwind my stack and eventually get back to my video conferencing app,
and I genuinely enjoy these detours (they teach me so many things I would never think
to investigate), but they also leave a trail of unfinished, abandoned projects. I want
to finish things. I know I won't release them till they're _just right_, but I just
want to get to the point where things mostly work, so I can actually start perfecting
them ("make it work, make it right, make it fast" and all that).

Fortunately, Alex's words helped me ship this blog in 5 hours (!!!). I wanted to
check out [Astro](https://astro.build), [VitePress](https://vitepress.vuejs.org/)
(I don't even know Vue, I thought I'd pick it up as I go 😐), and so many other
things, but I would have wasted away an entire Saturday if I went down this path.
Instead, I picked my go-to stack (Remix, Tailwind, CF Pages), and gave myself
4 hours to finish the whole thing. The end result _has_ to make it easy to just
write things down and publish them as quickly as possible. Can't look ugly either.
I overshot by an hour, but I solved one problem at a time (building the thing, instead
of pretending to build the thing by learning Vue/Astro or whatever).

On a similar note, I've been trying to implement TLS for my distributed database,
but in the spirit of "one thing at a time", I spun up a brand new project, and
focused on _just TLS_, outside of my database, and guess what, it came so naturally.
Integrating it into my database took less than a day. Doing them both together would
likely have cost me an entire weekend, most likely more.

All this being said, I think there's nuance to this advice, and there's a skill to
applying it that I'd like to develop. I could have started building my database in
TypeScript, so I could focus on _building the database_ instead of struggling with
a new language, but I think doing it in Rust has made the thing challenging enough
to keep my focus.

Anyway, if anyone's reading this, **solve only one problem at a time**.
