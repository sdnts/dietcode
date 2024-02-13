---
title: "Cryptographic Signatures"
description: "What are signatures and what are they good for?"
date: "2022-11-14"
---

**A signature is an encrypted hash**. A "signed" payload is proof that it was sent
by the signer. It is also proof that the payload hasn't changed since it was signed.
It can be useful when you want an end-user to be able to view / read secure data
but not change it.

In TLS, a server signs its certificate to prove that they are who they say they
are. What this means is that during a TLS handshake, the server will take its
certificate, MD5 hash it, encrypt the hash _with its private key_ using an agreed
algorithm, and send back the resulting value along with the certificate. The client
can then decrypt the signature using the server's public key, and if it gets back
the same value as the certificate, it can trust that the certificate was signed
by someone who knows the server's private key (which is the server, and only the
server).

When you get an app signed by Apple before submitting it to the App Store, a similar
thing happens. You upload your app to App Store Connect, Apple scans it for dodgy
code, hashes the app's binary, encrypts the hash with its private key, and appends
this hash to the binary. Now when a user tries to open the app, iOS / macOS will read
this signature, decrypt it, and match it with the binary's MD5 hash. If it matches,
it knows that this app hasn't changed since you uploaded it to App Store Connect,
and so it is safe to execute.

Signatures aren't necessarily related to symmetric-key cryptography either. If your
server wants to save a user's session in a cookie, you can sign your cookie, and then
verify the signature against the cookie's value in the server when it comes back.
This way, you can verify that the cookie was in fact issued by you. The client can
still read and use it, but if it tampers with it, you'll know, because it cannot
produce a signature that corresponds to the change it made (it would need your
encryption secret to do that, and you keep it safe, right?)
