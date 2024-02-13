---
title: "The surprisingly complex world of C++ build systems"
description: "I've been meaning to dig into C++ for a bunch of reasons, and surprisingly, getting a development environment set up on macOS was really hard. I've now set up a template repository on GitHub for anyone looking for a shortcut."
date: "2022-12-18"
---

TL;DR: I've set up a template repository with my current setup over [on GitHub](https://github.com/sdnts/cpp).
It uses Bazel to build a single binary, and is set up with a test framework ([googletest](https://github.com/google/googletest)).
If you use VSCode, it also includes a debug config and should automatically
set up IntelliSense (this apparently doesn't come for free with C++).

---

I've been learning C++ recently. I've realized that a lot of programming constructs/
abstractions in modern languages like Rust just don't make sense to me. I think
this stems primarily from my inexperience. As such, I've never really felt productive
in Rust despite trying on-and-off for the last couple of years -- nothing to show
for it (a burnout _may_ have something to do with this too 😬). I cannot use abstractions
if I cannot justify why they exist. This is just one of the ways my brain fucks me
over every day 🫠.

So I decided to give up and just learn the language Rust (and others) aim to replace,
get some first-hand experience, you know. So far, I'm kinda liking C++. I may be writing
unsafe code that will burn everything in its path but everything makes sense to
me and I'm having a lot of fun 🤷‍♂️.

I've discovered that there are a whole bunch of ways to compile your code to a binary.
C++ has a non-conventional module system, in that it doesn't have one at all. This
means all files are their own units (_translation_ units). Once you get used to this,
you quickly realize that running the compiler directly (on macOS, this is `clang`)
becomes unfeasible almost instantly. C++ doesn't have a build system like newer
languages so a lot of people have come up with ways to do this. I dug into a few
of them last week.

An issue I had with a lot of them was that there was an actual learning curve to
almost all of them. I did invest some time into learning a couple, but it was intentionally
limited because I'm also learning C++, and I didn't want to get bogged down, in the
spirit of ["doing exactly one thing at a time"](/p/one-problem-at-a-time)

Another issue was that because there is no convention, all these build systems are
naturally incompatible. This means that `#include`ing libraries that use one toolchain
is hard/impossible if you use a different toolchain (assuming you you want static
linking, which is likely). Fortunately the big players have solved this problem for
the most part.

Speaking of libraries, there isn't a package manager either, so you kinda _have_ to
pick a build system, even if it is just a bag of shell scripts. A lot of people
do seem to be converging on [vcpkg](https://vcpkg.io/) though.

Anyway, I expected this stuff from an "old" language. My reasons for learning C++
take this into account.

- [Visual Studio / MSVC](https://visualstudio.microsoft.com/): This is Microsoft's
  build toolchain, but only works on Windows, so this is not an option for me. From
  my limited research, this seems to be the most polished and "ready-to-go" option.
  This would probably be a no-brainer if you code on Windows.
- [Bazel](https://bazel.build): This was built at Google and is what I ended up with.
  It requires a fairly minimal setup and it comes with sensible defaults. The DSL
  is also the most sensible / natural (to me). This is not usually people's first
  choice though.
- [CMake](https://cmake.org/): This is the most popular toolchain outside Windows
  I think. Because it is so widely used, the toolchain interop problem I mentioned
  earlier isn't _that_ noticeable here. A lot of people admitted that once you get
  over the initial hump, this is what they will absolutely always recommend. I did
  spend time trying to learn this, but ultimately decided to stick to Bazel. Maybe
  I'll get back to this one day.
- [Make](https://www.gnu.org/software/make/): This is the most barebones. You might
  have heard about this before because it is basically a bunch of scripts that can
  interact with each other. Some people swear by handwritten Makefiles, I didn't
  go too deep because it requires extensive knowledge about the compiler. It felt
  like I'd sink a lot of time if I tried.
- [Meson](https://mesonbuild.com/) (and [Ninja](https://ninja-build.org/)): I may
  have considered this if I maybe saw this before Bazel -- this seems simple to start
  off with as well. The DSL feels CMake-like, and the project explicitly aims to
  be simple to use.
- [XMake](https://xmake.io/): This looks like the cool new kid on the block. I did
  not look into this.
- [Premake](https://premake.github.io/): This actually looks very interesting and
  simple, and I want to look into this at some point.

There are no doubt tons more. I've settled on Bazel for now because I like it the
most.

It also looks like you do not get IntelliSense out-of-the-box for non-system libraries.
This is to be expected because there is no module system! I did some research and
there are ways to generate a file (`compile_commands.json`) that will let IDEs let
you "jump-to-definition" at least, which is all I really need.

While I was at it, I also set up VSCode's debugger. I've never used this in TypeScript
because it used to be weird to do that with Node, but I want to get better at this.

Here's a template GitHub repository I've set up that has all this: [sdnts/cpp](https://github.com/sdnts/cpp).
This has a single Bazel workspace with a single package. Bazel does monorepos really
well so it should be easy to add more packages if I ever need it. The template also
includes an external library for unit tests ([google/googletest](https://github.com/google/googletest)),
which seems popular with C++ devs. On VSCode, you'll probably also want the [C/C++ extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)
(just the single extension, no need to bloat your editor up with the extension pack).
I hope to add a few GitHub Actions as well soon when I need them.
