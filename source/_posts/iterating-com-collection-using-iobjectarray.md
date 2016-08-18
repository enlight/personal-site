---
title: Iterating through a COM collection using the IObjectArray interface
date: 2016-08-15 12:30
description: Annotated examples of safely iterating through IObjectArray.
tags:
- COM
- c++
---

*[COM]: Component Object Model

Every so often I need to write some code that uses COM interfaces, but since I do so rather
infrequently I often forget the COM reference counting rules. The [rules are documented on
MSDN][refrules] but the documentation could really do with some basic examples, and finding
such examples elsewhere can be rather difficult in my experience (perhaps they're all in paper
books). So this post is going to present one such example, primarily to help my future
forgetful self.

Here's a function that iterates through the objects an `IObjectArray` and invokes a callback
function for each object:

```cpp
template <typename T>
void ForEachObject(IObjectArray* objectArrayPtr,
                   std::function<void(T*)> callback)
{
  UINT count;
  if (FAILED(objectArray->GetCount(&count)))
    return;

  T* objectPtr;
  for (UINT i = 0; i < count; ++i)
  {
    // IObjectArray::GetAt() will call AddRef() on the returned object.
    if (SUCCEEDED(objectArrayPtr->GetAt(i, IID_PPV_ARGS(&objectPtr))))
    {
      callback(objectPtr);
      // Call Release() when we're done with the object to decrement the
      // reference count that was incremented by IObjectArray::GetAt().
      objectPtr->Release();
    }
    // NOTE: If IObjectArray::GetAt() fails above we just keep on going,
    //       but the error handling strategy can of course differ on a
    //       case by case basis.
  }
}
```

The same function could be written using `CComPtr`, though there really isn't much point in doing
so in this particular case:

```cpp
template <typename T>
void ForEachObject(IObjectArray* objectArrayPtr,
                   std::function<void(T*)> callback)
{
  UINT count;
  if (FAILED(objectArray->GetCount(&count)))
    return;

  for (UINT i = 0; i < count; ++i)
  {
    // This CComPtr will be destroyed at the end of each iteration, and the
    // destructor will decrement the reference count that was incremented by
    // IObjectArray::GetAt().
    CComPtr<T> objectPtr;
    // IObjectArray::GetAt() will call AddRef() on the returned object.
    if (SUCCEEDED(objectArrayPtr->GetAt(i, IID_PPV_ARGS(&objectPtr))))
    {
      callback(objectPtr);
    }
  }
}
```

And here's an example of using the function implemented above:

```cpp
int counter = 0;
ForEachObject<IShellItem>(
  objectArray,
  [&counter](IShellItem* item) { ++counter; }
);
```

[refrules]: https://msdn.microsoft.com/en-us/library/windows/desktop/ms692481(v=vs.85).aspx
