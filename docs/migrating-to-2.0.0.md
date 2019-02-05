# Major Changes

* Different parser options.

* Shebang skipping have been changed to match stage 3 proposal.

* Strictly follow ESTree. The ast will differ from other parsers.

* Strictly follow ECMAScript specs, some known bugs in v1.x were fixed -- it might break your app.

* Block scoping added. This haven't been fully implemented in Acorn so some code that can parse in Acorn may not parse in Cherow. Everything after the ECMA specs.

* Perf improvement and smaller code size.

