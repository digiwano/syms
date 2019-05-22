"use strict";

const sym = s =>
  Symbol.for(
    s
      .replace(/^k([A-Z])/g, (m0, m1) => m1)
      .replace(/([a-z])([A-Z])/g, (m0, m1, m2) => `${m1}.${m2}`)
      .replace(/[^a-zA-Z0-9-]+/g, " ")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ".")
  );

const get = (t, p) => {
  if (typeof p !== "string") return t[p] || undefined;
  if (!t[p]) t[p] = sym(p);
  return t[p];
};

const getp = pfx => (t, p) => {
  if (typeof p !== "string") return t[p] || undefined;
  const pp = p.replace(/^k([A-Z])/g, (m0, m1) => m1);
  const n = `${pfx}.${pp}`;
  if (!t[n]) t[n] = sym(n);
  return t[n];
};

const root = {};
root[Symbol.for("ns")] = prefix => new Proxy(root, { get: getp(prefix) });
const syms = new Proxy(root, { get });

module.exports = syms;
