'use strict';

module.exports = formatpath;

function formatpath (p) {
  // console.log('path', path)
  if (p) {
    const sep = p.sep
    if (sep === '/') {
      return p
    } else {
      return p.replace(/\\/g, '/')
    }
  }
  return p
}
