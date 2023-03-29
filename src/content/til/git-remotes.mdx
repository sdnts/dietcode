---
title: "Git remotes"
description: "Turns out setting up your own Git remote on a VPS is stupid simple"
date: "2023-03-29"
tags: ["vps", "git"]
---

**A git remote is (usually) just something called a "bare" repository.**

I've never _really_ appreciated `git`'s distributed design up until this moment.
Say you've got a `git` repository that has the `origin` remote set to a GitHub URL.
You've probably seen it hundreds of times, it looks something like: [`git@github.com:sdnts/dietcode.git`](https://github.com/sdnts/dietcode)
(except `sdnts` will be _your_ GitHub username and `dietcode` will be the name of
_your_ repository). Let's try creating a custom `git` remote called `jupiter` that
has nothing to do with GitHub, but one you can `git push` to exactly the same way.

First thing you'll need of course is a server running somewhere. I have one at
`sdnts.dev` that I can SSH into as the user `sid`. I'll run these commands on my
server:

```sh
$ mkdir /home/sid/dietcode.git
$ cd /home/sid/dietcode.git
$ git init --bare -b main
```

and that's... it. I can now add it as a custom remote on my local repository:

```sh
$ git remote add jupiter sid@sdnts.dev:/home/sid/dietcode.git
$ git push jupiter # Push to your remote just like you would to `origin`
```

([Relevant docs](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server))

---

### Wait, what just happened?

What I just did was create a "bare" `git` repository. A bare repository is like
a "normal" repository that you get when you `git clone`, except it doesn't have a working
tree -- as in, it doesn't _directly_ have the "files" you've created. Think of it
as just the `.git` folder.

When you `git push` to a remote, `git` literally SSHes into a server (pointed to
by the `remote` URL), and syncs your local working tree with the bare repository
on the server, making sure both of them have the exact same version history. If the
remote repository is "behind" your local working tree (i.e. you have commits that
it doesn't have), your commits are copied to the remote repository. If the remote
repository is "ahead" of your local working tree (i.e. it has commits you don't
have), the `git push` is rejected. You are now responsible for figuring out what
to do with these extra commits. You can "rebase" _your_ commits on top of the remote's
commits (`git pull origin --rebase`), or you can tell the remote to forcefully
discard any extra commits it has and blindly treat your commit history as canon
(`git push --force`).

(Git is _fantastic_ software with unfortunate DX, and it 100% worth it to understand
what it is doing behind the scenes. You will never again mess up history!)

Anyway, if you now try and analyze a GitHub `remote` URL, you should be able to roughly
predict what GitHub's `git` server is doing. Its remote URLs look like this:

```
git@github.com:sdnts/dietcode.git
```

1. They have a server running on `github.com`
2. This server has a user called `git`
3. There's a directory called `sdnts/dietcode.git` in the `git` user's home directory (`/home/git`)
4. The `dietcode.git` directory hosts a "bare" git repository

Surely this is highly simplified, but it is still broadly what's going on.

---

So what do you do with this information? I just think it's neat, but you _could_
combine this with server-side Git hooks to build an old-school Heroku-style deploy
experience, where you push to a `heroku` remote to deploy your website. I bet that'd
make for an interesting post.
