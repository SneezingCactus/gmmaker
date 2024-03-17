# Vectors

Vectors in GMMaker are represented by arrays of numbers. You'll mostly find 2d vectors that define certain properties like the position of a disc, or a platform's linear velocity. The amount of numbers the array has is the amount of dimensions that the vector has. For example:

* `[10, 20]` is a 2d vector. It represents the point (x: 10, y: 20).
* `[10, 20, 30]` is a 3d vector. It represents the point (x: 10, y: 20, z: 30).
* and so on.

There's a global intrinsic object called `Vector` that contains several useful functions to manipulate vectors, such as `Vector.add()`, that allows you to add the values of a vector into another, or add a number into each parameter of a vector.