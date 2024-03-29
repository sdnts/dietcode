---
title: "Convert Rust enums to inner values"
description: "A deceptively simple problem. I wanted to basically create a method on a Rust Enum that has different return types based on the active enum variant. The solution I came up with works in the same way as `std::str::parse` does. Very powerful and extensible."
date: "2023-01-04"
---

I've developed what I think is a pretty neat way to transform a Rust `enum` instance
into one of its variants' internal values. I don't want to say I invented it because
I think this may be a bit too basic to to be novel.

Here's the problem: You have an `enum` with two variants, each of which hold different
kinds of data:

```rust
enum IpAddr {
  V4([u8; 4])
  V6([&'static str; 8])
}
```

and you want to have a method on this enum that returns either `[u8; 4]` if the `V4`
variant is active, or `[&'static str; 8]` if the `V6` variant is active. Of course you
could make everything `pub` and be done with it, but that's leaky. A straight-forward
way to do this would be to introduce two methods on the `enum` ([Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=0c03e5ba4dc13806f2604bd753ca9ca1)):

```rust
impl IpAddr {
  pub fn v4(self) -> Result<[u8; 4], _> {
    match self {
      // ...
    }
  }

  pub fn v6(self) -> Result<[&'static str'; 8], _> {
    match self {
      // ...
    }
  }
}
```

This works perfectly fine, but I don't like the look of it. I can totally imagine
wanting a method that returns a `String` for the variants instead of fixed-length
arrays like we have. We'll then have to come up with new names for these methods.

The other way is to implement the `TryInto`/`TryFrom` traits on the `IpAddr` enum.
This is also a great (idiomatic even) solution, but I wanted something more generic
(literally).

Enough teasing, here's what I want to be able to do:

```rust
let ip = IpAddr::V4([0u8; 4]);
let inner = ip.decay::<[u8; 4]>();
assert_eq!(inner, [0u8; 4]);

let ip = IpAddr::V6(["0000"; 8]);
let inner = ip.decay::<[&'static str; 8]>();
assert_eq!(inner, ["0000"; 8]);
```

We can alias some types if they get unwieldy, but the basic idea is to have something
like [`std::str::parse`](https://doc.rust-lang.org/stable/std/primitive.str.html#method.parse).
A single method you call that lets you control what it returns using the turbofish.

The way you do this is using a custom trait. I call it `Decay`. It is super simple:

```rust
pub trait Decay: Sized {
  fn decay(value: IpAddr) -> Result<Self, EnumError>;
}
```

Now you can implement this trait for as many conversions as you'd like! Here are
a few examples:

```rust
// Simple value decay
impl Decay for [u8; 4] {
  fn decay(value: IpAddr) -> Result<Self, EnumError> {
    match value {
      IpAddr::V4(v) => Ok(v),
      _ => Err(EnumError),
    }
  }
}

// More complex transformation.
// Notice how `String` isn't even a possible enum variant data type
impl Decay for String {
  fn decay(value: IpAddr) -> Result<Self, EnumError> {
    match value {
      IpAddr::V4(v) => Ok(format!("{}.{}.{}.{}", v[0], v[1], v[2], v[3])),
      IpAddr::V6(v) => Ok(format!(
        "{}::{}::{}::{}::{}::{}::{}::{}",
        v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7]
      )),
    }
  }
}
```

You can then do a conversion this way:

```rust
Decay::decay::<String>(ip);
```

For convenience, let's create a `decay` method on our `enum` directly. We're not
implementing `Decay` on `IpAddr`, just creating a method that happens to be called
`decay` as well, because it best describes the action. We could totally call this
something else.

```rust
impl IpAddr {
  pub fn decay<T: Decay>(self) -> Result<T, EnumError> {
    Decay::decay(self)
  }
}
```

With this in place, we can finally do some clean-looking transformations:

```rust
let ip = IpAddr::V4([0u8; 4]);
let inner = ip.decay::<String>();
println!("{}", inner.unwrap());
```

Here's a playground that you can play around with: [Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=74ccec023f2353c08799738660fc54fc)
