---
title: "Switching out git remotes"
description: "Miscellaneous git knowledge that may be helpful when hacking on OSS repositories"
date: "2023-09-03"
tags: ["git"]
---

Say you cloned an interesting git repository and started hacking on it. You now
want to open up a PR with your changes, but you obviously don't have permissions
to push to someone else's repository.

Crap, you've got to fork the original repo to your account and create a cross-fork
Pull Request. Instead of re-doing all your work again, or messing about with git
patches, you can do something simpler:

```bash
$ git remote remove origin
$ git remote add origin git@github.com:sdnts/partykit.git
```

(except, replace the origin URL with your fork)

We've just told git to switch out the remote repository's URL from the original
author's URL to our fork's URL. This means when you push your changes, you now
push to _your_ repository, which you can then create a PR from. Sick!

(Okay this is not really a huge deal, but I felt smart doing it)
