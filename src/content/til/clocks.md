---
title: "Monotonic clocks"
description: "Why do computers have two kinds of clocks for use in programs?"
date: "2023-03-04"
---

Did you know this snippet will not necessarily measure the time `someFunction`
takes to run?

```typescript
const start = Date.now();
someFunction();
const end = Date.now();

const duration = end - start;
// duration is not guaranteed to be positive!
```

Sure, you should use `performance.now()` to do this kind of thing, but why? The
issue isn't time precision (but that _is_ admittedly a factor). The real issue
has to do with leap seconds & NTP.

Calculating time is hard, you can be super precise about it by using atomic clocks
that use Caesium-133 atoms (TAI, or International Atomic Time), but then it doesn't
match the earth's rotation _exactly_ (GMT, Greenwich Mean Time), which means that
over a few years, 4PM would occur in the middle of the night. As
such, astronomers take GMT & TAI and correct them to get UTC (Coordinated Universal Time).
Seriously though, what is with these abbreviations not matching what they stand for 😕.

In order to issue these corrections, they have to manually add or subtract seconds
from the UTC time to make sure it doesn't drift too far from the _actual_ time.
These are called [leap seconds](https://en.wikipedia.org/wiki/Leap_second). Unfortunately,
these additions / subtractions happen every 6 months or so, but not _every_ 6 months.
This makes it really hard for computers to keep themselves up-to-date because programming
this is just way too complicated. To get around this, smart people came up with
[NTP](http://www.ntp.org/), which is a protocol used to synchronize clocks across
the world. Several servers around the world equipped with atomic clocks are hit
from regular old computers like yours and mine to adjust their local times.

In addition to leap seconds, our computers' clocks aren't precise either and slowly
drift as time passes. Fortunately, our OS keeps making these NTP calls every so often
and slows down / speeds up our system clocks to accomodate. If the drift is too long
(longer than 125ms), the OS will straight-up jump the clock to the right value.

---

Let's get back to our code snippet:

```typescript
const start = Date.now();
someFunction();
const end = Date.now();

const duration = end - start;
// duration is not guaranteed to be positive!
```

If this OS clock correction happens as your `someFunction` is running, it might
have added or removed a few milliseconds from your computer's `Date`, which means
that `end` can be smaller than `start`!

To resolve this, OSes will provide a second type of clock, called a **monotonic clock**.
The difference here is that this clock is an _always increasing_ clock; it is not
affected by NTP corrections. The problem is that the _value_ of this clock doesn't
really mean anything. It could be the uptime of your computer, or it could be any
arbitrary timestamp. However, if you subtract two values of this clock, you are
guaranteed to get the correct amount of time that elapsed.

JavaScript's `performance.now` uses a monotonic clock, which is why you should
use it when calculating time durations to make sure they are accurate. It is also
why `console.log(performance.now())` is just some random-looking number instead
of a Unix timestamp.

Martin Kleppmann has an [incredible video](https://www.youtube.com/watch?v=mAyW-4LeXZo)
about this (it's not even that long). If you're interested in the history of
time calculation, you could also watch [this one](https://www.youtube.com/watch?v=FQ_2N3AQu0M),
which is equally as interesting!
