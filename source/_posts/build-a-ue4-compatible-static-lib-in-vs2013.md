---
title: Build a UE4 compatible static lib in VS2013
date: 2014-10-29 22:00:00
tags:
- ue4
- c++
---

# Introduction

This is the first tutorial in a two (or maybe three) part series that will explain how to integrate
libraries not built by `UBT` (Unreal Build Tool) into your UE4 games or plugins. This tutorial will
cover building of static libraries in VS2013, but most of this will also apply when building
dynamic libraries.

We're going to build the [pugixml][pugixml] library, a small and lightweight XML processing library written
in C++. I've chosen this library because it doesn't have any dependencies, only consists of three 
source files, and is easy to configure, so we can focus on the details that are specifically 
relevant to Unreal Engine 4. The final VS2013 project is available on [GitHub][ue4-pugixml-module].

[pugixml]: http://pugixml.org/
[ue4-pugixml-module]: https://github.com/enlight/ue4-pugixml-module

# Configure `pugixml`

The library can be configured by editing `pugiconfig.hpp`.

Unreal Engine 4 uses the Unicode character set by default (characters are represented by `wchar_t` 
instead of `char`), so lets enable Unicode support in `pugixml`:

```c++
   #ifdef UNICODE
   // Uncomment this to enable wchar_t mode
   #define PUGIXML_WCHAR_MODE
   #endif // UNICODE
```
   
Usage of the `STL` (Standard Template Library) is frowned upon in Unreal Engine 4 code
because it comes with its own set of standard-for-ue4 classes you should use instead. Third party
libraries can still use the STL if needed. `pugixml` has the ability to use the `STL` for strings
and streams, but it can also work quite happily without it, so lets remove the `STL` dependency:

```c++
   // Uncomment this to disable STL
   #define PUGIXML_NO_STL
```
   
By default `UBT` will build projects with C++ exceptions disabled, 
it's best to keep this setting consistent across all the libraries that are linked into
a game project. We can prevent `pugixml` from throwing C++ exceptions like so:

```c++
   // Uncomment this to disable exceptions
   #define PUGIXML_NO_EXCEPTIONS
```
   
# Project Properties

## Platforms

We'll need to create 32-bit and 64-bit versions of the library. The 32-bit version will be used in 
shipping builds (by default), and the 64-bit version will be used in development editor builds.
VS2013 sets up a 32-bit platform by default, so we just need to add the 64-bit platform to the 
project. To do so:

1. Right-click on the project in the VS2013 `Solution Explorer`, select `Properties` from
   the context menu, and open the `Configuration Manager` dialog:
   ![Press on the Configuration Manager button on the Property Pages window.](/images/pugixml/PugiXml-Property-Pages-01.png)
2. Add a new platform:
   ![Select New from the Active solution platform drop-down.](/images/pugixml/PugiXml-Property-Pages-02.png)
3. Select `x64` from the drop-down, and press `OK`:
   ![Select x64 from the first drop-down.](/images/pugixml/PugiXml-Property-Pages-03.png)

## General Properties

The naming convention and directory structure you use for the library binaries is entirely up to 
you, however, future tutorials may assume you've set things up as described here.

1. Select `All Configurations` from the `Configuration` drop-down.
2. Select `Win32` from the `Platform` drop-down.
3. Set the following properties on the `Configuration Properties/General` page as indicated:
   - `Output Directory`: `$(SolutionDir)Build\\`
   - `Intermediate Directory`: `$(SolutionDir)Obj\\Win32\\$(Configuration)\\`
   - `Target Name`: `$(ProjectName)-Win32-$(Configuration)`
4. Press the `Apply` button.
   ![](/images/pugixml/PugiXml-Property-Pages-04.png)
5. Select `x64` from the `Platform` drop-down.
6. Set the following properties under the `Configuration Properties/General` section as indicated:
   - `Output Directory`: `$(SolutionDir)Build\\`
   - `Intermediate Directory`: `$(SolutionDir)Obj\\Win64\\$(Configuration)\\`
   - `Target Name`: `$(ProjectName)-Win64-$(Configuration)`
7. Press the `Apply` button.
   ![](/images/pugixml/PugiXml-Property-Pages-05.png)
8. Select `All Platforms` from the `Platform` drop-down.
9. Ensure that the `Character Set` property is set to `Use Unicode Character Set`.

## C/C++ Properties

1. Ensure that `All Configurations` and `All Platforms` are still selected.
2. On the `Configuration Properties/Code Generation` page set `Enable C++ Exceptions` to `No`,
   and press the `Apply` button.
   ![](/images/pugixml/PugiXml-Property-Pages-06.png)
3. On the `Configuration Properties/Language` page set `Enable Run-Time Type Information` to `No`,
   and press the `Apply` button.
   ![](/images/pugixml/PugiXml-Property-Pages-07.png)
4. Return to the `Configuration Properties/Code Generation` page.
5. Select the `Debug` configuration, and ensure `Runtime Library` is set to 
   `Multi-threaded Debug DLL (/MDd)`.
6. Select the `Release` configuration, and ensure `Runtime Library` is set to
   `Multi-threaded DLL (/MD)`

# Build

You can now quickly build all four variants of the library by selecting `Build`->`Batch Build...`
from the main menu in VS2013.

![Tick Build for all Solution Configurations and press the Build button.](/images/pugixml/PugiXml-Batch-Build.png)
