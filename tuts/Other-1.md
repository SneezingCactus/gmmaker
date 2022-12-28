# How your mode could be causing an unknown error

So, you were making a mode and you ran into an unknown error! You might be asking yourself: "Is this my fault or GMMaker's fault?" Well, it's possible it might be your fault and something you can fix.

Most unknown errors are caused by modes setting certain parameters to values that Bonk/GMM doesn't expect to see there. For example, setting a disc's position to something that isn't a vector, or pushing an empty object into `game.graphics.drawings`, will cause an unknown error.

Analyze the recent changes you made to the code, try commenting certain parts of the code you think might be causing the error, use `game.debugLog` to check if a variable is being set to abnormal values, and you might eventually find the source of the error.

If you can't find anything, you can ask for help in [the SneezingCactus' mods Discord server](https://discord.gg/dnBM3N6H8a) or [the Bonk Modding Community Discord server](https://discord.gg/zKdHZ3e24r).