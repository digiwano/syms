# syms.js

This is an incredibly simple wrapper around `Symbol.for()` using a `Proxy` object.

In short, the following:

```javascript
const { Something, ANOTHER_THING, yetAnotherThing, ["A Fourth thing"]: THING4 } = syms;
const THING5 = syms["thing #5"]
```

Is equivalent to:

```javascript
const Something = Symbol.for("Something");
const ANOTHER_THING = Symbol.for("ANOTHER_THING")
const yetAnotherThing = Symbol.for("yetAnotherThing")
const THING4 = Symbol.for("A Fourth Thing")
const THING5 = Symbol.for("thing #5")
```

This is just an object, where for any requested property, `Symbol.for(x)` is returned, where `x` is the property name. The entire motivation for this module is that I tend to prefer using Symbols for "internal" methods/properties/etc, and that `const {WHATEVER, WHATEVER_ELSE} = require("syms")` feels fairly convenient.

# Reasoning

Future/Modern `ES*` standards include/propose a `#`-prefixed [notation for "private"](https://tc39.github.io/proposal-private-fields/) class data -- this module is intended as an alternative for that, where the primary concern isn't "private" vs "public", but "internal" vs "external", and access to this variable is not a question of "do I have permission" vs "do I know that what I'm doing is recommended usage or not".

In RFC terms, this is meant for properties which the user `SHOULD NOT` use, rather than those that the end-user `MUST NOT` use.

In other words, what this module communicates isn't "is this `public` or `private`", but rather "is this `supported` or `unsupported`" by your API.
