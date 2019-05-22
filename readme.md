# syms - quick/easy/canonical Symbol.for() access

This library is a "magic" proxy object, which generates `Symbol.for()` type symbols on property access *after* performing a few key normalization steps, resulting in the following:
* `syms.foo` becomes `Symbol.for("foo")`
* `syms.TWO_WORDS` becomes `Symbol.for("two.words")`
* `syms._two_words` becomes `Symbol.for("two.words")`
* `syms.twoWords` becomes `Symbol.for("two.words")`
* `syms.TwoWords` becomes `Symbol.for("two.words")`
* `syms.kTwoWords` becomes `Symbol.for("two.words")`

In short, the following:

```javascript
const syms = require("syms");
const { kSomething, ANOTHER_THING, yetAnotherThing, ["A Fourth thing"]: THING4 } = syms;
const THING5 = syms["thing #5"]

// with a namespace:
const { example, kAnotherExample, EXAMPLE_THREE } = syms[syms.ns]('my.app.name')
```

Is equivalent to:

```javascript
const kSomething = Symbol.for("something");
const ANOTHER_THING = Symbol.for("another.thing");
const yetAnotherThing = Symbol.for("yet.another.thing");
const THING4 = Symbol.for("a.fourth.thing");
const THING5 = Symbol.for("thing.5");

const example = Symbol.for("my.app.name.example")
const kAnotherExample = Symbol.for("my.app.name.another.example")
const EXAMPLE_THREE = Symbol.for("my.app.name.example.three")
```

## Motivation

JavaScript `Symbol` objects are an incredibly handy generic construct in modern JavaScript which can be utilized for many purposes, including:
* marking/documenting "internal" methods -- for example using `this[Symbol.for('perform-internal-action')]()` rather than something like `this._performInternalAction()`
* faking classical-OO style "private" methods / properties -- While these aren't technically "private", using regular string-keyed methods/props for "public" api and symbol-keyed methods/props for "private" api is one way to separate "intended public API" vs "implementation-specific" API is an entirely valid use of Symbols in javascript
* attaching your own metadata to an object you don't control -- while this is not often considered good practice, if you *ARE* going to do it, it's probably safer to use a Symbol-keyed object
* "hiding" data from `JSON.stringify` -- `JSON.stringify` will skip symbol-keyed entries when serializing objects

There are two ways of constructing a symbol: `Symbol("some-name")` or `Symbol.for("some-name")`, the difference being that `Symbol.for()` will always return the same symbol object when given the same key, while `Symbol()` always returns a unique symbol object (in other words, `Symbol("foo") !== Symbol("foo")` while `Symbol.for("foo") === Symbol.for("foo")`). You can think of this library as `Symbol.fuzzyFor()`.

## Namespaces

In order to be clean with `Symbol.for()`, it is helpful to namespace your keys with a unique prefix. For example, if you have a program named 'crayon box' and you want to define `red`, `green`, and `blue` symbols, you may want to define these as `Symbol.for('crayon.box.red')`, rather than `Symbol.for('red')`, to keep your symbols from unintentionally colliding with another color management program.

A helper is provided for creating multiple symbols using the same prefix, accessed by `syms[Symbol.for('ns')]("my.namespace")` or `syms[syms.ns]("my.namespace")`:

```javascript
const syms = require("syms");
const test = Symbol.for("one.two.three.four.five");
const {twoThreeFourFive: check1} = syms[Symbol.for('ns')]('one');
const {THREE_FOUR_FIVE: check2} = syms[Symbol.for('ns')]('one_two');
const {four_five: check3} = syms[syms.ns]('one :: two');
const {kFive: check4} = syms[syms.ns]('one/two/three');

assert.equal(test, check1);
assert.equal(test, check2);
assert.equal(test, check3);
assert.equal(test, check4);
```

## Why "." ?

The reason that `.` is used as a word separator is because modern versions of node
use `Symbol.for("nodejs.foo.bar")` style symbols, allowing things like this:

```javascript
const syms = require("syms");

const sym1 = require("util").inspect.custom;
const sym2 = Symbol.for("nodejs.util.inspect.custom");
const { NODEJS_UTIL_INSPECT_CUSTOM } = syms;
const { nodejsUtilInspectCustom } = syms;

// with the `syms[syms.ns](namespaceName)` helper, you can do stuff like this:
const { inspectCustom } = syms[syms.ns]('nodejs.util');

// sym1, NODEJS_UTIL_INSPECT_CUSTOM, and nodejsUtilInspectCustom are all the same symbol, which is also the symbol returned by ``
const {strict:assert} = require("assert")
assert.equal(sym1, sym2)
assert.equal(sym1, NODEJS_UTIL_INSPECT_CUSTOM);
assert.equal(sym1, nodejsUtilInspectCustom);
assert.equal(sym1, inspectCustom);

class MyThing() {
  [inspectCustom]() {
    return "[[ my-thing instance ]]";
  }
}

console.log(require("util").inspect(new MyThing()));
```

## "Internal" Methods

One handy usage is to "clean up" your public/official api, without actually restricting access to the actual underlying methods/properties, which can feel slightly nicer than naming like `this._internalThing`.
```javascript
const { SEND, OUT_STREAM } = require("syms");
class Whatever {
  constructor({ out = process.stdout }) {
    this[OUT_STREAM] = out;
  }
  async doSomething() {
    await someOperation();
    this[SEND]();
  }
  [SEND]() {
    this[OUT_STREAM].write("i'm sending you a message, friend, and i hope you receive it swiftly!\n");
  }
}
```

In the above, you could could change these vars to `kSend`+`kOutStream`, or
`send`+`outStream`, or whatever other format pleases you. You could also use
`const $ = require("syms")` and use `this[$.outStream]`. Consumers of a `Whatever`
instance (`const whatevs = new Whatever({out});`) can easily call `whatevs[Symbol.for("send")]()`
and `whatevs[Symbol.for("out stream")]`, without even having to know that
you're using this library, and it would hopefully be pretty obvious that they're
reaching into your internal / non-official / non-stable APIs and should do so at
their own risk:

```javascript
const out = fs.createWriteStream("/tmp/useless-file.txt");
const _send = Symbol.for('send');
const _outs = Symbol.for('out.stream');
const whatever = new Whatever({out})
whatever[_send]();
whatever[_outs].write("hello");
```
