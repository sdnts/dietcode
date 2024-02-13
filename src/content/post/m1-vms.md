---
title: "Virtual Machines on the M1"
description: 'I discovered what it takes to run VMs on an M1, especially because they don''t "just work"'
date: "2022-12-13"
---

For reasons that might become clear in a later post, I've been trying to get a simple
Debian VM running on my M1, and it turns out this is not as easy as it was on Intel
processors.

VM managers like VirtualBox / VMWare / Parallels are virtualization engines, not CPU
emulators, which is to say that they cannot run/translate CPU instructions meant for
x86 processers on ARM chips (and is a _much_ harder problem). When Apple switched
to ARM (like 2 years ago!), they made all these tools fundamentally incompatible with
the new M1 machines. I'm also led to believe Rosetta2 doesn't help in these cases
because it runs at a higher level in the software stack. I might be wrong here.

If you're looking for a simple GUI solution today, your best bet is [UTM](https://mac.getutm.app/).
It's the closest you'll get to the "just works" category. UTM is powered by QEMU,
which _is_ a CPU emulator (more on this later), so it can run both ARM and x86 OSes.
They even have an iOS app, WTF! It does need jailbreaking as far as I can tell though,
I've never needed a VM on-the-go to be honest.

VirtualBox also has an [ARM build for the M1](https://www.virtualbox.org/wiki/Downloads)
these days, but they mark it as a "developer preview", and boy is it Beta software
like no other. I couldn't get anything to work with it after trying for hours. Would
not recommend, unless you're reading this when it has stabilized.

The paid options (VMWare Fusion & Parallels) look more promising, especially because
they're not cheap, but I didn't give these a shot, my experiment didn't justify spending
upwards of a €100 for software that 1: I didn't know worked, and 2: I might not touch
again.

If you're looking for something more lightweight (like a Debian machine without a
desktop environment that you can SSH into), the story is a lot shakier. [`libvirt`](https://libvirt.org/)
is an open-source virtualization library for \*nix systems that seems fundamental
for virtualization. I believe this does CPU emulation. Built on top of this is software
called [`QEMU`](https://www.qemu.org/), which is what powers UTM. But we can pair
QEMU with [`Vagrant`](https://vagrantup.com) to spin up VMs pretty easily (once you
figure out what's going on, at least. I took me _days_ to get to this point 😔).

First, we'll install Vagrant & QEMU, which I see as a souped-up Docker. We'll want to install
a QEMU plugin for it. I found [vagrant-qemu](https://github.com/ppggff/vagrant-qemu),
which works splendidly. It has a few limitations (like lack of support for `vagrant package`),
but these don't matter for what we're trying to do right now:

```sh
$ brew install vagrant
$ brew install qemu
$ vagrant plugin install vagrant-qemu
```

Next, we'll want to find a prebuilt Vagrant Box for Debian over at [Vagrant Cloud](https://app.vagrantup.com/boxes/search).
Switch the `Provider` segmented control to `libvirt` and search for `Debain 11`.
Okay spoiler alert: the official `bullseye` image does not work. I gave it a fair
shot, but in the interest of getting somewhere, I ultimately decided to give up on
it and instead used [this box](https://app.vagrantup.com/perk/boxes/ubuntu-2204-arm64),
which is based on Ubuntu instead (close enough).

Almost there -- you'll want to create a file called `Vagrantfile` (no extension) somewhere
on your filesystem with these contents:

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "perk/ubuntu-2204-arm64"
  config.vm.provider "qemu" do |vb|
  end
end
```

and then run `vagrant up` in this directory. Vagrant will download this box (which might
take a bit, be patient!), then use QEMU to boot up an Ubuntu VM! It'll create a `.vagrant`
directory, which will store this VM's state. The CLI exits after `vagrant up` by
the way, so if you want to check the status of your VM, you should be able to run
`vagrant global-status`.

Now we can finally SSH into this machine by running:

```sh
$ vagrant ssh
```

Note that you'll have to run this in the directory with your `Vagrantfile`. Like I
said, Vagrant stores the machine's state in this directory.

Once you're done, you'll probably want to shut the machine down using `vagrant halt`
(again in the same directory). If you want to delete this VM, you'll do `vagrant destroy`
(again in this directory).

Success!

---

One thought that entered my brain during all this was: what about Docker? I learned
that Docker images are built to be as lightweight as possible so they can be spun
up quickly, and as such, are incredibly barebones. If you boot up an Ubuntu image
on Docker, it doesn't even have `sudo` on it. More importantly though, Docker's init
system is bespoke (or at least I think it is), which is to say PID 1 isn't actually
`init.d` or `systemd`, which is extremely problematic for what I was trying to do.
You _can_ install a full-blown OS on it though. I came across [this article](https://betterprogramming.pub/managing-virtual-machines-under-vagrant-on-a-mac-m1-aebc650bc12c)
that does exactly this, if you're interested. Docker can also be used as the virtualization
engine for Vagrant, so this might be cool to you.

For now though, I like my Vagrant + QEMU setup a _lot_. This is cool tech.
