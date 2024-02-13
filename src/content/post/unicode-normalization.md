---
title: "Unicode normalization"
description: "How can two unicode characters look the same but mean different things?"
date: "2022-11-24"
---

So turns out Unicode is the gift that keeps on giving.

Today at work, I noticed that there was a specific Japanese character (`ク`) that
was throwing our code into an infinite loop. Can you spot the difference between
`グ` & `グ`?

They're the same character, and yet they aren't. They _represent_ the same character
(the Japanese character `gū`, if I'm not mistaken), they're _rendered_ the same,
but the underlying bytes are very different:

```typescript
const encoder = new TextEncoder();

const diacritic = encoder.encode("グ");
const normalized = encoder.encode("グ");

console.log(new Uint8Array(diacritic).join(",")); // Prints `227, 130, 176`
console.log(new Uint8Array(normalized).join(",")); // Prints `227, 130, 175, 227, 130, 153`
```

You'll be able to see this difference if you carefully copy both characters in a
text editor like VSCode, then try to move through the characters using arrow keys.
By that, I mean place your cursor before the characters, and press the right arrow
key until your cursor is after the characters. You'll notice that it takes **two**
right arrow presses to go through one of them. This is because one of the two characters
is actually made up of two unicode characters that are rendered as one.

If you speak a language like this, you might have already figured out what's going on, but for others, here
is (hopefully) a much more "common" example: `ü`. In German, you can place an "umlaut"
over certain characters to change how they sound. In unicode, there are actually
two ways to represent this: "a `u`, followed by an umlaut", or "a `u` with an umlaut".
Since both of these _mean_ the same thing, they are rendered the same by your browser/
text editor/whatever. The former is made up of two unicode characters, the `u` and
an umlaut, and the latter is just a single unicode character: u with umlaut.

![U with umlaut can be deconstructed as two unicode characters, a u and an umlaut](/p/unicode-normalization/umlaut-deconstruct.png)

This quickly becomes a problem for computers, because to them these two characters
(u followed by umlaut & u with umlaut) are actually completely different things.
For example, `"ü" == "ü"` will always yield `false``, because one of them has a diacritic
(umlauts are a diacritic, a language term for "modifier"), and the other doesn't.
Because such characters can be represented in two different ways, we came up with
conventions about how to represent them, and this is where normalization comes from.

One such convention is called NFC. Here, we always represent such characters as a
single unicode character, so "u followed by umlaut" gets converted to "u with umlaut",
and the other one stays the same. To do this in JavaScript, you use the [String.normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
function:

```typescript
const single = "ü";
const multiple = "ü";
console.log(single === multiple); // Prints `false`

const normalized = multiple.normalize("NFC");
console.log(single === normalized); // Prints `true`
```

In this case, both these characters are said to have canonical equivalence, fancy-talk
for "they're equivalent characters". Another convention is called NFD, where we
represent such characters as two separate characters, so "u with umlaut" gets
converted to "u followed by umlaut", and the other one stays the same.

There are two other normalization forms, they handle such characters slightly differently (NFKC & NFKD).
You can read up on those if you're interested, but the end goal is the same: **to represent similar characters in the same way**.

So if you're storing any kind of unicode so that you can search over it later (like R2
does for object metadata), always remember to `.normalize` before storage, and `.normalize`
before searching, so you don't get bitten! There are no doubt certain use-cases
where _not_ normalizing would be the correct thing to do, but I'd imagine those are rare.

During my research, I also found that unicode normalization is also useful in
machine learning, because they'd like to treat `❶`, `𝟏`,`𝟙` & `1` as the same thing
(even though they're different unicode characters).
