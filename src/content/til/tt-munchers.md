---
title: "TT muncher macros in Rust"
description: 'TT-munching is a technique for writing complex macros in Rust. I''ll show you how to write a variadic "function" in Rust, AKA one that can take in any number of arguments.'
date: "2023-03-27"
tags: ["rust", "macros"]
---

TT munching is a technique for writing sufficiently complex macros in Rust. Once
you learn about [`macro_rules!`](https://doc.rust-lang.org/book/ch19-06-macros.html)
and start writing your own, you'll realize that for anything more complicated than
simple token replacement, writing these rules by hand gets confusing / repetitive / impossible
very quickly.

I'm assuming you know the absolute basics of declarative macros -- essentially how
to read them. Relevant chapters from [the Rust book](https://doc.rust-lang.org/book/ch19-06-macros.html)
& [Rust by Example](https://doc.rust-lang.org/rust-by-example/macros.html)
will be useful if you aren't. Think of declarative macros as regex-style replacements,
you find a certain pattern of text and replace it with a different pattern of text.

I'd also recommend installing [`cargo-expand`](https://github.com/dtolnay/cargo-expand)
because it is indispensable when writing any kind of macro code.

---

### A variadic function

Let's say you want to write a function that sums up a list of numbers recursively.
It might look something like this:

```rust
fn add(sum: usize, nums: &mut Vec<usize>) -> usize {
  if let Some(n) = nums.pop() {
    return add(sum + n, nums);
  }

  sum
}

fn main() {
  let mut nums = vec![1, 2, 3, 4, 5];
  println!("{}", add(0, &mut nums)); // Prints `15`
}
```

Don't focus on the (unnecessary) allocation or the mutability of the `Vec` too much,
instead notice how I'm recursively calling `add`, accumulating the sum in a `sum`
variable, and then returning it once I've exhausted the list.

Say I want to make this function easier to use. I'd like to be able to do:

```rust
add!(1, 2); // 3
add!(1, 2, 3); // 6
add!(1, 2, 3, 4, 5); // 15
```

Real variadic functions aren't possibile in Rust today, but we can write a declarative
macro that behaves this way! So we want a macro that will transform those calls
above into:

```rust
1 + 2
1 + 2 + 3
1 + 2 + 3 + 4 + 5
```

---

### Level 1: Hard-coded macro_rules

We might start this way:

```rust
#[macro_export]
macro_rules! add {
  ($n1:expr, $n2: expr) => {
    $n1 + $n2
  };
  ($n1:expr, $n2: expr, $n3: expr) => {
    $n1 + $n2 + $n3
  };
  ($n1:expr, $n2: expr, $n3: expr, $n4: expr) => {
    $n1 + $n2 + $n3 + $n4
  }
}
```

We're basically asking our `add` macro to match two expressions separated by
a comma, or three expressions separated by a comma, or four expresssions separated
by a comma. This means `add!(1, 2)` matches the first rule, `add!(1, 2, 3)` matches
the second rule, and so on. This may be fine if you know up-front that there will
only ever be a specific number of arguments, but clearly this isn't the way to go
otherwise (like in our case).

---

### Level 2: Recognizing a repeating pattern

We might collapse these into a single repeating pattern to improve things:

```rust
// This code does not compile

#[macro_export]
macro_rules! add {
  ( $( $n:expr ),* ) => {
    $($n + )*
  }
}
```

Er, but this won't work because we'll always end up with an incomplete expression.
Our macro would expand to `1 + 2 +`, so there would be a trailing `+` at the end,
like the compiler tells you if you run `cargo expand`:

```
error: macro expansion ends with an incomplete expression: expected expression
 --> src/main.rs:4:14
  |
4 |         $($n+)*
  |              ^ expected expression
error: could not compile `rust-playground` (bin "rust-playground") due to previous error
```

---

### Level 3: Changing the way we think

The way to "fix" our problem is to change the way we're thinking about the solution.
Instead of attempting to sum all numbers in one go, what say we try and "process"
one number at a time, just like our recursive function above did? Let's try that:

```rust
#[macro_export]
macro_rules! add {
    ( $n:expr, $( $others:expr ),* ) => {
      $n
    }
}
```

It's a little more complex than before, but what I'm doing here is treating the
incoming text as two separate things: the first is an expression, and the second
is _everything else that follows_. **This right here is the first piece of a TT muncher: splitting
the incoming code into two parts.**

Our macro doesn't do much, it basically strips out all but the first argument. If
you run `cargo expand` now, you should see that it generates:

```rust
fn main() {
    _ = 1;
}
```

---

### Level 4: Recursive macro calls

Let's try some recursion. Because `$others` contains all but the first expression,
let's call our `add!` macro again with _those_ expressions:

```rust
// This code does not compile

#[macro_export]
macro_rules! add {
    ( $n:expr, $( $others:expr ),* ) => {
      $n + $crate::add!($($others)*)
    }
}
```

This doesn't compile yet, but **it is the second piece of a TT muncher: recursion**.
There are two problems with this currently. The first is that just like regular
old recursion, our macro doesn't have a base case, so it won't ever terminate.
Let's add one:

```rust
// This code does not compile

#[macro_export]
macro_rules! add {
  ( $n:expr ) => {
    $n
  };
  ( $n:expr, $($others:expr),* ) => {
    $n + $crate::add!($($others)*)
  };
}
```

Remember that rules are evaluated from top to bottom, so it is imperative that you
put the base case _before_ the recursive case!

---

### Level 5: A TT muncher

Our second problem is that `1, 2`
isn't a valid expression in Rust, and so when someone calls `add!(1, 2, 3)`, our
recursive rule doesn't actually match `2, 3` because it isn't an `expr`. The solution
to this is to change the `expr` into a [`tt`](https://veykril.github.io/tlborm/decl-macros/minutiae/fragment-specifiers.html#tt),
and remove the comma after it because it is unnecessary now:

```rust
#[macro_export]
macro_rules! add {
  ( $n:expr ) => {
    $n
  };
  ( $n:expr, $($others:tt)* ) => {
    $n + $crate::add!($($others)*)
  };
}
```

This compiles, so if we run `cargo expand` again, we see that our macro generates:

```rust
fn main() {
    _ = 1 + (2 + (3 + (4 + 5)));
}
```

**The parenthesis should help you understand what exactly happened. Our macro matches
one expression at a time, then passes the rest of the "input" to a recursive call
to itself, which does the same. When we hit the last expression, our base case matches
it and the recursion stack unwinds, generating exactly the code we want.**

You've just written a TT muncher! It's called that because what we're doing here
is consuming one `tt` at a time. It takes some practice to build intuition for TT
munchers, so I would highly recommend writing some of your own. Once you do develop
this intuition though, they become second-nature pretty quickly, and unlock
a whole new level of declarative macros you can write.

There's a lot more you can do with TT munchers -- in fact they are all you need to
know to completely implement seemingly complicated macros like the [`trace!`](https://docs.rs/tracing/0.1.37/tracing/macro.trace.html) / [`error!`](https://docs.rs/tracing/0.1.37/tracing/macro.error.html)
macros that [`tracing`](https://docs.rs/tracing) or [`log`](https://docs.rs/log)
crates expose. These accept a format string, arguments for this format string, and
optional key-value pairs, short-hand key-value pairs, along with special sigils
that describe how to format these key-value pairs. But _all_ that comes down to understanding
how TT munchers operate.

I have an [extensive post](/p/tracing-macros) digging into that specifically, where
I build [`tracing`'s `trace!`](https://docs.rs/tracing/latest/tracing/macro.trace.html)
macro from scratch, if that intrigues you.
