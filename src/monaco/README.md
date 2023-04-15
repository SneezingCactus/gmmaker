# About the minimised files in this folder

The minimised `editor.worker.raw.js` and `ts.worker.raw.js` files were created using
the [Monaco Editor Webpack Plugin](https://github.com/microsoft/monaco-editor/tree/2f51994ab53801f1d950e4931caee4f39292acbe/webpack-plugin)
with the options `{languages: ['typescript']}` and moved from the `dist` folder to
this folder.

The Monaco Editor Webpack Plugin is not itself used in the final build since it
makes the editor worker scripts separate from the main script, which makes it difficult
to build the userscript version of the mod, where everything must be in one script.