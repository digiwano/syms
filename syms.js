"use strict";

const sym = s =>
  Symbol.for(
    s
      .replace(/([a-z])([A-Z])/g, (m0, m1, m2) => `${m1} ${m2}`)
      .replace(/[^a-zA-Z0-9-]+/g, " ")
      .toLowerCase()
      .trim()
  );

const get = (t, p) => t[p] || (typeof p === "string" ? (t[p] = sym(p)) : null);
const syms = new Proxy({}, { get });

module.exports = syms;
