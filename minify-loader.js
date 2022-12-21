const {minify} = require('terser');

/**
 * how come there's no loader for this
 * @param {String} source the source
 * @return {String} the return
 */
module.exports = async function(source) {
  const shit = await minify(source, {
    ecma: '2021',
    toplevel: true,
  });
  return shit.code ?? '';
};
