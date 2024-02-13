---
title: "Vagrant"
description: "Vagrant lets you spin up pre-configured VMs on-demand. I figure out what I can do with this."
date: "2022-12-12"
---

Vagrant lets you spin up pre-configured VMs on-demand. I presume this is extremely
useful for people looking to create reproducible environments quickly (I've heard
of Nix, I just haven't gotten around to it yet).

Vagrant's DX is similar to Docker's to me. You create a `Vagrantfile` that describes
how to build your "box" (which is what it calls preconfigured VM images), then Vagrant
can bring it up whenever you want. This is the simplest `Vagrantfile`; it will bring up
a VM with vanilla Debian:

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "debian/bullseye"
end
```

Then you run:

```sh
vagrant up
```

in the directory with your `Vagrantfile`. Vagrant stores the VM's state in a `.vagrant`
directory next to the `Vagrantfile`, so you'll have to make sure you run `vagrant up`
in this directory only. In general, you'll run all `vagrant` commands in this directory.
Very few of them actually work in a global context.

`vagrant up` boots up your VM (downloading the initial box if needed), then exits
(so the first boot is significantly slower). If you want to see what VMs are running,
you do:

```sh
vagrant global-status
```

You can SSH into a running VM by:

```sh
vagrant ssh
```

Remember to stop a VM:

```sh
vagrant halt
```

And destroy it after you're done:

```sh
vagrant destroy
```

One cool thing I learnt is that Vagrant doesn't include a virtualization engine like Docker,
it leans on something you already have installed (this is called a `provider`).
It defaults to `VirtualBox`, but you can switch it to whatever. This means it is
very flexible, but also that the "just works" factor is probably not as high as you
might expect. By default, you'll want _both_ Vagrant and VirtualBox installed. I'm
on an M1 chip, so I needed to switch the emulation engine to QEMU and install that
instead. I wrote a post about how I got that to work here: [Virtual Machines on the M1](/p/m1-vms)

Vagrant also supports provisioners like [`Ansible`](https://www.ansible.com/)
that will let you configure your VM the way you please when
it boots up. You can install stuff like `nginx` so you don't have to do it manually
everytime (this is what provisioning means, at least in this context: to set up a
machine in some specific way).

Once you provision a box, you can package it up into a _new_ box. This lets you skip
provisioning the next time you create a new VM. You can also share this new box with
folks so _they_ don't have to worry about provisioning:

```sh
vagrant package
```

[Vagrant Cloud](https://app.vagrantup.com/boxes/search) has a bunch of such pre-packaged
boxes for you to start off with. Just remember to make sure the box you want is compatible
with the virtualization engine you use. The `Provider` segmented control on the search
page will let you do that.

I personally really like the [`Packer`](https://packer.io) workflow though, which
I'll write about in a few days. I haven't tried out Vagrant's provisioners.

Very cool stuff!
