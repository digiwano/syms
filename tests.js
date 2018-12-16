
"use strict"

const test = require( 'ava')
const syms = require("./syms")
const uuid = require("uuid")

test("basics", t => {
  const { One, TWO, three } = syms;
  t.is(One, Symbol.for("One"))
  t.is(TWO, Symbol.for("TWO"))
  t.is(three, Symbol.for("three"))
  const uuid$ = uuid.v4()
  t.is(syms[uuid], Symbol.for(uuid));
})
