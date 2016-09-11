---
title: Rebuilding node-inspector for Electron v1.3.0
date: 2016-09-11 11:00:00
description: Describes a workaround for getting node-inspector working in Electron v1.3.0+
tags:
- electron
- nodejs
- c++
---

# Introduction

*[ASAR]: Atom Shell Archive - a simple archive format.

Debugging of JavaScript code in the main Electron process is usually done with the help of the
[node-inspector][node-inspector] NodeJS module, which needs to be loaded in an Electron process
in order to access code and resources within ASAR files. However, `node-inspector` has two
dependencies that are native Node modules ([v8-debug][v8-debug] and [v8-profiler][v8-profiler]), 
which must be rebuilt to target the Node runtime embedded in Electron. The Electron docs show one
way to [rebuild these modules][rebuild-node-inspector]:

```shell
$ node_modules/.bin/node-pre-gyp --target=1.3.0 --runtime=electron --fallback-to-build --directory node_modules/v8-debug/ --dist-url=https://atom.io/download/atom-shell reinstall
$ node_modules/.bin/node-pre-gyp --target=1.3.0 --runtime=electron --fallback-to-build --directory node_modules/v8-profiler/ --dist-url=https://atom.io/download/atom-shell reinstall
```

Unfortunately as of Electron v1.3.0 rebuilding of the `v8-profiler` module will fail due to missing
`SetHiddenValue` and `GetHiddenValue` methods in `v8::Object`. Electron ships with a newer version
of V8 than NodeJS v6, and these particular methods were removed from recent versions of the V8 API.
Eventually NodeJS will upgrade to the newer V8 API, [NAN will be updated][nan-update] accordingly, and the
`v8-profiler` module will be updated to address the breaking changes, but until then you're going
to have to install a modified version of the `v8-profiler` module that works with Electron.

[node-inspector]: https://github.com/node-inspector/node-inspector
[v8-debug]: https://github.com/node-inspector/v8-debug
[v8-profiler]: https://github.com/node-inspector/v8-profiler
[rebuild-node-inspector]: http://electron.atom.io/docs/tutorial/debugging-main-process/#recompile-the-node-inspector-v8-modules-for-electron
[nan-update]: https://github.com/nodejs/nan/issues/587

# Workaround

Replacing the original `v8-profiler` module with the [modified version][v8-profiler-fork] is easy,
but locking in the replacement so that you don't have to redo it every time you checkout a fresh
copy of your project is a bit more finicky. Follow the steps below to lock in the correct version
of the module, note that the first step assumes the current working directory is the directory
containing your `package.json`.

1. Replace the `v8-profiler` module in `node-inspector`:

   ```shell
   cd node_modules/node-inspector
   npm install enlight/v8-profiler#v5.6.5-electron-v1.3 --save
   cd ../..
   ```

2. Now there's probably a redundant copy of the `v8-profiler`, remove it with `npm prune`.
   **WARNING**: This will clear out modules in `node_modules` that aren't referenced in your
   `package.json`.

3. Use the NPM `shrinkwrap` command to lock in the modified `v8-profiler` module:

   ```shell
   npm shrinkwrap --dev
   ```

   Assuming no errors occured `npm-shrinkwrap.json` will be generated in the directory containing
   your `package.json`. If errors were encountered you will need to clear out any modules in
   `node_modules` that aren't referenced in `package.json` and then try again. Once
   `npm-shrinkwrap.json` has been generated open it up and remove everything but the `v8-profiler`
   package info, the following is all that should be left:

   ```json
   {
     "name": "myapp",
     "version": "1.0.0",
     "dependencies": {
       "node-inspector": {
         "version": "0.12.8",
         "from": "node-inspector@>=0.12.8 <0.13.0",
         "resolved": "https://registry.npmjs.org/node-inspector/-/node-inspector-0.12.8.tgz",
         "dependencies": {
           "v8-profiler": {
             "version": "5.6.5",
             "from": "enlight/v8-profiler#v5.6.5-electron-v1.3",
             "resolved": "git://github.com/enlight/v8-profiler.git#607f871af2acf85ca75c3297b67989961699d7f5"
           }
         }
       }
     }
   }
   ```

   Add `npm-shrinkwrap.json` to source control so that the next time someone runs `npm install`
   after a fresh checkout NPM will install the correct version of `v8-profiler`.

4. Rebuild the `v8-profiler` to target Electron using your [method of choice][rebuild-native-module].

You can probably cheat a bit and skip the first three steps above by creating `npm-shrinkwrap.json`
manually, deleting `node_modules/node-inspector`, and then running `npm install`. Don't forget to
change the package name and version when you copy/paste the contents from step `#3` into your
`npm-shrinkwrap.json`. 

[v8-profiler-fork]: https://github.com/enlight/v8-profiler/tree/v5.6.5-electron-v1.3
[rebuild-native-module]: http://electron.atom.io/docs/tutorial/using-native-node-modules/#how-to-install-native-modules
