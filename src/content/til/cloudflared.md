---
title: "cloudflared"
description: "cloudflared is a bit of a niche technology for me because it only shines when you run some kind of server that is open to the Internet, but boy does it shine bright!"
date: "2023-02-21"
---

`cloudflared` establishes a direct connection from your device to Cloudflare's network
(referred to as a tunnel) and allows full duplex communication on both ends. What
this means is that you can expose a service running on your machine to the Internet
without having to open up a port / obtain a static IP / inviting attacks. It does
lock you into Cloudflare's network, but in return you get all kinds of DDoS & bot
protection for free.

Little disclaimer: I do work at Cloudflare, but not on `cloudflared`; I just think
it's cool tech. If you're not so keen on the lock-in, [`ngrok`](https://ngrok.com)
is a similar alternative, although I personally haven't given that a shot yet.

`cloudflared` is a bit of a niche technology for me because I only run one "server":
my old Raspberry Pi that runs [PiHole](https://pi-hole.net/) & a Samba server for
archival storage of important
files. This isn't open to the Internet for safety reasons, because I don't really
consider myself competent enough to secure my Pi properly. Plus, I need a static
IPv4 address, which are hard & expensive to get, especially if you just want a single
one and not a whole block. This means that I can only access my files when I'm physically
at home, which _usually_ isn't a huge deal.

Recently though, I've rented a [Hetzner](https://hetzner.com) VPS for reasons that will become apparent
in an upcoming post, and I wanted to obviously be able to reach it from wherever
I was. There's a [Grafana](https://grafana.com) instance running on there on `:3000` that I wanted to be
able to access on `https://grafana.sdnts.dev`. Here's how I did it:

1. I installed `cloudflared` on my VPS following instructions for Debian bullseye
   on [Cloudflare's docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation#linux).
2. I opened up my [Zero Trust dashboard](https://one.dash.cloudflare.com), headed
   over to the `Access > Tunnels` section from the sidebar, and created a tunnel.
   The instructions are pretty self-explanatory, you basically just run a command
   on your VPS that sets `cloudflared` up as a systemd service, and your tunnel
   shows up on the dashboard.
3. On the last step, it asks you set up a public hostname, and this is where you
   set up a mapping from a public domain to a service running on your machine, something
   like this:
   ![A screenshot with text boxes that describe the mapping from the VPS's local port 3000 to the public hostname grafana.sdnts.dev.](/t/cloudflared/cloudflared-hostnames.png)
   This tells `cloudflared` to forward all `HTTP` traffic on `grafana.sdnts.dev` to `localhost:3000`,
   pretty straight-forward, right? You can also forward other kinds of traffic if
   you wanted.

And that's... it really. It takes effect almost immediately. If you visit the hostname you set up,
you should be able to see your Grafana instance (or whatever you have running).
Another much smaller advantage of this setup is that I can have multiple HTTP services
running on my VPS, all under different hostnames, without taking up multiple IPv4
addresses.

The second half of this setup is [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/),
which basically sets up an authentication page in front of your domain, and lets
you define who is allowed to access stuff behind it. I've set it up to force you
to authenticate against GitHub, and have allow-listed only myself. This is why _you_
the reader won't be able to see what's behind [https://grafana.sdnts.dev](https://grafana.sdnts.dev),
at least not yet 😄
