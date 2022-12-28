# GMMaker's coordinate system

GMMaker mainly uses bonk.io's internal coordinate system, which is quite different than the one used by the map editor, so it might take a while for you to get used to it. 

For starters, in GMMaker, point zero (x: 0, y: 0) is located on the top left corner of the screen, instead of in the center like in the map editor.

Another difference is that it doesn't remain constant to map size, like the map editor's: The bigger the map is, the smaller the distance between two points will appear. Just like how players get smaller in bigger map sizes, and bigger in smaller map sizes.

However, if you want something to have a constant size on all maps, you can divide its x and y values by `game.state.physics.ppm`.

The only places where this coordinate system isn't used is in image regions. Image regions are meant to define a rectangle region in an image to display, so pixel amounts are used instead.