import { parseTopLevel, create } from './state';
import * as ESTree from './estree';
import { OnComment, OnToken, pushComment, pushToken, Context, createScope, ScopeType } from './common';
import { skipHashBang } from './scanner';
import { report, Errors } from './errors';
import { env } from './env';
/**
 * `ECMAScript version
 */
export type EcmaVersion = 1 | 2 | 3 | 4 | 5 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020;

/**
 * The parser options.
 */
export interface Options {
  // Set to 3, 5 (default), 6, 7, 8, 9, or 10 to specify the version of ECMAScript syntax you want to use.
  // You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), or 2019 (same as 10) to use the year-based naming.
  ecmaVersion?: EcmaVersion;

  // The flag to allow module code
  module?: boolean;

  // Create a top-level comments array containing all comments
  attachComments?: boolean;

  // The flag to enable stage 3 support (ESNext)
  next?: boolean;

  // The flag to enable start and end offsets to each node
  ranges?: boolean;

  // The flag to enable line/column location information to each node
  loc?: boolean;

  // The flag to enable React JSX parsing
  jsx?: boolean;

  // The flag to attach raw property to each literal and identifier node
  raw?: boolean;

  // Set to true to record the source file in every node's loc object when the loc option is set.
  source?: string;

  // The flag to enable implied strict mode
  impliedStrict?: boolean;

  // The flag to allow return in the global scope
  globalReturn?: boolean;

  // The flag to allow experimental features
  experimental?: boolean;

  // Enables method that should be bypassed when running on NodeJS
  native?: boolean;

  // Enabled tokenizing
  tokenize?: boolean;

  // Disable web compability (AnnexB)
  disableWebCompat?: boolean;

  onComment?: OnComment;

  onToken?: OnToken;

  // Enabled directives
  directives?: boolean;
}

export const version = '2.0';

/**
 * Parse a module body, function body, script body, etc.
 *
 * @param source The source coode to parser
 * @param options The parser options
 * @param context Context masks
 */

export function parseSource(source: string, options: Options | void, context: Context): ESTree.Program {
  let onComment: OnComment;
  let onToken: OnToken;

  if (options != null) {
    // The option to specify ecamVersion
    const ecmaVersion = options.ecmaVersion || 10;
    options.ecmaVersion = <EcmaVersion>(ecmaVersion > 2009 ? ecmaVersion - 2009 : ecmaVersion);

    // The flag to enable module syntax support
    if (options.module) context |= Context.Module;
    // The flag to enable stage 3 support (ESNext)
    if (options.next) context |= Context.OptionsNext;
    // The flag to enable React JSX parsing
    if (options.jsx) context |= Context.OptionsJSX;
    // The flag to enable start and end offsets to each node
    if (options.ranges) context |= Context.OptionsRanges;
    // The flag to enable line/column location information to each node
    if (options.loc) context |= Context.OptionsLoc;
    // The flag to attach raw property to each literal and identifier node
    if (options.raw) context |= Context.OptionsRaw;
    // The flag to allow return in the global scope
    if (options.globalReturn) context |= Context.OptionsGlobalReturn;
    // The flag to enable implied strict mode
    if (options.impliedStrict) context |= Context.Strict;
    // The flag to enable experimental features
    if (options.experimental) context |= Context.OptionsExperimental;
    // The flag to enable "native" NodeJS / V8 features
    if (options.native) context |= Context.OptionsNative;
    // The flag to disable web compability (AnnexB)
    if (options.disableWebCompat) context |= Context.OptionsDisableWebCompat;
    // The flag to enable stage 3 support (ESNext)
    if (options.next) context |= Context.OptionsNext;
    // The flag to enable React JSX parsing
    if (options.jsx) context |= Context.OptionsJSX;
    // The flag to enable start and end offsets to each node
    if (options.ranges) context |= Context.OptionsRanges;
    // The flag to enable start and end offsets to each node
    if (options.directives) context |= Context.OptionsDirectives | Context.OptionsRaw;
    // The flag to attach raw property to each literal and identifier node
    if (options.raw) context |= Context.OptionsRaw;
    if (options.onComment != null) {
      if (Array.isArray(options.onComment)) onComment = pushComment(context, options.onComment);
      else onComment = options.onComment;
    }
    if (options.onToken != null) {
      if (Array.isArray(options.onToken)) onComment = pushToken(context, options.onToken);
      else onToken = options.onToken;
    }
  }

  const state = create(source, onComment, onToken);

  // Stage 3 - HashBang grammar
  skipHashBang(state, context);

  const scope = createScope(ScopeType.BlockStatement);

  const node: ESTree.Program = {
    type: 'Program',
    sourceType: context & Context.Module ? 'module' : 'script',
    body: parseTopLevel(state, context | Context.TopLevel, scope)
  };

  if (context & Context.Module) {
    for (const key in state.exportedBindings) {
      if (key[0] === '@' && key !== '#default' && (scope.var[key] === undefined && scope.lex[key] === undefined)) {
        report(state, Errors.UndeclaredExportedBinding, key.slice(1));
      }
    }
  }
  if (context & Context.OptionsRanges) {
    node.start = 0;
    node.end = source.length;
  }

  return node;
}

/**
 * Parse either script code or module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export function parse(source: string, options?: Options): ESTree.Program {
  if (env.extensible) {
    // TODO: return an extensible parse -- it will be excluded in non-extendable version by rollup building.
    return parseModule(source);
  }
  return options && options.module ? parseModule(source, options) : parseScript(source, options);
}

/**
 * Parse script code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 *
 * @param source source code to parse
 * @param options parser options
 */
export function parseScript(source: string, options?: Options): ESTree.Program {
  return parseSource(source, options, Context.Empty);
}

/**
 * Parse module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export function parseModule(source: string, options?: Options): ESTree.Program {
  return parseSource(source, options, Context.Strict | Context.Module);
}
