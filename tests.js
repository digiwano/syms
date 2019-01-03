"use strict";

const test = require("ava");
const syms = require("./syms");
const uuid = require("uuid");

test("basics", t => {
  const { One, TWO, three, probablyFour: four, "What//502-3!#TCAZ$%5": five } = syms;
  t.is(One, Symbol.for("one"));
  t.is(TWO, Symbol.for("two"));
  t.is(three, Symbol.for("three"));
  t.is(four, Symbol.for("probably four"));
  t.is(five, Symbol.for("what 502-3 tcaz 5"));
  const uuid$ = uuid.v4();
  t.is(syms[uuid$], Symbol.for(uuid$));

  t.is(syms.what, syms._WHAT);
  t.is(syms.what, syms.$what);
  t.is(syms.what, syms["                         WHAT! :)"]);
  t.is(syms.what, syms.$_WHAT_$);
});
