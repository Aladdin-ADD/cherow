# Cherow

[![Build Status](https://travis-ci.org/cherow/cherow.svg?branch=master)](https://travis-ci.org/cherow/cherow)

Cherow is a very fast, standard-compliant [ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm) parser written in ECMAScript. 

It strictly follows the ECMAScript® 2018 Language Specification and should parse acc. these specifications

It's safe to use in production even I'm not done with this parser. I'm finishing the parser in the dev branch.

# Features 

- Full support for ECMAScript® 2018 [(ECMA-262 8th Edition)](http://www.ecma-international.org/publications/standards/Ecma-262.htm)
- Stage 3 proposals (*experimental*)
- Support for JSX, a syntax extension for React
- Optional tracking of syntax node location (index-based and line-column)
- 4400 unit tests with full code coverage

# ESNext features

`Stage 3` features support. This need to be enabled with the `next` option

- Dynamic Import
- Async generators
- Async Await
- Object spread
- Optional catch binding
- Regular Expression's new `DotAll` flag

# Options

* `next` - Enables `ECMAScript Next` support and let you use proposals at `stage 3` or higher such as `Dynamic Import`.
* `directives` - Enables support for [directive nodes](https://github.com/estree/estree/pull/152)
* `raw` - Enables the raw property on literal nodes (*Esprima and Acorn feature*)
* `comments` - Enables option to collect comments. Optional; Either array or function. Works like [Acorn](https://github.com/ternjs/acorn) onComment.
* `tokens` - If enabled each found token will be returned as either an function or an array (*work in progres*)
* `ranges` - Enables the start and characters offsets on the AST node.
* `locations` - Enables location tracking. (*4 min fix, but on hold for now*)
* `jsx` - Enables JSX

# API

Cherow can be used to perform syntactic analysis of Javascript program, or lexical analysis (tokenization).

```js

// Parsing script
cherow.parseScript('const fooBar = 123;');

// Parsing module code
cherow.parseModule('const fooBar = 123;');

```
## Parsing with options


```js

// Parsing script
cherow.parseScript('const fooBar = 123;', { ranges: true, raw: true, next: true});

```


### Collecting comments

Collecting comments works just the same way as for Acorn
```js

// Function
cherow.parseScript('// foo', 
   { 
       comments: function(type, comment, start, end) {} 
   }
);

// Array
const commentArray = [];

cherow.parseScript('// foo', 
    { 
        comments: commentArray 
    }
    );

```

## Acorn and Esprima

If you prefer Acorn, you can use some of the options to let Cherow parse and give you the same output as you would do
with Acorn. Same for Esprima.

Here is how you do it:

**Acorn**

```js

cherow.parseScript('{ a: b}', { raw: true, ranges: true });
```

**Esprima**

```js

cherow.parseScript('{ a: b}', { raw: true, directives: true });

```

# Benchmarks

See the benchmarks [here](BENCHMARK.md)


## Contribution
 
 You are welcome to contribute. As a golden rule - always run benchmarks to verify that you haven't created any
 bottlenecks or did something that you shouldn't.

*Terms of contribution:*

- Think twice before you try to implement anything
- Minimum 1.5 mill ops / sec for light weight cases, and 800k - 1 mill ops / sec for "heavy" cases
- Avoid duplicating the source code
- Create tests that cover what you have implemented
