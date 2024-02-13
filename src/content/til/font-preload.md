---
title: "How to actually preload fonts"
description: "Turns out you need a unintuitive attribute to make it work correctly"
date: "2023-10-08"
---

_The_ best way to avoid layout shifts that occur because of font loading delays
is to serve them from your own domain and preload them. The thing is, doing it
correctly is kinda unintuitive. You'd think doing this would work:

```html
<link
  rel="preload"
  href="/fonts/MerchantREGRound.woff2"
  as="font"
  type="font/woff2"
/>

<style>
  @font-face {
    font-family: "Merchant";
    font-weight: 400;
    src: url("/fonts/MerchantREGRound.woff2");
  }
</style>
```

You've got your Webfont files served from your domain, which lets the browser
save on one TCP round-trip (not to mention you've stopped Google from snooping
on your visitors), but this doesn't quite work:

![I'm reloading a browser window with 4 big bold words and two buttons. As I do, the buttons jump around in the first 300ms of the reload.](/t/font-preload/without.gif)

All I'm doing in that video is reloading the page. Watch the `New` and `Join`
buttons on the bottom right, see how they jump around? That's happening because
the fallback font I use doesn't have the same letter-spacing as my fancy, custom
font.

The issue isn't that the preload isn't fast enough, it's that the preload isn't
happening at all. You need a `crossorigin` attribute on your preload `<link>` tag
to actually kick it off:

```html
<link
  rel="preload"
  href="/fonts/MerchantREGRound.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

And now, no intial layout shift:

![The same browser window as before, but without the buttons jumping around](/t/font-preload/with.gif)

The `crossorigin` attribute tells the browser to send over CORS headers with this
request. As far as I can tell, the issue doesn't have anything to do with CORS
since we're preloading from the same origin, but instead with browsers _requiring_
that font preloads to have CORS headers. With no value, the `crossorigin` attribute
defaults to `same-origin`, and forces CORS headers.
