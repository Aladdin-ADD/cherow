import { Token } from '../token';
import { Context, Flags, LabelState } from '../common';
import { Parser, ErrorCallBack, Options } from '../types';
import * as ESTree from '../estree';
import { parseStatementList } from './statements';
import { parseModuleItemList } from './module';

/**
 * Creates the parser object
 *
 * @param source The source coode to parser
 * @param sourceFile Optional source file info to be attached in every node
 */
export function createParserObject(source: string, errCallback?: ErrorCallBack): Parser {
    return {
        // The source code to parse
        source: source,
        // Source length
        length: source.length,
        // Current position
        index: 0,
        // Current line
        line: 1,
        // Current column
        column: 0,
        // Start position  before current token
        startIndex: 0,
        // Start position column before current token
        startColumn: 0,
        // Start position line before current token
        startLine: 1,
        // End position after parsing after current token
        lastIndex: 0,
        // End column position after current token
        lastColumn: 0,
        // End line position after current token
        lastLine: 0,
        // Mutable parser flags. Allows destructuring by default
        flags: Flags.Assignable,
        // Tokenizing
        tokens: [],
        // Label tracking
        labelSet: undefined,
        labelSetStack: [],
        iterationStack: [],
        labelDepth: 0,
        switchStatement: LabelState.Empty,
        iterationStatement: LabelState.Empty,
        functionBoundaryStack: undefined,
        // Regular expression
        capturingParens: 0,
        largestBackReference: 0,
        // Misc
        token: Token.EndOfSource,
        tokenValue: undefined,
        tokenRaw: '',
        tokenRegExp: undefined,
        onError: errCallback,
    };
}

/**
 * Creating the parser
 *
 * @param source The source coode to parser
 * @param options The parser options
 * @param context Context masks
 */
export function parseSource(
    source: string,
    options: Options | void,
    /*@internal*/
    context: Context,
    errCallback?: any): ESTree.Program {
    let sourceFile: string = '';
    if (options !== undefined) {
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
        // The flag to attach raw property to each literal node
        if (options.raw) context |= Context.OptionsRaw;
        // Attach raw property to each identifier node
        if (options.rawIdentifier) context |= Context.OptionsRawidentifiers;
        // The flag to allow return in the global scope
        if (options.globalReturn) context |= Context.OptionsGlobalReturn;
        // The flag to allow to skip shebang - '#'
        if (options.skipShebang) context |= Context.OptionsShebang;
        // Set to true to record the source file in every node's loc object when the loc option is set.
        if (!!options.source) sourceFile = options.source;
        // Create a top-level comments array containing all comments
        if (!!options.comments) context |= Context.OptionsComments;
        // The flag to enable implied strict mode
        if (options.impliedStrict) context |= Context.Strict;
        // The flag to enable experimental features
        if (options.experimental) context |= Context.OptionsExperimental;
        // The flag to set to bypass methods in Node
        if (options.node) context |= Context.OptionsNode;
        // The flag to enable tokenizing
        if (options.tokenize) context |= Context.OptionsTokenize;
        // The flag to enable web compat (annexB)
        if (options.webcompat) context |= Context.OptionsWebCompat;
        // The flag to enable editor mode
        if (options.edit) context |= Context.OptionsEditorMode;
    }

    // Create the parser object
    const parser = createParserObject(source, errCallback);
    const body = (context & Context.Module) === Context.Module ?
    parseModuleItemList(parser, context) : parseStatementList(parser, context);

    return {
        type: 'Program',
        sourceType: context & Context.Module ? 'module' : 'script',
        body: body as ESTree.Statement[],
    };
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
export function parse(source: string, options?: Options, errCallback?: ErrorCallBack): ESTree.Program {
    return options && options.module ?
        parseModule(source, options, errCallback) :
        parseScript(source, options, errCallback);
}

/**
 * Parse script code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 *
 * @param source source code to parse
 * @param options parser options
 */
export function parseScript(source: string, options?: Options, errCallback?: ErrorCallBack): ESTree.Program {
    return parseSource(source, options, Context.Empty, errCallback);
}

/**
 * Parse module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
export function parseModule(source: string, options?: Options, errCallback?: ErrorCallBack): ESTree.Program {
    return parseSource(source, options, Context.Strict | Context.Module, errCallback);
}