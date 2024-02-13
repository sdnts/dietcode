---
title: "Anycast & BGP routing"
description: 'How do CDNs route traffic to the nearest datacenter if your website only has a single IP address? How do they _know_ which datacenter is closest? What does "closest" even mean?'
date: "2023-02-13"
---

Modern edge networks advertise code execution near the "eyeball". When you deploy
a Cloudflare Worker / Fly app / Deno function, you get back a custom
domain / IP address for it. If you hit this URL / IP address from Japan, your app
runs near Japan. If you hit it from New York, your app runs somewhere in the eastern
United States. If you're hitting the same IP address, how is it that two completely
separate servers answer your request? Weren't we told that one IP address belongs
to one server?

Anycast is at the heart of distributed systems, and is the answer to all these questions.
**In an anycast network, one IP address is shared by multiple servers**. Mind you,
an anycast network is different from a load-balanced network. In a network where
multiple servers are fronted by a load balancer, the request always goes to the load
balancer first, and it decides which server replies. If you're in Japan and the load
balancer is in Frankfurt, your request _will_ go to Frankfurt, then maybe back to
Japan. In an anycast network, your request would go directy to a server in Japan.

DNS (the thing that translates a website's domain to an IP address) isn't aware
of geography, so how does this work?

---

When your browser sends a network packet out into the world, it is the job of routers
to make sure this packet reaches its destination. Routers are smart little things,
they can work together to decide what route your packet takes to your destination.
I'm not talking about our regular old home routers, I'm talking about the big ones
that belong to ISPs and big companies. These routers have access to something called [BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol) metrics.
The Internet is a network on networks, and each network announces BGP metrics about
itself. These metrics describe the shape/congestion of the network, and is what
the big Cisco routers use to calculate the most optimal route for your packets.

BGP metrics _are_ geographically aware, so an ISP router in Japan calculates the route
of your packets to a server in Japan, and a different one in New York calculates
the route to a server in New York, _even though the destination IP address is the same_!
It is the job of the subnetwork itself (like Cloudflare / Fly / Deno) to make sure
that the BGP metrics it advertises are correct. If Cloudflare's BGP announcements
were incorrrect, routers would no longer be able to locate Cloudflare's network, and
as a result, _every website_ behind Cloudflare would just vanish off the face of
the earth. Cloudflare can also modify these BGP announcements to make itself more
efficient. Say a datacenter in Frankfurt catches fire. BGP metrics can (and will)
be modified to steer traffic to a different datacenter, or perhaps to Berlin instead.

Here's an article from Cloudflare themselves that also explains BGP routing:
[What is BGP? | BGP routing explained](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/)

You might also remember a Facebook outage from 2021 that made it unreachable. BGP
was the culprit there as well, and the outage may make more sense now. Cloudflare,
yet again, has an article if you want to dive deeper into the rabbit-hole:
[Understanding how Facebook disappeared from the Internet](https://blog.cloudflare.com/october-2021-facebook-outage/)

---

This was a super high level overview of anycast & BGP routing, frankly because I
don't have nearly enough experience to delve into details without being incorrect.
There's more to running your own anycast network than renting servers & tech, and this somewhat whimsical,
but thoroughly informative article goes into a lot more detail: [Build your own Anycast Network in Nine Steps](https://labs.ripe.net/author/samir_jafferali/build-your-own-anycast-network-in-nine-steps/).
