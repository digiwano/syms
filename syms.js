"use strict";
module.exports = new Proxy({}, { get: (t, p) => t[p] || (t[p] = Symbol.for(p)) });
