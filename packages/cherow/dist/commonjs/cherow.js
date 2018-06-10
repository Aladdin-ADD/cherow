'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Note: this *must* be kept in sync with the enum's order.
//
// It exploits the enum value ordering, and it's necessarily a complete and
// utter hack.
//
// All to lower it to a single monomorphic array access.
const KeywordDescTable = [
    'end of source',
    /* Constants/Bindings */
    'false', 'true', 'null',
    /* Template nodes */
    'template head', 'template body', 'template tail',
    /* Punctuator */
    '=>', '(', '{', '.', '...', '}', ')', ';', ',', '[', ']', ':', '?', '\'', '"', '</', '/>',
    /* Update operators */
    '++', '--',
    /* Assign operators */
    '=', '<<=', '>>=', '>>>=', '**=', '+=', '-=', '*=', '/=', '%=', '^=', '|=',
    '&=',
    /* Unary/binary operators */
    'typeof', 'delete', 'void', '!', '~', '+', '-', 'in', 'instanceof', '*', '%', '/', '**', '&&',
    '||', '===', '!==', '==', '!=', '<=', '>=', '<', '>', '<<', '>>', '>>>', '&', '|', '^',
    /* Variable declaration kinds */
    'var', 'let', 'const',
    /* Other reserved words */
    'break', 'case', 'catch', 'class', 'continue', 'debugger', 'default', 'do', 'else', 'export',
    'extends', 'finally', 'for', 'function', 'if', 'import', 'new', 'return', 'super', 'switch',
    'this', 'throw', 'try', 'while', 'with',
    /* Eval & arguments */
    'arguments', 'eval',
    /* Decorators */
    'at',
    /* Private names or shebang comment start */
    '#',
    /* Strict mode reserved words */
    'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield',
    /* Contextual keywords */
    'as', 'async', 'await', 'constructor', 'get', 'set', 'from', 'of',
    /* Comments */
    'SingleComment', 'MultiComment', 'HTMLComment',
    /* WhiteSpace */
    'space', 'tab', 'line feed', 'carrige return',
    /* Numbers */
    'bigInt',
    /* Enum */
    'enum'
];
/**
 * The conversion function between token and its string description/representation.
 */
function tokenDesc(token) {
    if ((token & 255 /* Type */) < KeywordDescTable.length) {
        return KeywordDescTable[token & 255 /* Type */];
    }
    else {
        throw new Error('unreachable');
    }
}
// Used `Object.create(null)` to avoid potential `Object.prototype`
// interference.
const descKeywordTable = Object.create(null, {
    this: { value: 8283 /* ThisKeyword */ },
    function: { value: 8276 /* FunctionKeyword */ },
    if: { value: 8277 /* IfKeyword */ },
    return: { value: 8280 /* ReturnKeyword */ },
    var: { value: 8260 /* VarKeyword */ },
    else: { value: 8271 /* ElseKeyword */ },
    for: { value: 8275 /* ForKeyword */ },
    new: { value: 8279 /* NewKeyword */ },
    in: { value: 301999918 /* InKeyword */ },
    typeof: { value: 570433575 /* TypeofKeyword */ },
    while: { value: 8286 /* WhileKeyword */ },
    case: { value: 8264 /* CaseKeyword */ },
    break: { value: 8263 /* BreakKeyword */ },
    try: { value: 8285 /* TryKeyword */ },
    catch: { value: 8265 /* CatchKeyword */ },
    delete: { value: 570433576 /* DeleteKeyword */ },
    throw: { value: 8284 /* ThrowKeyword */ },
    switch: { value: 8282 /* SwitchKeyword */ },
    continue: { value: 8267 /* ContinueKeyword */ },
    default: { value: 8269 /* DefaultKeyword */ },
    instanceof: { value: 301999919 /* InstanceofKeyword */ },
    do: { value: 8270 /* DoKeyword */ },
    void: { value: 570433577 /* VoidKeyword */ },
    finally: { value: 8274 /* FinallyKeyword */ },
    arguments: { value: 8388704 /* Arguments */ },
    async: { value: 4205 /* AsyncKeyword */ },
    await: { value: 4206 /* AwaitKeyword */ },
    class: { value: 8266 /* ClassKeyword */ },
    const: { value: 8262 /* ConstKeyword */ },
    constructor: { value: 4207 /* ConstructorKeyword */ },
    debugger: { value: 8268 /* DebuggerKeyword */ },
    enum: { value: 8316 /* EnumKeyword */ },
    eval: { value: 8388705 /* Eval */ },
    export: { value: 8272 /* ExportKeyword */ },
    extends: { value: 8273 /* ExtendsKeyword */ },
    false: { value: 8193 /* FalseKeyword */ },
    from: { value: 4210 /* FromKeyword */ },
    get: { value: 4208 /* GetKeyword */ },
    implements: { value: 16484 /* ImplementsKeyword */ },
    import: { value: 8278 /* ImportKeyword */ },
    interface: { value: 16485 /* InterfaceKeyword */ },
    let: { value: 16453 /* LetKeyword */ },
    null: { value: 8195 /* NullKeyword */ },
    of: { value: 4211 /* OfKeyword */ },
    package: { value: 16486 /* PackageKeyword */ },
    private: { value: 16487 /* PrivateKeyword */ },
    protected: { value: 16488 /* ProtectedKeyword */ },
    public: { value: 16489 /* PublicKeyword */ },
    set: { value: 4209 /* SetKeyword */ },
    static: { value: 16490 /* StaticKeyword */ },
    super: { value: 8281 /* SuperKeyword */ },
    true: { value: 8194 /* TrueKeyword */ },
    with: { value: 8287 /* WithKeyword */ },
    yield: { value: 16491 /* YieldKeyword */ },
    as: { value: 4204 /* AsKeyword */ },
});
function descKeyword(value) {
    return (descKeywordTable[value] | 0);
}

/*@internal*/
const errorMessages = {
    [0 /* Unexpected */]: 'Unexpected token',
    [1 /* UnexpectedToken */]: 'Unexpected token %0',
    [3 /* UnterminatedString */]: 'Unterminated string literal',
    [4 /* StrictOctalEscape */]: 'Octal escapes are not allowed in strict mode',
    [5 /* InvalidEightAndNine */]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
    [6 /* ContinuousNumericSeparator */]: 'Only one underscore is allowed as numeric separator',
    [7 /* TrailingNumericSeparator */]: 'Numeric separators are not allowed at the end of numeric literals',
    [8 /* ZeroDigitNumericSeparator */]: 'Numeric separator can not be used after leading 0.',
    [2 /* InvalidOrUnexpectedToken */]: 'Invalid or unexpected token',
    [9 /* DeclarationMissingInitializer */]: 'Missing initializer in destructuring declaration',
    [10 /* ElementAfterRest */]: 'Rest element must be last element',
    [11 /* NoCatchOrFinally */]: 'Missing catch or finally after try',
    [12 /* NoCatchClause */]: 'Missing catch clause',
    [13 /* NoCatchClauseDefault */]: 'Catch clause parameter does not support default values',
    [14 /* InvalidLHSDefaultValue */]: 'Only \'=\' operator can be used for specifying default value',
    [15 /* InvalidLhsInFor */]: 'Invalid left-hand side in for-loop',
    [16 /* StrictFunction */]: 'In strict mode code, functions can only be declared at top level or inside a block',
    [17 /* SloppyFunction */]: 'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
    [18 /* UnNamedFunctionDecl */]: 'Function declaration must have a name in this context',
    [19 /* StrictModeWith */]: 'Strict mode code may not include a with statement',
    [20 /* AsyncFunctionInSingleStatementContext */]: 'Async functions can only be declared at the top level or inside a block',
    [21 /* UnknownLabel */]: 'Undefined label \'%0\'',
    [22 /* LabelRedeclaration */]: 'Label \'%0\' has already been declared',
    [23 /* InvalidNestedStatement */]: '%0  statement must be nested within an iteration statement',
    [24 /* IllegalContinue */]: 'Illegal continue statement: no surrounding iteration statement',
    [25 /* IllegalBreak */]: 'Illegal break statement',
    [26 /* NewlineAfterThrow */]: 'Illegal newline after throw',
    [27 /* IllegalReturn */]: 'Illegal return statement',
    [28 /* UnexpectedNewTarget */]: 'new.target expression is not allowed here',
    [29 /* InvalidConstructor */]: 'Class constructor may not be a \'%0\'',
    [30 /* StaticPrototype */]: 'Classes may not have a static property named \'prototype\'',
    [31 /* IllegalUseStrict */]: 'Illegal \'use strict\' directive in function with non-simple parameter list',
    [32 /* StrictEvalArguments */]: 'Unexpected eval or arguments in strict mode',
    [33 /* UnexpectedStrictReserved */]: 'Unexpected strict mode reserved word',
    [34 /* UnexpectedKeyword */]: 'Keyword \'%0\' is reserved',
    [35 /* AsAfterImportStart */]: 'Missing keyword \'as\' after import *',
    [36 /* MissingFromClause */]: 'Expected keyword \'%0\'',
    [37 /* UnexpectedReserved */]: 'Unexpected reserved word',
    [50 /* DuplicateRegExpFlag */]: 'Duplicate regular expression flag \'%0\'',
    [38 /* NothingToRepeat */]: 'Nothing to repeat',
    [39 /* LoneQuantifierBrackets */]: 'Lone quantifier brackets',
    [40 /* UnterminatedGroup */]: 'Unterminated group',
    [42 /* InvalidGroup */]: 'Invalid group',
    [43 /* RegexpOutOfOrder */]: 'Numbers out of order in {} quantifier',
    [44 /* IncompleteQuantifier */]: 'Incomplete quantifier',
    [45 /* InvalidGroupName */]: 'Invalid capture group name',
    [46 /* InvalidEscape */]: 'Invalid escape',
    [47 /* InvalidNamedReference */]: 'Invalid named reference',
    [41 /* InvalidUnicodeEscape */]: 'Invalid unicode escape',
    [48 /* UnterminatedCharacterClass */]: 'Unterminated character class',
    [49 /* OutOfOrderCharacterClass */]: 'Range out of order in character class',
    [51 /* InvalidRegularExp */]: 'Invalid regular expression',
};
function constructError(index, line, column, description) {
    const error = new SyntaxError(`Line ${line}, column ${column}: ${description}`);
    error.index = index;
    error.line = line;
    error.column = column;
    error.description = description;
    return error;
}
function recordErrors(parser, context, type, ...params) {
    const { index, line, column } = parser;
    const message = errorMessages[type].replace(/%(\d+)/g, (_, i) => params[i]);
    const error = constructError(index, line, column, message);
    if (context & 32 /* OptionsEditorMode */) {
        if (parser.onError)
            parser.onError(message, line, column);
    }
    else
        throw error;
}

// Unicode v. 10 support
// tslint:disable
function isValidIdentifierPart(code) {
    return (convert[(code >>> 5) + 0] >>> code & 31 & 1) !== 0;
}
function mustEscape(code) {
    return (convert[(code >>> 5) + 69632] >>> code & 31 & 1) !== 0;
}
const convert = ((compressed, lookup) => {
    const result = new Uint32Array(104448);
    let index = 0;
    let subIndex = 0;
    while (index < 3293) {
        const inst = compressed[index++];
        if (inst < 0) {
            subIndex -= inst;
        }
        else {
            let code = compressed[index++];
            if (inst & 2)
                code = lookup[code];
            if (inst & 1) {
                result.fill(code, subIndex, subIndex += compressed[index++]);
            }
            else {
                result[subIndex++] = code;
            }
        }
    }
    return result;
})([-1, 2, 28, 2, 29, 2, 5, -1, 0, 77595648, 3, 41, 2, 3, 0, 14, 2, 52, 2, 53, 3, 0, 3, 0, 3168796671, 0, 4294956992, 2, 1, 2, 0, 2, 54, 3, 0, 4, 0, 4294966523, 3, 0, 4, 2, 55, 2, 56, 2, 4, 0, 4294836479, 0, 3221225471, 0, 4294901942, 2, 57, 0, 134152192, 3, 0, 2, 0, 4294951935, 3, 0, 2, 0, 2683305983, 0, 2684354047, 2, 17, 2, 0, 0, 4294961151, 3, 0, 2, 2, 20, 2, 0, 2, 59, 2, 0, 2, 125, 2, 6, 2, 19, -1, 2, 60, 2, 148, 2, 1, 3, 0, 3, 0, 4294901711, 2, 37, 0, 4089839103, 0, 2961209759, 0, 268697551, 0, 4294543342, 0, 3547201023, 0, 1577204103, 0, 4194240, 0, 4294688750, 2, 2, 0, 80831, 0, 4261478351, 0, 4294549486, 2, 2, 0, 2965387679, 0, 196559, 0, 3594373100, 0, 3288319768, 0, 8469959, 2, 167, 2, 3, 0, 3825204735, 0, 123747807, 0, 65487, 2, 3, 0, 4092591615, 0, 1080049119, 0, 458703, 2, 3, 2, 0, 0, 2163244511, 0, 4227923919, 0, 4236247020, 2, 64, 0, 4284449919, 0, 851904, 2, 4, 2, 16, 0, 67076095, -1, 2, 65, 0, 1006628014, 0, 4093591391, -1, 0, 50331649, 0, 3265266687, 2, 34, 0, 4294844415, 0, 4278190047, 2, 22, 2, 124, -1, 3, 0, 2, 2, 33, 2, 0, 2, 10, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 66, 2, 0, 2, 67, 2, 68, 2, 69, 2, 0, 2, 70, 2, 0, 0, 3892314111, 0, 261632, 2, 27, 3, 0, 2, 2, 11, 2, 4, 3, 0, 18, 2, 71, 2, 5, 3, 0, 2, 2, 72, 0, 2088959, 2, 31, 2, 8, 0, 909311, 3, 0, 2, 0, 814743551, 2, 39, 0, 67057664, 3, 0, 2, 2, 9, 2, 0, 2, 32, 2, 0, 2, 18, 2, 7, 0, 268374015, 2, 30, 2, 46, 2, 0, 2, 73, 0, 134153215, -1, 2, 6, 2, 0, 2, 7, 0, 2684354559, 0, 67044351, 0, 1073676416, -2, 3, 0, 2, 2, 40, 0, 1046528, 3, 0, 3, 2, 8, 2, 0, 2, 9, 0, 4294960127, 2, 10, 2, 13, -1, 0, 4294377472, 2, 25, 3, 0, 7, 0, 4227858431, 3, 0, 8, 2, 11, 2, 0, 2, 75, 2, 10, 2, 0, 2, 76, 2, 77, 2, 78, -1, 2, 121, 0, 1048577, 2, 79, 2, 12, -1, 2, 12, 0, 131042, 2, 80, 2, 81, 2, 82, 2, 0, 2, 13, -83, 2, 0, 2, 49, 2, 7, 3, 0, 4, 0, 1046559, 2, 0, 2, 14, 2, 0, 0, 2147516671, 2, 23, 3, 83, 2, 2, 0, -16, 2, 84, 0, 524222462, 2, 4, 2, 0, 0, 4269801471, 2, 4, 2, 0, 2, 15, 2, 74, 2, 86, 3, 0, 2, 2, 43, 2, 16, -1, 2, 17, -16, 3, 0, 205, 2, 18, -2, 3, 0, 655, 2, 19, 3, 0, 36, 2, 47, -1, 2, 17, 2, 10, 3, 0, 8, 2, 87, 2, 117, 2, 0, 0, 3220242431, 3, 0, 3, 2, 20, 2, 21, 2, 88, 3, 0, 2, 2, 89, 2, 90, -1, 2, 21, 2, 0, 2, 26, 2, 0, 2, 8, 3, 0, 2, 0, 67043391, 0, 687865855, 2, 0, 2, 24, 2, 8, 2, 22, 3, 0, 2, 0, 67076097, 2, 7, 2, 0, 2, 23, 0, 67059711, 0, 4236247039, 3, 0, 2, 0, 939524103, 0, 8191999, 2, 94, 2, 95, 2, 15, 2, 92, 3, 0, 3, 0, 67057663, 3, 0, 349, 2, 96, 2, 97, 2, 6, -264, 3, 0, 11, 2, 24, 3, 0, 2, 2, 25, -1, 0, 3774349439, 2, 98, 2, 99, 3, 0, 2, 2, 20, 2, 100, 3, 0, 10, 2, 10, 2, 17, 2, 0, 2, 42, 2, 0, 2, 26, 2, 101, 2, 27, 0, 1638399, 2, 165, 2, 102, 3, 0, 3, 2, 22, 2, 28, 2, 29, 2, 5, 2, 30, 2, 0, 2, 7, 2, 103, -1, 2, 104, 2, 105, 2, 106, -1, 3, 0, 3, 2, 16, -2, 2, 0, 2, 31, -3, 2, 144, -4, 2, 22, 2, 0, 2, 107, 0, 1, 2, 0, 2, 58, 2, 32, 2, 16, 2, 10, 2, 0, 2, 108, -1, 3, 0, 4, 2, 10, 2, 33, 2, 109, 2, 6, 2, 0, 2, 110, 2, 0, 2, 44, -4, 3, 0, 9, 2, 23, 2, 18, 2, 26, -4, 2, 111, 2, 112, 2, 18, 2, 23, 2, 7, -2, 2, 113, 2, 18, 2, 25, -2, 2, 0, 2, 114, -2, 0, 4277137519, 0, 2265972735, -1, 3, 22, 2, -1, 2, 34, 2, 36, 2, 0, 3, 18, 2, 2, 35, 2, 20, -3, 3, 0, 2, 2, 13, -1, 2, 0, 2, 35, 2, 0, 2, 35, -24, 3, 0, 2, 2, 36, 0, 2147549120, 2, 0, 2, 16, 2, 17, 2, 128, 2, 0, 2, 48, 2, 17, 0, 5242879, 3, 0, 2, 0, 402594847, -1, 2, 116, 0, 1090519039, -2, 2, 118, 2, 119, 2, 0, 2, 38, 2, 37, 2, 2, 0, 3766565279, 0, 2039759, -4, 3, 0, 2, 2, 38, -1, 3, 0, 2, 0, 67043519, -5, 2, 0, 0, 4282384383, 0, 1056964609, -1, 3, 0, 2, 0, 67043345, -1, 2, 0, 2, 9, 2, 39, -1, 0, 3825205247, 2, 40, -11, 3, 0, 2, 0, 2147484671, -8, 2, 0, 2, 7, 0, 4294901888, 2, 0, 0, 67108815, -1, 2, 0, 2, 45, -8, 2, 50, 2, 41, 0, 67043329, 2, 122, 2, 42, 0, 8388351, -2, 2, 123, 0, 3028287487, 0, 67043583, -21, 3, 0, 28, 2, 25, -3, 3, 0, 3, 2, 43, 3, 0, 6, 2, 44, -85, 3, 0, 33, 2, 43, -126, 3, 0, 18, 2, 36, -269, 3, 0, 17, 2, 45, 2, 7, 2, 39, -2, 2, 17, 2, 46, 2, 0, 2, 23, 0, 67043343, 2, 126, 2, 27, -27, 3, 0, 2, 0, 4294901791, 2, 7, 2, 187, -2, 0, 3, 3, 0, 191, 2, 47, 3, 0, 23, 2, 35, -296, 3, 0, 8, 2, 7, -2, 2, 17, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 127, 0, 1677656575, -166, 0, 4161266656, 0, 4071, 0, 15360, -4, 0, 28, -13, 3, 0, 2, 2, 48, 2, 0, 2, 129, 2, 130, 2, 51, 2, 0, 2, 131, 2, 132, 2, 133, 3, 0, 10, 2, 134, 2, 135, 2, 15, 3, 48, 2, 3, 49, 2, 3, 50, 2, 0, 4294954999, 2, 0, -16, 2, 0, 2, 85, 2, 0, 0, 2105343, 0, 4160749584, 2, 194, -42, 0, 4194303871, 0, 2011, -62, 3, 0, 6, 0, 8323103, -1, 3, 0, 2, 2, 38, -37, 2, 51, 2, 138, 2, 139, 2, 140, 2, 141, 2, 142, -138, 3, 0, 1334, 2, 23, -1, 3, 0, 129, 2, 31, 3, 0, 6, 2, 10, 3, 0, 180, 2, 143, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 10, -22583, 3, 0, 7, 2, 27, -6130, 3, 5, 2, -1, 0, 69207040, 3, 41, 2, 3, 0, 14, 2, 52, 2, 53, -3, 0, 3168731136, 0, 4294956864, 2, 1, 2, 0, 2, 54, 3, 0, 4, 0, 4294966275, 3, 0, 4, 2, 55, 2, 56, 2, 4, 2, 26, -1, 2, 17, 2, 57, -1, 2, 0, 2, 19, 0, 4294885376, 3, 0, 2, 0, 3145727, 0, 2617294944, 0, 4294770688, 2, 27, 2, 58, 3, 0, 2, 0, 131135, 2, 91, 0, 70256639, 2, 59, 0, 272, 2, 45, 2, 19, -1, 2, 60, -2, 2, 93, 0, 603979775, 0, 4278255616, 0, 4294836227, 0, 4294549473, 0, 600178175, 0, 2952806400, 0, 268632067, 0, 4294543328, 0, 57540095, 0, 1577058304, 0, 1835008, 0, 4294688736, 2, 61, 2, 62, 0, 33554435, 2, 120, 2, 61, 2, 145, 0, 131075, 0, 3594373096, 0, 67094296, 2, 62, -1, 2, 63, 0, 603979263, 2, 153, 0, 3, 0, 4294828001, 0, 602930687, 2, 175, 0, 393219, 2, 63, 0, 671088639, 0, 2154840064, 0, 4227858435, 0, 4236247008, 2, 64, 2, 36, -1, 2, 4, 0, 917503, 2, 36, -1, 2, 65, 0, 537783470, 0, 4026531935, -1, 0, 1, -1, 2, 34, 2, 47, 0, 7936, -3, 2, 0, 0, 2147485695, 0, 1010761728, 0, 4292984930, 0, 16387, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 66, 2, 0, 2, 67, 2, 68, 2, 69, 2, 0, 2, 70, 2, 0, 2, 16, -1, 2, 27, 3, 0, 2, 2, 11, 2, 4, 3, 0, 18, 2, 71, 2, 5, 3, 0, 2, 2, 72, 0, 253951, 3, 20, 2, 0, 122879, 2, 0, 2, 8, 0, 276824064, -2, 3, 0, 2, 2, 9, 2, 0, 0, 4294903295, 2, 0, 2, 18, 2, 7, -1, 2, 17, 2, 46, 2, 0, 2, 73, 2, 39, -1, 2, 23, 2, 0, 2, 31, -2, 0, 128, -2, 2, 74, 2, 8, 0, 4064, -1, 2, 115, 0, 4227907585, 2, 0, 2, 191, 2, 0, 2, 44, 0, 4227915776, 2, 10, 2, 13, -2, 0, 6544896, 3, 0, 6, -2, 3, 0, 8, 2, 11, 2, 0, 2, 75, 2, 10, 2, 0, 2, 76, 2, 77, 2, 78, -3, 2, 79, 2, 12, -3, 2, 80, 2, 81, 2, 82, 2, 0, 2, 13, -83, 2, 0, 2, 49, 2, 7, 3, 0, 4, 0, 817183, 2, 0, 2, 14, 2, 0, 0, 33023, 2, 23, 3, 83, 2, -17, 2, 84, 0, 524157950, 2, 4, 2, 0, 2, 85, 2, 4, 2, 0, 2, 15, 2, 74, 2, 86, 3, 0, 2, 2, 43, 2, 16, -1, 2, 17, -16, 3, 0, 205, 2, 18, -2, 3, 0, 655, 2, 19, 3, 0, 36, 2, 47, -1, 2, 17, 2, 10, 3, 0, 8, 2, 87, 0, 3072, 2, 0, 0, 2147516415, 2, 10, 3, 0, 2, 2, 27, 2, 21, 2, 88, 3, 0, 2, 2, 89, 2, 90, -1, 2, 21, 0, 4294965179, 0, 7, 2, 0, 2, 8, 2, 88, 2, 8, -1, 0, 687603712, 2, 91, 2, 92, 2, 36, 2, 22, 2, 93, 2, 35, 2, 159, 0, 2080440287, 2, 0, 2, 13, 2, 136, 0, 3296722943, 2, 0, 0, 1046675455, 0, 939524101, 0, 1837055, 2, 94, 2, 95, 2, 15, 2, 92, 3, 0, 3, 0, 7, 3, 0, 349, 2, 96, 2, 97, 2, 6, -264, 3, 0, 11, 2, 24, 3, 0, 2, 2, 25, -1, 0, 2700607615, 2, 98, 2, 99, 3, 0, 2, 2, 20, 2, 100, 3, 0, 10, 2, 10, 2, 17, 2, 0, 2, 42, 2, 0, 2, 26, 2, 101, -3, 2, 102, 3, 0, 3, 2, 22, -1, 3, 5, 2, 2, 30, 2, 0, 2, 7, 2, 103, -1, 2, 104, 2, 105, 2, 106, -1, 3, 0, 3, 2, 16, -2, 2, 0, 2, 31, -8, 2, 22, 2, 0, 2, 107, -1, 2, 0, 2, 58, 2, 32, 2, 18, 2, 10, 2, 0, 2, 108, -1, 3, 0, 4, 2, 10, 2, 17, 2, 109, 2, 6, 2, 0, 2, 110, 2, 0, 2, 44, -4, 3, 0, 9, 2, 23, 2, 18, 2, 26, -4, 2, 111, 2, 112, 2, 18, 2, 23, 2, 7, -2, 2, 113, 2, 18, 2, 25, -2, 2, 0, 2, 114, -2, 0, 4277075969, 2, 8, -1, 3, 22, 2, -1, 2, 34, 2, 137, 2, 0, 3, 18, 2, 2, 35, 2, 20, -3, 3, 0, 2, 2, 13, -1, 2, 0, 2, 35, 2, 0, 2, 35, -24, 2, 115, 2, 9, -2, 2, 115, 2, 27, 2, 17, 2, 13, 2, 115, 2, 36, 2, 17, 0, 4718591, 2, 115, 2, 35, 0, 335544350, -1, 2, 116, 2, 117, -2, 2, 118, 2, 119, 2, 7, -1, 2, 120, 2, 61, 0, 3758161920, 0, 3, -4, 2, 0, 2, 31, 2, 170, -1, 2, 0, 2, 27, 0, 176, -5, 2, 0, 2, 43, 2, 177, -1, 2, 0, 2, 27, 2, 189, -1, 2, 0, 2, 19, -2, 2, 25, -12, 3, 0, 2, 2, 121, -8, 0, 4294965249, 0, 67633151, 0, 4026597376, 2, 0, 0, 975, -1, 2, 0, 2, 45, -8, 2, 50, 2, 43, 0, 1, 2, 122, 2, 27, -3, 2, 123, 2, 107, 2, 124, -21, 3, 0, 28, 2, 25, -3, 3, 0, 3, 2, 43, 3, 0, 6, 2, 44, -85, 3, 0, 33, 2, 43, -126, 3, 0, 18, 2, 36, -269, 3, 0, 17, 2, 45, 2, 7, -3, 2, 17, 2, 125, 2, 0, 2, 27, 2, 44, 2, 126, 2, 27, -27, 3, 0, 2, 0, 65567, -1, 2, 100, -2, 0, 3, 3, 0, 191, 2, 47, 3, 0, 23, 2, 35, -296, 3, 0, 8, 2, 7, -2, 2, 17, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 127, 2, 128, -187, 3, 0, 2, 2, 48, 2, 0, 2, 129, 2, 130, 2, 51, 2, 0, 2, 131, 2, 132, 2, 133, 3, 0, 10, 2, 134, 2, 135, 2, 15, 3, 48, 2, 3, 49, 2, 3, 50, 2, 2, 136, -129, 3, 0, 6, 2, 137, -1, 3, 0, 2, 2, 44, -37, 2, 51, 2, 138, 2, 139, 2, 140, 2, 141, 2, 142, -138, 3, 0, 1334, 2, 23, -1, 3, 0, 129, 2, 31, 3, 0, 6, 2, 10, 3, 0, 180, 2, 143, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 10, -28719, 2, 0, 0, 1, -1, 2, 121, 2, 0, 0, 8193, -21, 0, 50331648, 0, 10255, 0, 4, -11, 2, 62, 2, 163, 0, 1, 0, 71936, -1, 2, 154, 0, 4292933632, 0, 805306431, -5, 2, 144, -1, 2, 172, -1, 0, 6144, -2, 2, 122, -1, 2, 164, -1, 2, 150, 2, 145, 2, 158, 2, 0, 0, 3223322624, 2, 8, 0, 4, -4, 2, 183, 0, 205128192, 0, 1333757536, 0, 3221225520, 0, 423953, 0, 747766272, 0, 2717763192, 0, 4290773055, 0, 278545, 2, 146, 0, 4294886464, 0, 33292336, 0, 417809, 2, 146, 0, 1329579616, 0, 4278190128, 0, 700594195, 0, 1006647527, 0, 4286497336, 0, 4160749631, 2, 147, 0, 469762560, 0, 4171219488, 0, 16711728, 2, 147, 0, 202375680, 0, 3214918176, 0, 4294508592, 2, 147, -1, 0, 983584, 0, 48, 0, 58720275, 0, 3489923072, 0, 10517376, 0, 4293066815, 0, 1, 0, 2013265920, 2, 171, 2, 0, 0, 17816169, 0, 3288339281, 0, 201375904, 2, 0, -2, 0, 256, 0, 122880, 0, 16777216, 2, 144, 0, 4160757760, 2, 0, -6, 2, 160, -11, 0, 3263218176, -1, 0, 49664, 0, 2160197632, 0, 8388802, -1, 0, 12713984, -1, 0, 402653184, 2, 152, 2, 155, -2, 2, 156, -20, 0, 3758096385, -2, 2, 185, 0, 4292878336, 2, 21, 2, 148, 0, 4294057984, -2, 2, 157, 2, 149, 2, 168, -2, 2, 166, -1, 2, 174, -1, 2, 162, 2, 121, 0, 4026593280, 0, 14, 0, 4292919296, -1, 2, 151, 0, 939588608, -1, 0, 805306368, -1, 2, 121, 0, 1610612736, 2, 149, 2, 150, 3, 0, 2, -2, 2, 151, 2, 152, -3, 0, 267386880, -1, 2, 153, 0, 7168, -1, 2, 180, 2, 0, 2, 154, 2, 155, -7, 2, 161, -8, 2, 156, -1, 0, 1426112704, 2, 157, -1, 2, 181, 0, 271581216, 0, 2149777408, 2, 27, 2, 154, 2, 121, 0, 851967, 0, 3758129152, -1, 2, 27, 2, 173, -4, 2, 151, -20, 2, 188, 2, 158, -56, 0, 3145728, 2, 179, 2, 184, 0, 4294443520, 2, 73, -1, 2, 159, 2, 121, -4, 0, 32505856, -1, 2, 160, -1, 0, 2147385088, 2, 21, 1, 2155905152, 2, -3, 2, 91, 2, 0, 2, 161, -2, 2, 148, -6, 2, 162, 0, 4026597375, 0, 1, -1, 0, 1, -1, 2, 163, -3, 2, 137, 2, 190, -2, 2, 159, 2, 164, -1, 2, 169, 2, 121, -6, 2, 121, -213, 2, 162, -657, 2, 158, -36, 2, 165, -1, 0, 65408, -10, 2, 193, -5, 2, 166, -5, 0, 4278222848, 2, 0, 2, 23, -1, 0, 4227919872, -1, 2, 166, -2, 0, 4227874752, 2, 157, -2, 0, 2146435072, 2, 152, -2, 0, 1006649344, 2, 121, -1, 2, 21, 0, 201375744, -3, 0, 134217720, 2, 21, 0, 4286677377, 0, 32896, -1, 2, 167, -3, 2, 168, -349, 2, 169, 2, 170, 2, 171, 3, 0, 264, -11, 2, 172, -2, 2, 155, 2, 0, 0, 520617856, 0, 2692743168, 0, 36, -3, 0, 524284, -11, 2, 27, -1, 2, 178, -1, 2, 176, 0, 3221291007, 2, 155, -1, 0, 524288, 0, 2158720, -3, 2, 152, 0, 1, -4, 2, 121, 0, 3808625411, 0, 3489628288, 0, 4096, 0, 1207959680, 0, 3221274624, 2, 0, -3, 2, 164, 0, 120, 0, 7340032, -2, 0, 4026564608, 2, 4, 2, 27, 2, 157, 3, 0, 4, 2, 152, -1, 2, 173, 2, 171, -1, 0, 8176, 2, 174, 2, 164, 2, 175, -1, 0, 4290773232, 2, 0, -4, 2, 157, 2, 182, 0, 15728640, 2, 171, -1, 2, 154, -1, 0, 4294934512, 3, 0, 4, -9, 2, 21, 2, 162, 2, 176, 3, 0, 4, 0, 704, 0, 1849688064, 0, 4194304, -1, 2, 121, 0, 4294901887, 2, 0, 0, 130547712, 0, 1879048192, 0, 2080374784, 3, 0, 2, -1, 2, 177, 2, 178, -1, 0, 17829776, 0, 2028994560, 0, 4261478144, -2, 2, 0, -1, 0, 4286580608, -1, 0, 29360128, 2, 179, 0, 16252928, 0, 3791388672, 2, 119, 3, 0, 2, -2, 2, 180, 2, 0, -1, 2, 100, -1, 0, 66584576, 3, 0, 11, 2, 121, 3, 0, 12, -2, 0, 245760, 0, 2147418112, -1, 2, 144, 2, 195, 0, 4227923456, -1, 2, 181, 2, 169, 2, 21, -2, 2, 172, 0, 4292870145, 0, 262144, 2, 121, 3, 0, 2, 0, 1073758848, 2, 182, -1, 0, 4227921920, 2, 183, 2, 146, 0, 528402016, 0, 4292927536, 3, 0, 4, -2, 0, 3556769792, 2, 0, -2, 2, 186, 3, 0, 5, -1, 2, 179, 2, 157, 2, 0, -2, 0, 4227923936, 2, 58, -1, 2, 166, 2, 91, 2, 0, 2, 184, 2, 151, 3, 0, 11, -2, 0, 2146959360, 3, 0, 8, -2, 2, 154, -1, 0, 536870960, 2, 115, -1, 2, 185, 3, 0, 8, 0, 512, 0, 8388608, 2, 167, 2, 165, 2, 178, 0, 4286578944, 3, 0, 2, 0, 1152, 0, 1266679808, 2, 186, 3, 0, 21, -28, 2, 155, 3, 0, 3, -3, 0, 4292902912, -6, 2, 93, 3, 0, 85, -33, 2, 187, 3, 0, 126, -18, 2, 188, 3, 0, 269, -17, 2, 185, 2, 121, 0, 4294917120, 3, 0, 2, 2, 27, 0, 4290822144, -2, 0, 67174336, 0, 520093700, 2, 17, 3, 0, 27, -2, 0, 65504, 2, 121, 2, 43, 3, 0, 2, 2, 88, -191, 2, 58, -23, 2, 100, 3, 0, 296, -8, 2, 121, 3, 0, 2, 2, 27, -11, 2, 171, 3, 0, 72, -3, 0, 3758159872, 0, 201391616, 3, 0, 155, -7, 2, 162, -1, 0, 384, -1, 0, 133693440, -3, 2, 180, -2, 2, 30, 3, 0, 5, -2, 2, 21, 2, 122, 3, 0, 4, -2, 2, 181, -1, 2, 144, 0, 335552923, 2, 189, -1, 0, 538974272, 0, 2214592512, 0, 132000, -10, 0, 192, -8, 0, 12288, -21, 0, 134213632, 0, 4294901761, 3, 0, 42, 0, 100663424, 0, 4294965284, 3, 0, 62, -6, 0, 4286578784, 2, 0, -2, 0, 1006696448, 3, 0, 37, 2, 189, 0, 4110942569, 0, 1432950139, 0, 2701658217, 0, 4026532864, 0, 4026532881, 2, 0, 2, 42, 3, 0, 8, -1, 2, 151, -2, 2, 148, 2, 190, 0, 65537, 2, 162, 2, 165, 2, 159, -1, 2, 151, -1, 2, 58, 2, 0, 2, 191, 0, 65528, 2, 171, 0, 4294770176, 2, 30, 3, 0, 4, -30, 2, 192, 0, 4261470208, -3, 2, 148, -2, 2, 192, 2, 0, 2, 151, -1, 2, 186, -1, 2, 154, 0, 4294950912, 3, 0, 2, 2, 151, 2, 121, 2, 165, 2, 193, 2, 166, 2, 0, 2, 194, 2, 188, 3, 0, 48, -1334, 2, 21, 2, 0, -129, 2, 192, -6, 2, 157, -180, 2, 195, -233, 2, 4, 3, 0, 96, -16, 2, 157, 3, 0, 22583, -7, 2, 17, 3, 0, 6128], [4294967295, 4294967291, 4092460543, 4294828015, 4294967294, 134217726, 268435455, 2147483647, 1048575, 16777215, 1073741823, 1061158911, 536805376, 511, 4294910143, 4160749567, 134217727, 4294901760, 4194303, 2047, 262143, 4286578688, 536870911, 8388607, 4294918143, 67108863, 255, 65535, 67043328, 2281701374, 4294967232, 2097151, 4294903807, 4294902783, 4294967039, 524287, 127, 4294549487, 67045375, 1023, 67047423, 4286578687, 4294770687, 32767, 15, 33554431, 2047999, 8191, 4292870143, 4294934527, 4294966783, 4294967279, 262083, 20511, 4290772991, 4294901759, 41943039, 460799, 4294959104, 71303167, 1071644671, 602799615, 65536, 4294828000, 805044223, 4277151126, 1031749119, 4294917631, 2134769663, 4286578493, 4282253311, 4294942719, 33540095, 4294905855, 4294967264, 2868854591, 1608515583, 265232348, 534519807, 2147614720, 1060109444, 4093640016, 17376, 2139062143, 224, 4169138175, 4294868991, 4294909951, 4294967292, 4294965759, 16744447, 4294966272, 4294901823, 4294967280, 8289918, 4294934399, 4294901775, 4294965375, 1602223615, 4294967259, 4294443008, 268369920, 4292804608, 486341884, 4294963199, 3087007615, 1073692671, 131071, 4128527, 4279238655, 4294902015, 4294966591, 2445279231, 3670015, 3238002687, 4294967288, 4294705151, 4095, 3221208447, 4294902271, 4294549472, 2147483648, 4294705152, 4294966143, 64, 16383, 3774873592, 536807423, 67043839, 3758096383, 3959414372, 3755993023, 2080374783, 4294835295, 4294967103, 4160749565, 4087, 31, 184024726, 2862017156, 1593309078, 268434431, 268434414, 4294901763, 536870912, 2952790016, 202506752, 139280, 4293918720, 4227922944, 2147532800, 61440, 3758096384, 117440512, 65280, 4227858432, 3233808384, 3221225472, 4294965248, 32768, 57152, 67108864, 4290772992, 25165824, 4160749568, 57344, 4278190080, 65472, 4227907584, 65520, 1920, 4026531840, 49152, 4294836224, 63488, 1073741824, 4294967040, 251658240, 196608, 12582912, 4294966784, 2097152, 64512, 417808, 469762048, 4261412864, 4227923712, 4294934528, 4294967168, 16, 98304, 63, 4292870144, 4294963200, 65534, 65532]);

function consumeOpt(parser, code) {
    if (parser.source.charCodeAt(parser.index) !== code)
        return false;
    parser.index++;
    parser.column++;
    return true;
}
/**
* Advance to new line
*
* @param parser Parser object
*/
function advanceNewline(parser, ch) {
    parser.index++;
    parser.column = 0;
    parser.line++;
    if (parser.index < parser.length && ch === 13 /* CarriageReturn */ &&
        parser.source.charCodeAt(parser.index) === 10 /* LineFeed */) {
        parser.index++;
    }
}
function skipToNewline(parser) {
    while (parser.index < parser.length) {
        const ch = parser.source.charCodeAt(parser.index);
        switch (ch) {
            case 13 /* CarriageReturn */:
            case 10 /* LineFeed */:
            case 8232 /* LineSeparator */:
            case 8233 /* ParagraphSeparator */:
                advanceNewline(parser, ch);
                return true;
            default:
                parser.index++;
                parser.column++;
        }
    }
    return false;
}
function readNext(parser, ch) {
    parser.index++;
    parser.column++;
    if (ch > 0xffff)
        parser.index++;
    if (parser.index >= parser.length)
        recordErrors(parser, 0 /* Empty */, 0 /* Unexpected */);
    return nextUnicodeChar(parser);
}
function nextUnicodeChar(parser) {
    let { index } = parser;
    const hi = parser.source.charCodeAt(index++);
    if (hi < 0xd800 || hi > 0xdbff)
        return hi;
    if (index === parser.source.length)
        return hi;
    const lo = parser.source.charCodeAt(index);
    if (lo < 0xdc00 || lo > 0xdfff)
        return hi;
    return (hi & 0x3ff) << 10 | lo & 0x3ff | 0x10000;
}
function toHex(code) {
    if (code < 48 /* Zero */)
        return -1;
    if (code <= 57 /* Nine */)
        return code - 48 /* Zero */;
    if (code < 65 /* UpperA */)
        return -1;
    if (code <= 70 /* UpperF */)
        return code - 65 /* UpperA */ + 10;
    if (code < 97 /* LowerA */)
        return -1;
    if (code <= 102 /* LowerF */)
        return code - 97 /* LowerA */ + 10;
    return -1;
}
const fromCodePoint = (code) => {
    return code <= 0xFFFF ?
        String.fromCharCode(code) :
        String.fromCharCode(((code - 65536 /* NonBMPMin */) >> 10) + 55296 /* LeadSurrogateMin */, ((code - 65536 /* NonBMPMin */) & (1024 - 1)) + 56320 /* TrailSurrogateMin */);
};
function convertToken(parser, token) {
    let type;
    let value;
    if ((token & 33554432 /* Punctuator */) === 33554432 /* Punctuator */) {
        type = 'Punctuator';
        value = tokenDesc(token);
    }
    else if ((token & 8192 /* Reserved */) === 8192 /* Reserved */ ||
        (token & 16384 /* FutureReserved */) === 16384 /* FutureReserved */ ||
        (token & 4096 /* Contextual */) === 4096 /* Contextual */) {
        type = 'Keyword';
        value = tokenDesc(token);
    }
    else {
        value = parser.source.slice(parser.startIndex, parser.index);
        if ((token & 2097152 /* NumericLiteral */) === 2097152 /* NumericLiteral */)
            type = 'Numberic';
        if ((token & 67108864 /* Template */) === 67108864 /* Template */)
            type = 'Template';
        if ((token & 4194304 /* StringLiteral */) === 4194304 /* StringLiteral */)
            type = 'String';
        if ((token & 8388608 /* Identifier */) === 8388608 /* Identifier */)
            type = 'Identifier';
        if ((token & 16777216 /* RegularExpression */) === 16777216 /* RegularExpression */)
            type = 'Null';
        else if (token === 8195 /* NullKeyword */)
            type = 'Null';
        else if (token === 8193 /* FalseKeyword */ || token === 8194 /* TrueKeyword */) {
            type = 'Boolean';
        }
    }
    const t = { type, value };
    return t;
}
const hasBit = (mask, flags) => (mask & flags) === flags;
// QuantifierPrefix ::
//   { DecimalDigits }
//   { DecimalDigits , }
//   { DecimalDigits , DecimalDigits }
//
// Returns true if parsing succeeds, and set the min_out and max_out
// values. Values are truncated to RegExpTree::kInfinity if they overflow.
function validateQuantifierPrefix(parser) {
    let state = 1 /* Start */;
    let min = 0;
    let max = 0;
    let ch = parser.source.charCodeAt(parser.index);
    const missingDigits = !(ch >= 48 /* Zero */ && ch <= 57 /* Nine */);
    while (ch >= 48 /* Zero */ && ch <= 57 /* Nine */) {
        state = state | 2 /* IsLow */;
        parser.index++;
        parser.column++;
        if (hasBit(state, 1 /* Start */)) {
            state = state & ~1 /* Start */;
            if (ch === 48 /* Zero */) {
                if (parser.index >= parser.length)
                    return false;
                ch = parser.source.charCodeAt(parser.index);
                if (!(ch >= 48 /* Zero */ && ch <= 57 /* Nine */))
                    break;
                state = state | 8 /* HasBadNumber */;
                parser.index++;
                parser.column++;
            }
        }
        min = (min * 10) + (ch - 48 /* Zero */);
        ch = parser.source.charCodeAt(parser.index);
    }
    if (consumeOpt(parser, 44 /* Comma */)) {
        state = state | 1 /* Start */;
        if (parser.index >= parser.length)
            return false;
        while (parser.index < parser.length) {
            ch = parser.source.charCodeAt(parser.index);
            if (!(ch >= 48 /* Zero */ && ch <= 57 /* Nine */))
                break;
            parser.index++;
            parser.column++;
            state = state | 4 /* IsHigh */;
            if (hasBit(state, 1 /* Start */)) {
                state = state & ~1 /* Start */;
                if (ch === 48 /* Zero */) {
                    if (parser.index >= parser.length)
                        return false;
                    ch = parser.source.charCodeAt(parser.index);
                    if (!(ch >= 48 /* Zero */ && ch <= 57 /* Nine */))
                        break;
                    state = state | 8 /* HasBadNumber */;
                    parser.index++;
                    parser.column++;
                }
            }
            max = (max * 10) + (ch - 48 /* Zero */);
        }
    }
    if (hasBit(state, 8 /* HasBadNumber */) || !consumeOpt(parser, 125 /* RightBrace */))
        return false;
    const hasLow = hasBit(state, 2 /* IsLow */);
    const hasHi = hasBit(state, 4 /* IsHigh */);
    const res = (hasLow !== hasHi || (hasLow && hasHi && min <= max));
    return missingDigits ? res | 67108864 /* MissingDigits */ : res;
}
function isFlagStart(code) {
    return isValidIdentifierPart(code) ||
        code === 92 /* Backslash */ ||
        code === 36 /* Dollar */ ||
        code === 95 /* Underscore */ ||
        code === 8204 /* Zwnj */ ||
        code === 8205 /* Zwj */;
}
/**
 * Adjust correct regexp validator state
 *
 *
 * @param parser Parser object
 * @param code Code point
 */
function setValidationState(prevState, currState) {
    if (currState & 262144 /* Invalid */)
        return 262144 /* Invalid */;
    if (currState & 4096 /* SloppyMode */) {
        if (prevState & 65536 /* Valid */)
            return 4096 /* SloppyMode */;
        if (prevState & 1024 /* UnicodeMode */)
            return 262144 /* Invalid */;
    }
    else if (currState & 1024 /* UnicodeMode */) {
        if (prevState & 65536 /* Valid */)
            return 1024 /* UnicodeMode */;
        if (prevState & 4096 /* SloppyMode */)
            return 262144 /* Invalid */;
    }
    return prevState;
}
/**
 * Adjust correct regexp validator state
 *
 *
 * @param parser Parser object
 * @param flagState State returned by the regular expression flag
 * @param bodyState State returned after parsing the regex body
  */
function setRegExpState(parser, flagState, bodyState) {
    if (parser.capturingParens < parser.largestBackReference)
        return 262144 /* Invalid */;
    if (bodyState & 262144 /* Invalid */ || flagState & 262144 /* Invalid */)
        return 262144 /* Invalid */;
    if (bodyState & 1024 /* UnicodeMode */)
        return flagState & 1024 /* UnicodeMode */ ? 65536 /* Valid */ : 262144 /* Invalid */;
    if (bodyState & 16384 /* OnlySloppy */)
        return !(flagState & 1024 /* UnicodeMode */) ? 65536 /* Valid */ : 262144 /* Invalid */;
    if (bodyState & 4096 /* SloppyMode */)
        return !(flagState & 1024 /* UnicodeMode */) ? 65536 /* Valid */ : 262144 /* Invalid */;
    return 65536 /* Valid */;
}
/**
 * Parse back reference index
 *
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape)
 *
 * @param parser Parser object
 * @param code Code point
 */
function parseBackReferenceIndex(parser, code) {
    let value = code - 48 /* Zero */;
    while (parser.index < parser.length) {
        code = parser.source.charCodeAt(parser.index);
        if (code >= 48 /* Zero */ && code <= 57 /* Nine */) {
            value = value * 10 + (code - 48 /* Zero */);
            parser.index++;
        }
        else {
            break;
        }
    }
    parser.largestBackReference = value;
    return 65536 /* Valid */;
}
/**
 * Get unicode range
 *
 * @param range Left unicode range
 * @param state Current lexer state
 * @param right Right unicode range
 */
function getUnicodeRange(range, state, right) {
    if (range === 1114113 /* InvalidCharClassRange */ || right === 1114113 /* InvalidCharClassRange */ || range > right) {
        if (state === 1024 /* UnicodeMode */)
            return 262144 /* Invalid */;
        else if (state !== 262144 /* Invalid */)
            return 4096 /* SloppyMode */;
    }
    return state;
}
/**
 * Get non-unicode range
 *
 * @param range Left unicode range
 * @param state Current lexer state
 * @param right Right unicode range
 */
function getRange(ch, range, state) {
    if (range === 1114113 /* InvalidCharClassRange */ || ch === 1114113 /* InvalidCharClassRange */ || range > ch) {
        if (state === 4096 /* SloppyMode */)
            return 262144 /* Invalid */;
        else if (state !== 262144 /* Invalid */)
            return 1024 /* UnicodeMode */;
    }
    return state;
}
function mapToToken(token) {
    return (parser) => {
        parser.index++;
        parser.column++;
        return token;
    };
}
function escapeForPrinting(code) {
    switch (code) {
        case 0 /* Null */: return '\\0';
        case 8 /* Backspace */: return '\\b';
        case 9 /* Tab */: return '\\t';
        case 10 /* LineFeed */: return '\\n';
        case 11 /* VerticalTab */: return '\\v';
        case 12 /* FormFeed */: return '\\f';
        case 13 /* CarriageReturn */: return '\\r';
        case 35 /* Hash */: return '\\#';
        case 64 /* At */: return '\\@';
        default:
            if (!mustEscape(code))
                return fromCodePoint(code);
            if (code < 0x10)
                return `\\x0${code.toString(16)}`;
            if (code < 0x100)
                return `\\x${code.toString(16)}`;
            if (code < 0x1000)
                return `\\u0${code.toString(16)}`;
            if (code < 0x10000)
                return `\\u${code.toString(16)}`;
            return `\\u{${code.toString(16)}}`;
    }
}

const isIdentifierPart = (code) => isValidIdentifierPart(code) ||
    code === 92 /* Backslash */ ||
    code === 36 /* Dollar */ ||
    code === 95 /* Underscore */ ||
    (code >= 48 /* Zero */ && code <= 57 /* Nine */); // 0..9;
function scanIdentifier(parser) {
    let code = parser.source.charCodeAt(parser.index);
    while (parser.index < parser.length && isIdentifierPart(code)) {
        parser.index++;
        parser.column++;
        code = parser.source.charCodeAt(parser.index);
    }
    const ret = parser.source.slice(parser.startIndex, parser.index);
    const len = ret.length;
    parser.tokenValue = ret;
    // Keywords are between 2 and 11 characters long and start with a lowercase letter
    // https://tc39.github.io/ecma262/#sec-keywords
    if (len >= 2 && len <= 11) {
        const token = descKeyword(ret);
        if (token > 0) {
            return token;
        }
    }
    return 8388608 /* Identifier */;
}

function skipSingleHTMLComment(parser) {
    // if (context & Context.Module) report(parser, Errors.HtmlCommentInModule);
    skipToNewline(parser);
    return 1572982 /* HTMLComment */;
}
function skipSingleLineComment(parser) {
    skipToNewline(parser);
    return 1572980 /* SingleComment */;
}
function skipMultilineComment(parser) {
    while (parser.index < parser.length) {
        const ch = parser.source.charCodeAt(parser.index);
        switch (ch) {
            case 42 /* Asterisk */:
                parser.index++;
                parser.column++;
                if (consumeOpt(parser, 47 /* Slash */))
                    return 1572981 /* MultiComment */;
                break;
            case 13 /* CarriageReturn */:
            case 10 /* LineFeed */:
            case 8232 /* LineSeparator */:
            case 8233 /* ParagraphSeparator */:
                advanceNewline(parser, ch);
                break;
            default:
                parser.index++;
                parser.column++;
        }
    }
}

/**
 * Scan a string literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-literals-string-literals)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param quote codepoint
 */
function scanStringLiteral(parser, context, quote) {
    parser.index++;
    parser.column++;
    let { index, column } = parser;
    let ret = '';
    let ch = parser.source.charCodeAt(parser.index);
    loop: while (parser.index < parser.source.length) {
        ch = parser.source.charCodeAt(parser.index);
        switch (ch) {
            case 8232 /* LineSeparator */:
            case 8233 /* ParagraphSeparator */:
            case 13 /* CarriageReturn */:
            case 10 /* LineFeed */:
                break loop;
            case 92 /* Backslash */:
                ret += parser.source.slice(index, parser.index);
                ch = readNext(parser, ch);
                if (ch > 128 /* MaxAsciiCharacter */) {
                    ret += fromCodePoint(ch);
                }
                else {
                    const code = table[ch](parser, context, ch);
                    if (code >= 0)
                        ret += fromCodePoint(code);
                    // recovers from invalid escapes
                    else if (code !== -1 /* Empty */) {
                        ret = undefined;
                        recordStringErrors(parser, context, code);
                        ch = scanBadString(parser, quote, ch);
                        break loop;
                    }
                    else
                        return recordStringErrors(parser, context, code);
                    index = parser.index + 1;
                    column = parser.column + 1;
                }
                break;
            case quote:
                ret += parser.source.slice(index, parser.index);
                parser.index++;
                parser.column++; // consume the quote
                parser.tokenRaw = parser.source.slice(index - 1, parser.index);
                parser.tokenValue = ret;
                return 4194304 /* StringLiteral */;
            default:
                parser.index++;
                parser.column++;
        }
    }
    // Unterminated string literal
    recordErrors(parser, context, 3 /* UnterminatedString */);
    return 65536 /* Invalid */;
}
/**
 * Scans invalid escaped string values
 *
 * @param parser Parser object
 * @param quite Number
 * @param ch codepoint
 */
function scanBadString(parser, quote, ch) {
    while (ch !== quote) {
        ch = readNext(parser, ch);
        return ch;
    }
}
/**
 * Throws a string error for either string or template literal
 *
 * @param parser Parser object
 * @param context Context masks
 */
function recordStringErrors(parser, context, code) {
    if (code === -1 /* Empty */)
        return;
    recordErrors(parser, context, 3 /* UnterminatedString */);
    return 65536 /* Invalid */;
}
const table = new Array(128).fill(nextUnicodeChar);
table[98 /* LowerB */] = () => 8 /* Backspace */;
table[102 /* LowerF */] = () => 12 /* FormFeed */;
table[114 /* LowerR */] = () => 13 /* CarriageReturn */;
table[110 /* LowerN */] = () => 10 /* LineFeed */;
table[116 /* LowerT */] = () => 9 /* Tab */;
table[118 /* LowerV */] = () => 11 /* VerticalTab */;
table[13 /* CarriageReturn */] = (parser) => {
    parser.column = -1;
    parser.line++;
    const { index } = parser;
    if (index < parser.source.length) {
        const ch = parser.source.charCodeAt(index);
        if (ch === 10 /* LineFeed */) {
            parser.index = index + 1;
        }
    }
    return -1 /* Empty */;
};
table[10 /* LineFeed */] =
    table[8232 /* LineSeparator */] =
        table[8233 /* ParagraphSeparator */] = (parser) => {
            parser.column = -1;
            parser.line++;
            return -1 /* Empty */;
        };
// Null character, octals
table[48 /* Zero */] =
    table[49 /* One */] =
        table[50 /* Two */] =
            table[51 /* Three */] = (parser, context, first) => {
                // 1 to 3 octal digits
                let code = first - 48 /* Zero */;
                let index = parser.index + 1;
                let column = parser.column + 1;
                let next = parser.source.charCodeAt(index);
                if (next < 48 /* Zero */ || next > 55 /* Seven */) {
                    // Strict mode code allows only \0, then a non-digit.
                    if (code !== 0 || next === 56 /* Eight */ || next === 57 /* Nine */) {
                        if (context & 32768 /* Strict */)
                            return -2 /* StrictOctal */;
                        parser.flags |= 2 /* HasOctal */;
                    }
                }
                else if (context & 32768 /* Strict */) {
                    return -2 /* StrictOctal */;
                }
                else {
                    parser.flags |= 2 /* HasOctal */;
                    code = code * 8 + (next - 48 /* Zero */);
                    index++;
                    column++;
                    next = parser.source.charCodeAt(index);
                    if (next >= 48 /* Zero */ && next <= 55 /* Seven */) {
                        code = code * 8 + (next - 48 /* Zero */);
                        index++;
                        column++;
                    }
                    parser.index = index - 1;
                    parser.column = column - 1;
                }
                return code;
            };
table[52 /* Four */] =
    table[53 /* Five */] =
        table[54 /* Six */] =
            table[55 /* Seven */] = (parser, context, first) => {
                if (context & 32768 /* Strict */)
                    return -2 /* StrictOctal */;
                let code = first - 48 /* Zero */;
                const index = parser.index + 1;
                const column = parser.column + 1;
                if (index < parser.source.length) {
                    const next = parser.source.charCodeAt(index);
                    if (next >= 48 /* Zero */ && next <= 55 /* Seven */) {
                        code = (code << 3) | (next - 48 /* Zero */);
                        parser.index = index;
                        parser.column = column;
                    }
                }
                return code;
            };
// `8`, `9` (invalid escapes)
table[56 /* Eight */] = table[57 /* Nine */] = () => -3 /* EightOrNine */;
// ASCII escapes
table[120 /* LowerX */] = (parser, _, first) => {
    const ch1 = readNext(parser, first);
    const hi = toHex(ch1);
    if (hi < 0)
        return -4 /* InvalidHex */;
    const ch2 = readNext(parser, ch1);
    const lo = toHex(ch2);
    if (lo < 0)
        return -4 /* InvalidHex */;
    return hi << 4 | lo;
};
// UCS-2/Unicode escapes
table[117 /* LowerU */] = (parser, _, prev) => {
    let ch = readNext(parser, prev);
    if (ch === 123 /* LeftBrace */) {
        ch = readNext(parser, ch);
        let code = toHex(ch);
        if (code < 0)
            return -4 /* InvalidHex */;
        ch = readNext(parser, ch);
        while (ch !== 125 /* RightBrace */) {
            const digit = toHex(ch);
            if (digit < 0)
                return -4 /* InvalidHex */;
            code = code * 16 + digit;
            // Code point out of bounds
            if (code > 1114111 /* NonBMPMax */)
                return -5 /* OutOfRange */;
            ch = readNext(parser, ch);
        }
        return code;
    }
    else {
        // \uNNNN
        let codePoint = toHex(ch);
        if (codePoint < 0)
            return -4 /* InvalidHex */;
        for (let i = 0; i < 3; i++) {
            ch = readNext(parser, ch);
            const digit = toHex(ch);
            if (digit < 0)
                return -4 /* InvalidHex */;
            codePoint = codePoint * 16 + digit;
        }
        return codePoint;
    }
};

/**
 *  Scans numeric literal
 *
 * @param parser Parser object
 * @param context Context masks
 */
function scanNumeric(parser) {
    const { index } = parser;
    let ch = skipDigits(parser);
    if (ch === 46 /* Period */) {
        parser.index++;
        parser.column++;
        ch = skipDigits(parser);
    }
    if (ch === 101 /* LowerE */ || ch === 69 /* UpperE */) {
        parser.index++;
        parser.column++;
        scanSignedInteger(parser);
    }
    parser.tokenValue = parseFloat(parser.source.slice(index, parser.index));
    return 2097152 /* NumericLiteral */;
}
/**
 * Scans floating number
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseFractionalNumber(parser) {
    const { index } = parser;
    parser.index++;
    const ch = skipDigits(parser);
    // scan exponent
    if (ch === 101 /* LowerE */ || ch === 69 /* UpperE */) {
        parser.index++;
        parser.column++;
        scanSignedInteger(parser);
    }
    parser.tokenValue = parseFloat(parser.source.slice(index, parser.index));
    return 2097152 /* NumericLiteral */;
}
/**
 * Skips digits
 *
 * @param parser Parser object
 */
function skipDigits(parser) {
    let ch = parser.source.charCodeAt(parser.index);
    while (ch >= 48 /* Zero */ && ch <= 57 /* Nine */) {
        parser.index++;
        parser.column++;
        ch = parser.source.charCodeAt(parser.index);
    }
    return ch;
}
/**
 * Scans signed integer
 *
 * @param parser Parser object
 */
function scanSignedInteger(parser) {
    let ch = parser.source.charCodeAt(parser.index);
    if (ch === 43 /* Plus */ || ch === 45 /* Hyphen */) {
        parser.index++;
        parser.column++;
        ch = parser.source.charCodeAt(parser.index);
    }
    skipDigits(parser);
}
function parseLeadingZero(parser, context) {
    const index = parser.index + 1;
    if (index < parser.source.length) {
        const next = parser.source.charCodeAt(index);
        if (next >= 48 /* Zero */ && next <= 55 /* Seven */) {
            return scanImplicitOctalDigits(parser, context);
        }
        switch (next) {
            case 120 /* LowerX */:
            case 88 /* UpperX */:
                parser.index++;
                return scanHexDigits(parser, context);
            case 98 /* LowerB */:
            case 66 /* UpperB */:
                parser.index++;
                return scanBinaryDigits(parser, context);
            case 111 /* LowerO */:
            case 79 /* UpperO */:
                parser.index++;
                return scanOctalDigits(parser, context);
            default:
        }
    }
    return scanNumeric(parser);
}
function scanOctalDigits(parser, context) {
    parser.index++;
    parser.column++;
    let value = 0;
    let digits = 0;
    let code = parser.source.charCodeAt(parser.index);
    while (parser.index < parser.length) {
        if (!(code >= 48 /* Zero */ && code <= 55 /* Seven */)) {
            break;
        }
        value = value * 8 + (code - 48 /* Zero */);
        parser.index++;
        parser.column++;
        code = parser.source.charCodeAt(parser.index);
        digits++;
    }
    if (digits === 0) {
        recordErrors(parser, context, 2 /* InvalidOrUnexpectedToken */);
    }
    parser.tokenValue = value;
    if (consumeOpt(parser, 110 /* LowerN */))
        return 2097275 /* BigInt */;
    return 2097152 /* NumericLiteral */;
}
function scanHexDigits(parser, context) {
    parser.index++;
    parser.column++;
    let value = toHex(parser.source.charCodeAt(parser.index));
    if (value < 0)
        recordErrors(parser, context, 0 /* Unexpected */);
    parser.index++;
    parser.column++;
    while (parser.index < parser.length) {
        const next = parser.source.charCodeAt(parser.index);
        const digit = toHex(next);
        if (digit < 0) {
            break;
        }
        value = value * 16 + digit;
        parser.index++;
        parser.column++;
    }
    parser.tokenValue = value;
    if (consumeOpt(parser, 110 /* LowerN */))
        return 2097275 /* BigInt */;
    return 2097152 /* NumericLiteral */;
}
/**
 * Scans binary digits
 *
 * @param parser Parser object
 * @param context Context masks
 */
function scanBinaryDigits(parser, context) {
    parser.index++;
    parser.column++;
    let value = 0;
    let digits = 0;
    while (parser.index < parser.length) {
        const code = parser.source.charCodeAt(parser.index);
        value = value * 2 + code - 48 /* Zero */;
        parser.index++;
        parser.column++;
        digits++;
    }
    if (digits === 0)
        recordErrors(parser, context, 2 /* InvalidOrUnexpectedToken */);
    parser.tokenValue = value;
    if (consumeOpt(parser, 110 /* LowerN */))
        return 2097275 /* BigInt */;
    return 2097152 /* NumericLiteral */;
}
/**
 * Scans implicit octals
 *
 * @param parser Parser object
 * @param context Context masks
 */
function scanImplicitOctalDigits(parser, context) {
    if (context & 32768 /* Strict */)
        recordErrors(parser, context, 0 /* Unexpected */);
    let next = parser.source.charCodeAt(parser.index);
    let value = 0;
    let index = parser.index;
    let column = parser.column;
    let digits = 0;
    parser.flags |= 2 /* HasOctal */;
    // Implicit octal, unless there is a non-octal digit.
    // (Annex B.1.1 on Numeric Literals)
    while (index < parser.length) {
        next = parser.source.charCodeAt(index);
        if (next === 56 /* Eight */ || next === 57 /* Nine */)
            return scanNumeric(parser);
        if (!(next >= 48 /* Zero */ && next <= 55 /* Seven */))
            break;
        value = value * 8 + (next - 48 /* Zero */);
        index++;
        column++;
        digits++;
    }
    if (digits === 0)
        recordErrors(parser, context, 0 /* Unexpected */);
    parser.tokenValue = value;
    parser.index = index;
    parser.column = column;
    if (consumeOpt(parser, 110 /* LowerN */))
        return 2097275 /* BigInt */;
    return 2097152 /* NumericLiteral */;
}

function impossible(parser, context) {
    recordErrors(parser, context, 1 /* UnexpectedToken */, escapeForPrinting(nextUnicodeChar(parser)));
}
const table$1 = new Array(128).fill(impossible, 0, 0xFFFF);
table$1[32 /* Space */] =
    table$1[9 /* Tab */] =
        table$1[12 /* FormFeed */] =
            table$1[11 /* VerticalTab */] =
                table$1[12 /* FormFeed */] = (parser) => {
                    parser.index++;
                    parser.column++;
                    return 524288 /* WhiteSpace */;
                };
table$1[8232 /* LineSeparator */] =
    table$1[8233 /* ParagraphSeparator */] =
        table$1[10 /* LineFeed */] =
            table$1[13 /* CarriageReturn */] = (parser, context, first) => {
                advanceNewline(parser, first);
                parser.flags |= 1 /* NewLine */;
                return 524288 /* WhiteSpace */;
            };
// `,`
table$1[44 /* Comma */] = mapToToken(33554447 /* Comma */);
// `~`
table$1[126 /* Tilde */] = mapToToken(570425387 /* Complement */);
// `?`
table$1[63 /* QuestionMark */] = mapToToken(33554451 /* QuestionMark */);
// `[`
table$1[91 /* LeftBracket */] = mapToToken(33554448 /* LeftBracket */);
// `]`
table$1[93 /* RightBracket */] = mapToToken(33554449 /* RightBracket */);
// `{`
table$1[123 /* LeftBrace */] = mapToToken(33554441 /* LeftBrace */);
// `}`
table$1[125 /* RightBrace */] = mapToToken(33685516 /* RightBrace */);
// `:`
table$1[58 /* Colon */] = mapToToken(33554450 /* Colon */);
// `;`
table$1[59 /* Semicolon */] = mapToToken(33685518 /* Semicolon */);
// `(`
table$1[40 /* LeftParen */] = mapToToken(33554440 /* LeftParen */);
// `)`
table$1[41 /* RightParen */] = mapToToken(33554445 /* RightParen */);
// `"`, `'`
table$1[39 /* SingleQuote */] = table$1[34 /* DoubleQuote */] = scanStringLiteral;
// `0`
table$1[48 /* Zero */] = parseLeadingZero;
// `/`, `/=`, `/>`
table$1[47 /* Slash */] = (parser) => {
    parser.index++;
    parser.column++;
    if (parser.index >= parser.length)
        return 301992498 /* Divide */;
    const next = parser.source.charCodeAt(parser.index);
    if (next === 47 /* Slash */) {
        return skipSingleLineComment(parser);
    }
    else if (next === 42 /* Asterisk */) {
        return skipMultilineComment(parser);
    }
    else if (next === 61 /* EqualSign */) {
        parser.index++;
        parser.column++;
        return 167772194 /* DivideAssign */;
    }
    else if (next === 62 /* GreaterThan */) {
        parser.index++;
        parser.column++;
        return 33554455 /* JSXAutoClose */;
    }
    return 301992498 /* Divide */;
};
// `!`, `!=`, `!==`
table$1[33 /* Exclamation */] = (parser) => {
    parser.index++;
    parser.column++;
    if (consumeOpt(parser, 61 /* EqualSign */)) {
        if (consumeOpt(parser, 61 /* EqualSign */)) {
            return 301991479 /* StrictNotEqual */;
        }
        else {
            return 301991481 /* LooseNotEqual */;
        }
    }
    else {
        return 570425386 /* Negate */;
    }
};
// `%`, `%=`
table$1[37 /* Percent */] = (parser) => {
    parser.index++;
    parser.column++;
    if (consumeOpt(parser, 61 /* EqualSign */)) {
        return 167772195 /* ModuloAssign */;
    }
    else {
        return 301992497 /* Modulo */;
    }
};
// `&`, `&&`, `&=`
table$1[38 /* Ampersand */] = (parser) => {
    parser.index++;
    parser.column++;
    if (parser.index < parser.length) {
        const next = parser.source.charCodeAt(parser.index);
        if (next === 38 /* Ampersand */) {
            parser.index++;
            parser.column++;
            return 301990452 /* LogicalAnd */;
        }
        else if (next === 61 /* EqualSign */) {
            parser.index++;
            parser.column++;
            return 167772198 /* BitwiseAndAssign */;
        }
    }
    return 301991233 /* BitwiseAnd */;
};
// `*`, `**`, `*=`, `**=`
table$1[42 /* Asterisk */] = (parser) => {
    parser.index++;
    parser.column++;
    if (parser.index < parser.length) {
        const next = parser.source.charCodeAt(parser.index);
        if (next === 42 /* Asterisk */) {
            parser.index++;
            parser.column++;
            if (consumeOpt(parser, 61 /* EqualSign */)) {
                return 167772190 /* ExponentiateAssign */;
            }
            else {
                return 301992755 /* Exponentiate */;
            }
        }
        else if (next === 61 /* EqualSign */) {
            parser.index++;
            parser.column++;
            return 167772193 /* MultiplyAssign */;
        }
    }
    return 301992496 /* Multiply */;
};
// `+`, `++`, `+=`
table$1[43 /* Plus */] = (parser) => {
    parser.index++;
    parser.column++;
    if (parser.index < parser.length) {
        const next = parser.source.charCodeAt(parser.index);
        if (next === 43 /* Plus */) {
            parser.index++;
            parser.column++;
            return 1107296280 /* Increment */;
        }
        else if (next === 61 /* EqualSign */) {
            parser.index++;
            parser.column++;
            return 167772191 /* AddAssign */;
        }
    }
    return 838863148 /* Add */;
};
// `-`, `--`, `-=`
table$1[45 /* Hyphen */] = (parser) => {
    parser.index++;
    parser.column++;
    const next = parser.source.charCodeAt(parser.index);
    if (next === 45 /* Hyphen */ &&
        parser.source.charCodeAt(parser.index + 1) === 62 /* GreaterThan */) {
        skipSingleHTMLComment(parser);
        return 1572982 /* HTMLComment */;
    }
    else if (parser.index < parser.source.length) {
        if (next === 45 /* Hyphen */) {
            parser.index++;
            parser.column++;
            return 1107296281 /* Decrement */;
        }
        else if (next === 61 /* EqualSign */) {
            parser.index++;
            parser.column++;
            return 167772192 /* SubtractAssign */;
        }
    }
    return 838863149 /* Subtract */;
};
// `.`, `...`, `.123` (numeric literal)
table$1[46 /* Period */] = (parser) => {
    let index = parser.index + 1;
    if (index < parser.source.length) {
        const next = parser.source.charCodeAt(index);
        if (next === 46 /* Period */) {
            index++;
            if (index < parser.source.length &&
                parser.source.charCodeAt(index) === 46 /* Period */) {
                parser.index = index + 1;
                parser.column += 3;
                return 33554443 /* Ellipsis */;
            }
        }
        else if (next >= 48 /* Zero */ && next <= 57 /* Nine */) {
            return parseFractionalNumber(parser);
        }
    }
    parser.index++;
    parser.column++;
    return 33554442 /* Period */;
};
// `1`...`9`
for (let i = 49 /* One */; i <= 57 /* Nine */; i++) {
    table$1[i] = scanNumeric;
}
// `<`, `<=`, `<<`, `<<=`, `</`,  <!--
table$1[60 /* LessThan */] = (parser, context) => {
    parser.index++;
    parser.column++;
    if (parser.index < parser.source.length) {
        switch (parser.source.charCodeAt(parser.index)) {
            case 60 /* LessThan */:
                parser.index++;
                parser.column++;
                if (consumeOpt(parser, 61 /* EqualSign */)) {
                    return 167772187 /* ShiftLeftAssign */;
                }
                else {
                    return 301991998 /* ShiftLeft */;
                }
            case 61 /* EqualSign */:
                parser.index++;
                parser.column++;
                return 301991738 /* LessThanOrEqual */;
            case 33 /* Exclamation */:
                {
                    if (parser.source.charCodeAt(parser.index + 1) === 45 /* Hyphen */ &&
                        parser.source.charCodeAt(parser.index + 2) === 45 /* Hyphen */) {
                        return skipSingleHTMLComment(parser);
                    }
                    break;
                }
            case 47 /* Slash */:
                {
                    if (!(context & 2 /* OptionsJSX */))
                        break;
                    const index = parser.index + 1;
                    // Check that it's not a comment start.
                    if (index < parser.source.length) {
                        const next = parser.source.charCodeAt(index);
                        if (next === 42 /* Asterisk */ || next === 47 /* Slash */)
                            break;
                    }
                    parser.index++;
                    parser.column++;
                    return 33554454 /* JSXClose */;
                }
            default: // ignore
        }
    }
    return 301991740 /* LessThan */;
};
// `=`, `==`, `===`, `=>`
table$1[61 /* EqualSign */] = (parser) => {
    parser.index++;
    parser.column++;
    if (parser.index < parser.source.length) {
        const next = parser.source.charCodeAt(parser.index);
        if (next === 61 /* EqualSign */) {
            parser.index++;
            parser.column++;
            if (consumeOpt(parser, 61 /* EqualSign */)) {
                return 301991478 /* StrictEqual */;
            }
            else {
                return 301991480 /* LooseEqual */;
            }
        }
        else if (next === 62 /* GreaterThan */) {
            parser.index++;
            parser.column++;
            return 33554439 /* Arrow */;
        }
    }
    return 167772186 /* Assign */;
};
// `>`, `>=`, `>>`, `>>>`, `>>=`, `>>>=`
table$1[62 /* GreaterThan */] = (parser) => {
    parser.index++;
    parser.column++;
    if (parser.index < parser.source.length) {
        const next = parser.source.charCodeAt(parser.index);
        if (next === 62 /* GreaterThan */) {
            parser.index++;
            parser.column++;
            if (parser.index < parser.source.length) {
                const next = parser.source.charCodeAt(parser.index);
                if (next === 62 /* GreaterThan */) {
                    parser.index++;
                    parser.column++;
                    if (consumeOpt(parser, 61 /* EqualSign */)) {
                        return 167772189 /* LogicalShiftRightAssign */;
                    }
                    else {
                        return 301992000 /* LogicalShiftRight */;
                    }
                }
                else if (next === 61 /* EqualSign */) {
                    parser.index++;
                    parser.column++;
                    return 167772188 /* ShiftRightAssign */;
                }
            }
            return 301991999 /* ShiftRight */;
        }
        else if (next === 61 /* EqualSign */) {
            parser.index++;
            parser.column++;
            return 301991739 /* GreaterThanOrEqual */;
        }
    }
    return 301991741 /* GreaterThan */;
};
// `A`...`Z`
for (let i = 65 /* UpperA */; i <= 90 /* UpperZ */; i++) {
    table$1[i] = scanIdentifier;
}
// `a`...z`
for (let i = 97 /* LowerA */; i <= 122 /* LowerZ */; i++) {
    table$1[i] = scanIdentifier;
}
// `\\u{N}var`
table$1[92 /* Backslash */] = scanIdentifier;
// `^`, `^=`
table$1[94 /* Caret */] = (parser) => {
    parser.index++;
    parser.column++;
    if (consumeOpt(parser, 61 /* EqualSign */)) {
        return 167772196 /* BitwiseXorAssign */;
    }
    else {
        return 301990979 /* BitwiseXor */;
    }
};
// `_var`
table$1[95 /* Underscore */] = scanIdentifier;
// ``string``
// table[Chars.Backtick] = scanTemplate;
// `|`, `||`, `|=`
table$1[124 /* VerticalBar */] = (parser) => {
    parser.index++;
    parser.column++;
    if (parser.index >= parser.length)
        return 301990722 /* BitwiseOr */;
    const next = parser.source.charCodeAt(parser.index);
    if (next === 124 /* VerticalBar */) {
        parser.index++;
        parser.column++;
        return 301990197 /* LogicalOr */;
    }
    else if (next === 61 /* EqualSign */) {
        parser.index++;
        parser.column++;
        return 167772197 /* BitwiseOrAssign */;
    }
    return 301990722 /* BitwiseOr */;
};
function scan(parser, context) {
    parser.flags &= ~1 /* NewLine */;
    while (parser.index < parser.length) {
        const first = parser.source.charCodeAt(parser.index);
        //    if (first <= 32) continue;
        // Remember the position of the next token
        parser.startIndex = parser.index;
        parser.startColumn = parser.column;
        parser.startLine = parser.line;
        if ((first >= 97 /* LowerA */ && first <= 122 /* LowerZ */) || first === 36 /* Dollar */) {
            return scanIdentifier(parser);
        }
        else {
            const token = table$1[first](parser, context, first);
            if ((token & 524288 /* WhiteSpace */) === 524288 /* WhiteSpace */)
                continue;
            if (context & 1 /* OptionsTokenize */)
                parser.tokens.push(convertToken(parser, token));
            return token;
        }
    }
    return 131072 /* EndOfSource */;
}

function swapFlags(flags, mask) {
    return (flags | mask) ^ mask;
}
function setContext(context, mask) {
    return (context | mask) ^ mask;
}
function swapContext(context, state) {
    context = setContext(context, 16777216 /* Yield */);
    context = setContext(context, 524288 /* Async */);
    context = setContext(context, 2097152 /* InParameter */);
    if (state & 1 /* Generator */)
        context = context | 16777216 /* Yield */;
    if (state & 8 /* Async */)
        context = context | 524288 /* Async */;
    // `new.target` disallowed for arrows in global scope
    if (!(state & 4 /* Arrow */))
        context = context | 33554432 /* NewTarget */;
    return context;
}
function nextToken(parser, context) {
    parser.lastIndex = parser.index;
    parser.lastLine = parser.line;
    parser.lastColumn = parser.column;
    const token = scan(parser, context);
    return (parser.token = token);
}
function expect(parser, context, token, errMsg = 1 /* UnexpectedToken */) {
    if (parser.token !== token) {
        recordErrors(parser, context, errMsg, tokenDesc(parser.token));
        return false;
    }
    nextToken(parser, context);
    return true;
}
function consume(parser, context, token) {
    if (parser.token !== token)
        return false;
    nextToken(parser, context);
    return true;
}
/**
 * Automatic Semicolon Insertion
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-automatic-semicolon-insertion)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function consumeSemicolon(parser, context) {
    return (parser.token & 131072 /* ASI */) === 131072 /* ASI */ || parser.flags & 1 /* NewLine */
        ? consume(parser, context, 33685518 /* Semicolon */)
        : recordErrors(parser, context, 0 /* Unexpected */);
}
/**
 * Does a lookahead
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param callback Callback function to be invoked
 * @param isLookahead  If set to false, the parser will not rewind
 */
function lookahead(parser, context, callback, isLookahead = true) {
    const { tokenValue, flags, line, column, index, startIndex, tokenRaw, token, tokenRegExp, } = parser;
    const result = callback(parser, context);
    if (!result || isLookahead) {
        parser.index = index;
        parser.token = token;
        parser.tokenValue = tokenValue;
        parser.tokenValue = tokenValue;
        parser.flags = flags;
        parser.line = line;
        parser.column = column;
        parser.tokenRaw = tokenRaw;
        parser.startIndex = startIndex;
        parser.tokenRegExp = tokenRegExp;
        parser.tokenRegExp = tokenRegExp;
    }
    return result;
}
/**
 * Validates if the next token in the stream is a function keyword on the same line.
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function nextTokenIsFuncKeywordOnSameLine(parser, context) {
    nextToken(parser, context);
    return !(parser.flags & 1 /* NewLine */) && parser.token === 8276 /* FunctionKeyword */;
}
/**
* Validates if the next token in the stream is a left paren or a period
*
* @param parser Parser object
* @param context  Context masks
*/
function nextTokenIsLeftParenOrPeriod(parser, context) {
    nextToken(parser, context);
    return parser.token === 33554440 /* LeftParen */ || parser.token === 33554442 /* Period */;
}
/**
* Validates if the next token in the stream is left parenthesis.
*
* @param parser Parser object
* @param context  Context masks
*/
function nextTokenIsLeftParenOrKeyword(parser, context) {
    nextToken(parser, context);
    return (parser.token & 8388608 /* Identifier */) === 8388608 /* Identifier */ ||
        parser.token === 8417280 /* Keyword */ ||
        parser.token === 33554440 /* LeftParen */;
}
function nextTokenIsLeftParen(parser, context) {
    nextToken(parser, context);
    return parser.token === 33554440 /* LeftParen */;
}
/**
 * Validates if the next token in the stream is arrow
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function nextTokenIsArrow(parser, context) {
    nextToken(parser, context);
    return parser.token === 33554439 /* Arrow */;
}
/**
* Returns true if this an valid lexical binding and not an identifier
*
* @param parser Parser object
* @param context  Context masks
*/
function isLexical(parser, context) {
    nextToken(parser, context);
    const { token } = parser;
    return (token & 8388608 /* Identifier */) === 8388608 /* Identifier */ ||
        token === 33554448 /* LeftBracket */ ||
        token === 33554441 /* LeftBrace */ ||
        token === 16453 /* LetKeyword */ ||
        token === 16491 /* YieldKeyword */;
}
function isInOrOf(parser) {
    return parser.token === 301999918 /* InKeyword */ || parser.token === 4211 /* OfKeyword */;
}
/**
 * Reinterpret various expressions as pattern
 * This is only used for assignment and arrow parameter list
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param node AST node
 */
function reinterpret(parser, context, node) {
    switch (node.type) {
        case 'ArrayExpression':
            node.type = 'ArrayPattern';
            for (let i = 0; i < node.elements.length; ++i) {
                // skip holes in pattern
                if (node.elements[i] !== null) {
                    reinterpret(parser, context, node.elements[i]);
                }
            }
            return;
        case 'ObjectExpression':
            node.type = 'ObjectPattern';
            for (let i = 0; i < node.properties.length; i++) {
                reinterpret(parser, context, node.properties[i].value);
            }
            return;
        case 'AssignmentExpression':
            node.type = 'AssignmentPattern';
            //  if (node.operator !== '=') recordErrors(parser, context, Errors.InvalidLHSDefaultValue);
            delete node.operator;
            return;
        default: // ignore
    }
}
/**
 * Returns true if start of an iteration statement
 *
 * @param parser Parser object
 */
function isIterationStatement(parser) {
    return parser.token === 8286 /* WhileKeyword */ || parser.token === 8270 /* DoKeyword */ || parser.token === 8275 /* ForKeyword */;
}
/**
 * Add label to the stack
 *
 * @param parser Parser object
 * @param label Label to be added
 */
function addLabel(parser, label) {
    if (parser.labelSet === undefined)
        parser.labelSet = {};
    parser.labelSet[label] = true;
    parser.labelSetStack[parser.labelDepth] = parser.labelSet;
    parser.iterationStack[parser.labelDepth] = isIterationStatement(parser);
    parser.labelSet = undefined;
    parser.labelDepth++;
}
/**
 * Add function
 *
 * @param parser Parser object
 * @param label Label to be added
 */
function addCrossingBoundary(parser) {
    parser.labelSetStack[parser.labelDepth] = parser.functionBoundaryStack;
    parser.iterationStack[parser.labelDepth] = 0 /* Empty */;
    parser.labelDepth++;
}
/**
 * Validates continue statement
 *
 * @param parser Parser object
 * @param label Label
 */
function validateContinueLabel(parser, context, label) {
    const state = getLabel(parser, label, true);
    if ((state & 1 /* Iteration */) !== 1 /* Iteration */) {
        if (state & 2 /* CrossingBoundary */) {
            recordErrors(parser, context, 23 /* InvalidNestedStatement */);
        }
        else {
            recordErrors(parser, context, 21 /* UnknownLabel */, label);
        }
    }
}
/**
 * Validates break statement
 *
 * @param parser Parser object
 * @param label Label
 */
function validateBreakStatement(parser, context, label) {
    const state = getLabel(parser, label);
    if ((state & 1 /* Iteration */) !== 1 /* Iteration */)
        recordErrors(parser, context, 21 /* UnknownLabel */, label);
}
/**
 * Add label
 *
 * @param parser Parser object
 * @param label Label to be added
 */
function getLabel(parser, label, iterationStatement = false, crossBoundary = false) {
    if (!iterationStatement && parser.labelSet && parser.labelSet[label] === true) {
        return 1 /* Iteration */;
    }
    if (!parser.labelSetStack)
        return 0 /* Empty */;
    let stopAtTheBorder = false;
    for (let i = parser.labelDepth - 1; i >= 0; i--) {
        const labelSet = parser.labelSetStack[i];
        if (labelSet === parser.functionBoundaryStack) {
            if (crossBoundary) {
                break;
            }
            else {
                stopAtTheBorder = true;
                continue;
            }
        }
        if (iterationStatement && parser.iterationStack[i] === false) {
            continue;
        }
        if (labelSet[label] === true) {
            return stopAtTheBorder ? 2 /* CrossingBoundary */ : 1 /* Iteration */;
        }
    }
    return 0 /* Empty */;
}
function isStartOfExpression(parser) {
    switch (parser.token) {
        case 8388608 /* Identifier */:
        case 2097152 /* NumericLiteral */:
        case 4194304 /* StringLiteral */:
        case 16777216 /* RegularExpression */:
        case 8193 /* FalseKeyword */:
        case 8194 /* TrueKeyword */:
        case 8195 /* NullKeyword */:
        case 67108864 /* Template */:
        case 33554440 /* LeftParen */:
        case 33554441 /* LeftBrace */:
        case 33554448 /* LeftBracket */:
        case 167772194 /* DivideAssign */:
        case 301992498 /* Divide */:
        case 301991740 /* LessThan */:
        case 8260 /* VarKeyword */:
        case 16453 /* LetKeyword */:
        case 8262 /* ConstKeyword */:
        case 8276 /* FunctionKeyword */:
        case 8277 /* IfKeyword */:
        case 8278 /* ImportKeyword */:
        case 8281 /* SuperKeyword */:
        case 8282 /* SwitchKeyword */:
        case 8283 /* ThisKeyword */:
        case 8284 /* ThrowKeyword */:
        case 16491 /* YieldKeyword */:
        case 4206 /* AwaitKeyword */:
        case 8388705 /* Eval */:
        case 8388704 /* Arguments */:
        case 2097275 /* BigInt */:
        case 8281 /* SuperKeyword */:
            return true;
        default:
            return false;
    }
}
/**
 * Parse identifier name
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-IdentifierName)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param t token
 */
function parseIdentifierName(parser, context, t) {
    if (!(t & (8388608 /* Identifier */ | 8417280 /* Keyword */))) {
        recordErrors(parser, context, 34 /* UnexpectedKeyword */, tokenDesc(t));
    }
    return parseIdentifier(parser, context);
}

// Declarations
/**
 * Parses class declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseClassDeclaration(parser, context) {
    context = context | 32768 /* Strict */;
    expect(parser, context, 8266 /* ClassKeyword */);
    let id = null;
    if ((parser.token & 8388608 /* Identifier */) === 8388608 /* Identifier */ || parser.token & 8417280 /* Keyword */ && parser.token !== 8273 /* ExtendsKeyword */) {
        id = parseBindingIdentifier(parser, context);
    }
    else if (!(context & 131072 /* RequireIdentifier */))
        recordErrors(parser, context, 18 /* UnNamedFunctionDecl */);
    let superClass = null;
    if (consume(parser, context, 8273 /* ExtendsKeyword */)) {
        superClass = parseLeftHandSideExpression(parser, context | 32768 /* Strict */);
    }
    const body = parseClassBodyAndElementList(parser, context);
    return {
        type: 'ClassDeclaration',
        id,
        superClass,
        body
    };
}
/**
 * Parses function declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseFunctionDeclaration(parser, context, state = 0 /* None */) {
    expect(parser, context, 8276 /* FunctionKeyword */);
    if (consume(parser, context, 301992496 /* Multiply */))
        state |= 1 /* Generator */;
    let id = null;
    if (parser.token !== 33554440 /* LeftParen */) {
        id = parseBindingIdentifier(parser, context);
    }
    else if (!(context & 131072 /* RequireIdentifier */))
        recordErrors(parser, context, 18 /* UnNamedFunctionDecl */);
    context = swapContext(context, state);
    const { params, body } = parseFormalListAndBody(parser, context);
    return {
        type: 'FunctionDeclaration',
        body,
        params,
        async: !!(state & 8 /* Async */),
        generator: !!(state & 1 /* Generator */),
        expression: false,
        id
    };
}
/**
 * VariableDeclaration :
 *   BindingIdentifier Initializeropt
 *   BindingPattern Initializer
 *
 * VariableDeclarationNoIn :
 *   BindingIdentifier InitializerNoInopt
 *   BindingPattern InitializerNoIn
 *
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseVariableDeclaration(id, init) {
    return {
        type: 'VariableDeclarator',
        init,
        id,
    };
}
function parseVariableDeclarationList(parser, context, type, origin) {
    const list = [];
    parseDelimitedBindingList(parser, context, type, origin, list);
    return list;
}

/**
 * Parse binding identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BindingIdentifier)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseBindingIdentifier(parser, context, kind = 1 /* Var */) {
    const { token: t } = parser;
    if ((t & 4096 /* Contextual */) === 4096 /* Contextual */) {
        if (parser.token === 4206 /* AwaitKeyword */) {
            if ((context & 32768 /* Strict */) === 32768 /* Strict */)
                recordErrors(parser, context, 0 /* Unexpected */);
            if ((context & 524288 /* Async */) === 524288 /* Async */)
                recordErrors(parser, context, 0 /* Unexpected */);
        }
    }
    else if (t === 8388705 /* Eval */ || t === 8388704 /* Arguments */) {
        if ((context & 32768 /* Strict */) === 32768 /* Strict */)
            recordErrors(parser, context, 0 /* Unexpected */);
        parser.flags |= 64 /* StrictEvalArguments */;
    }
    else if ((t & 16384 /* FutureReserved */) === 16384 /* FutureReserved */) {
        if ((context & 32768 /* Strict */) === 32768 /* Strict */)
            recordErrors(parser, context, 0 /* Unexpected */);
        parser.flags |= 128 /* StrictReserved */;
    }
    else if ((t & 8192 /* Reserved */) === 8192 /* Reserved */) {
        recordErrors(parser, context, 0 /* Unexpected */);
    }
    const name = parser.tokenValue;
    nextToken(parser, context);
    return {
        type: 'Identifier',
        name
    };
}
/**
 * Parses either a binding identifier or binding pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseBindingIdentifierOrPattern(parser, context, type) {
    if (parser.token === 33554441 /* LeftBrace */) {
        return parserObjectAssignmentPattern(parser, context, type);
    }
    else if (parser.token === 33554448 /* LeftBracket */) {
        return parseArrayAssignmentPattern(parser, context, type);
    }
    return parseBindingIdentifier(parser, context);
}
/**
 * Parse assignment rest element
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentRestElement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAssignmentRestElement(parser, context, type, endToken = 33554449 /* RightBracket */) {
    expect(parser, context, 33554443 /* Ellipsis */);
    const argument = parseBindingIdentifierOrPattern(parser, context);
    if (parser.token === 167772186 /* Assign */)
        recordErrors(parser, context, 10 /* ElementAfterRest */);
    if (parser.token !== endToken)
        recordErrors(parser, context, 10 /* ElementAfterRest */);
    return {
        type: 'RestElement',
        argument,
    };
}
/**
 * Parses array assignment pattern
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayAssignmentPattern)
 *
 * @param Parser object
 * @param Context masks
 */
function parseArrayAssignmentPattern(parser, context, type) {
    // ArrayAssignmentPattern[Yield] :
    //   [ Elisionopt AssignmentRestElement[?Yield]opt ]
    //   [ AssignmentElementList[?Yield] ]
    //   [ AssignmentElementList[?Yield] , Elisionopt AssignmentRestElement[?Yield]opt ]
    //
    // AssignmentRestElement[Yield] :
    //   ... DestructuringAssignmentTarget[?Yield]
    //
    // AssignmentElementList[Yield] :
    //   AssignmentElisionElement[?Yield]
    //   AssignmentElementList[?Yield] , AssignmentElisionElement[?Yield]
    //
    // AssignmentElisionElement[Yield] :
    //   Elisionopt AssignmentElement[?Yield]
    //
    // AssignmentElement[Yield] :
    //   DestructuringAssignmentTarget[?Yield] Initializer[In,?Yield]opt
    //
    // DestructuringAssignmentTarget[Yield] :
    //   LeftHandSideExpression[?Yield]
    //
    expect(parser, context, 33554448 /* LeftBracket */);
    const elements = [];
    while (parser.token !== 33554449 /* RightBracket */) {
        if (consume(parser, context, 33554447 /* Comma */)) {
            elements.push(null);
        }
        else {
            if (parser.token === 33554443 /* Ellipsis */) {
                elements.push(parseAssignmentRestElement(parser, context, type));
                break;
            }
            else {
                elements.push(parseBindingInitializer(parser, context, type));
            }
            if (parser.token !== 33554449 /* RightBracket */)
                expect(parser, context, 33554447 /* Comma */);
        }
    }
    expect(parser, context, 33554449 /* RightBracket */);
    // tslint:disable-next-line:no-object-literal-type-assertion
    return {
        type: 'ArrayPattern',
        elements,
    };
}
/** Parse assignment pattern
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentPattern)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayAssignmentPattern)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param left LHS of assignment pattern
 * @param pos Location
 */
function parseAssignmentPattern(parser, context, left) {
    return {
        type: 'AssignmentPattern',
        left,
        right: parseAssignmentExpression(parser, context),
    };
}
/**
 * Parse binding initializer
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentPattern)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayAssignmentPattern)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseBindingInitializer(parser, context, type) {
    const left = parseBindingIdentifierOrPattern(parser, context, type);
    return !consume(parser, context, 167772186 /* Assign */) ?
        left : {
        type: 'AssignmentPattern',
        left,
        right: parseAssignmentExpression(parser, context),
    };
}
/**
 * Parse rest property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentRestProperty)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
// tslint:disable-next-line:function-name
function parseAssignmentRestProperty(parser, context) {
    expect(parser, context, 33554443 /* Ellipsis */);
    const argument = parseBindingIdentifierOrPattern(parser, context);
    return {
        type: 'RestElement',
        argument,
    };
}
/**
 * Parse object assignment pattern
 *
 * @param Parser Parser object
 * @param Context Context masks
 */
function parserObjectAssignmentPattern(parser, context, type) {
    const properties = [];
    expect(parser, context, 33554441 /* LeftBrace */);
    while (parser.token !== 33685516 /* RightBrace */) {
        if (parser.token === 33554443 /* Ellipsis */) {
            properties.push(parseAssignmentRestProperty(parser, context));
            break;
        }
        properties.push(parseAssignmentProperty(parser, context, type));
        if (parser.token !== 33685516 /* RightBrace */)
            expect(parser, context, 33554447 /* Comma */);
    }
    expect(parser, context, 33685516 /* RightBrace */);
    return {
        type: 'ObjectPattern',
        properties,
    };
}
/**
 * Parse assignment property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentProperty)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseAssignmentProperty(parser, context, type) {
    const { token } = parser;
    let key = null;
    let value;
    const computed = parser.token === 33554448 /* LeftBracket */;
    let shorthand = false;
    // single name binding
    if (token & (8388608 /* Identifier */ | 8192 /* Reserved */ | 16384 /* FutureReserved */)) {
        key = parseBindingIdentifier(parser, context);
        shorthand = !consume(parser, context, 33554450 /* Colon */);
        if (shorthand) {
            const hasInitializer = consume(parser, context, 167772186 /* Assign */);
            value = hasInitializer ? parseAssignmentPattern(parser, context, key) : key;
        }
        else
            value = parseBindingInitializer(parser, context, type);
    }
    else {
        key = parseComputedPropertyName(parser, context);
        expect(parser, context, 33554450 /* Colon */);
        value = parseBindingInitializer(parser, context, type);
    }
    return {
        type: 'Property',
        kind: 'init',
        key,
        computed,
        value,
        method: false,
        shorthand,
    };
}
/**
 * Parses a delimited binding list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BindingList)
 * @see [Link](https://tc39.github.io/ecma262/#prod-FormalParameterList)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Catch)
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-statement)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param type Binding type
 * @param origin Binding origin
 */
function parseDelimitedBindingList(parser, context, type, origin, args = []) {
    const isBinding$$1 = parser.token === 33554441 /* LeftBrace */ || parser.token === 33554448 /* LeftBracket */;
    while (parser.token !== 33554445 /* RightParen */) {
        args.push(parseBindingList(parser, context, type, origin));
        if (!consume(parser, context, 33554447 /* Comma */))
            break;
    }
    return args;
}
/**
 * Parse binding list elements
 *
 * @param parser Parser object
 * @param context Context masks
 * @param type Binding type
 * @param origin Binding origin
 */
function parseBindingList(parser, context, type, origin) {
    let left;
    if ((parser.token & 8388608 /* Identifier */) === 8388608 /* Identifier */) {
        left = parseBindingIdentifier(parser, context);
    }
    else if (parser.token === 33554441 /* LeftBrace */ || parser.token === 33554448 /* LeftBracket */) {
        parser.flags |= 16 /* SimpleParameterList */;
        left = parser.token === 33554441 /* LeftBrace */ ?
            parserObjectAssignmentPattern(parser, context, type) :
            parseArrayAssignmentPattern(parser, context, type);
        if (parser.token !== 167772186 /* Assign */) {
            if (origin & 1 /* ForStatement */ && isInOrOf(parser)) ;
            else if (origin & (2 /* FunctionArgs */ | 4 /* CatchClause */)) ;
            else {
                recordErrors(parser, context, 9 /* DeclarationMissingInitializer */);
            }
        }
    }
    else if (parser.token === 33554443 /* Ellipsis */) {
        return parseAssignmentRestElement(parser, context, type, 33554445 /* RightParen */);
    }
    else if (parser.token !== 33554445 /* RightParen */) {
        recordErrors(parser, context, 1 /* UnexpectedToken */, tokenDesc(parser.token));
    }
    if (parser.token !== 167772186 /* Assign */)
        return type & 14 /* Variable */ ?
            parseVariableDeclaration(left, null) : left;
    nextToken(parser, context);
    parser.flags |= 16 /* SimpleParameterList */;
    return type & 14 /* Variable */ ?
        parseVariableDeclaration(left, parseAssignmentExpression(parser, context)) :
        parseAssignmentPattern(parser, context, left);
}

/**
 * Expression :
 *   AssignmentExpression
 *   Expression , AssignmentExpression
 *
 * ExpressionNoIn :
 *   AssignmentExpressionNoIn
 *   ExpressionNoIn , AssignmentExpressionNoIn
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Expression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseExpression(parser, context) {
    const expr = parseAssignmentExpression(parser, context);
    if (parser.token !== 33554447 /* Comma */)
        return expr;
    return parseSequenceExpression(parser, context, expr);
}
/**
 * Parse secuence expression
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseSequenceExpression(parser, context, left) {
    const expressions = [left];
    while (consume(parser, context, 33554447 /* Comma */)) {
        expressions.push(parseAssignmentExpression(parser, context));
    }
    return {
        type: 'SequenceExpression',
        expressions,
    };
}
function parseAssignmentExpression(parser, context) {
    // AssignmentExpression ::
    //   ConditionalExpression
    //   ArrowFunction
    //   YieldExpression
    //   LeftHandSideExpression AssignmentOperator AssignmentExpression
    const { token } = parser;
    if (token === 16491 /* YieldKeyword */ && context & 16777216 /* Yield */)
        return parseYieldExpression(parser, context);
    const isAsync = token === 4205 /* AsyncKeyword */ /*&& !(parser.flags & Flags.NewLine)*/ &&
        lookahead(parser, context, nextTokenIsLeftParenOrKeyword);
    const isParenthesized = parser.token === 33554440 /* LeftParen */;
    let left = parseConditionalExpression(parser, context);
    if (isAsync && (parser.token & 8388608 /* Identifier */) === 8388608 /* Identifier */ && lookahead(parser, context, nextTokenIsArrow)) {
        left = [parseIdentifier(parser, context)];
    }
    if (parser.token === 33554439 /* Arrow */) {
        if ((token & 8388608 /* Identifier */))
            left = [left];
        return parseArrowFunction(parser, context, isAsync ? 8 /* Async */ | 4 /* Arrow */ : 4 /* Arrow */, left);
    }
    if ((parser.token & 134217728 /* IsAssignOp */) === 134217728 /* IsAssignOp */) {
        //     if ((parser.flags & Flags.Assignable) !== Flags.Assignable) recordErrors(parser, context, Errors.InvalidLHSDefaultValue);
        if (parser.token === 167772186 /* Assign */) {
            if (left.type === 'ArrayExpression' || left.type === 'ObjectExpression')
                reinterpret(parser, context, left);
        }
        const operator = parser.token;
        nextToken(parser, context);
        const right = parseAssignmentExpression(parser, context);
        return {
            type: 'AssignmentExpression',
            left: left,
            operator: tokenDesc(operator),
            right,
        };
    }
    return left;
}
function parseYieldExpression(parser, context) {
    expect(parser, context, 16491 /* YieldKeyword */);
    let argument = null;
    let delegate = false;
    if (!(parser.flags & 1 /* NewLine */)) {
        delegate = consume(parser, context, 301992496 /* Multiply */);
        if (delegate || isStartOfExpression(parser)) {
            argument = parseAssignmentExpression(parser, context);
        }
    }
    return {
        type: 'YieldExpression',
        argument,
        delegate,
    };
}
/**
 * Parse conditional expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ConditionalExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseConditionalExpression(parser, context) {
    // ConditionalExpression ::
    // LogicalOrExpression
    // LogicalOrExpression '?' AssignmentExpression ':' AssignmentExpression
    const test = parseBinaryExpression(parser, context, 0);
    if (!consume(parser, context, 33554451 /* QuestionMark */))
        return test;
    const consequent = parseAssignmentExpression(parser, context);
    expect(parser, context, 33554450 /* Colon */);
    const alternate = parseAssignmentExpression(parser, context);
    return {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate,
    };
}
/**
 * Parse binary expression.
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-exp-operator)
 * @see [Link](https://tc39.github.io/ecma262/#sec-binary-logical-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-additive-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-bitwise-shift-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-equality-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-binary-logical-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-relational-operators)
 * @see [Link](https://tc39.github.io/ecma262/#sec-multiplicative-operators)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param minPrec Minimum precedence value
 * @param pos Line / Column info
 * @param Left Left hand side of the binary expression
 */
function parseBinaryExpression(parser, context, minPrec, left = parseUnaryExpression(parser, context)) {
    // Shift-reduce parser for the binary operator part of the JS expression
    // syntax.
    const bit = (context & 1048576 /* DisallowIn */) === 1048576 /* DisallowIn */;
    while ((parser.token & 268435456 /* IsBinaryOp */) === 268435456 /* IsBinaryOp */) {
        const t = parser.token;
        const prec = t & 3840 /* Precedence */;
        const delta = (t === 301992755 /* Exponentiate */) << 8 /* PrecStart */;
        if (bit && t === 301999918 /* InKeyword */)
            break;
        // When the next token is no longer a binary operator, it's potentially the
        // start of an expression, so we break the loop
        if (prec + delta <= minPrec)
            break;
        nextToken(parser, context);
        parser.flags &= ~4 /* Assignable */;
        left = {
            type: t & 262144 /* IsLogical */ ? 'LogicalExpression' : 'BinaryExpression',
            left,
            right: parseBinaryExpression(parser, context, prec),
            operator: tokenDesc(t),
        };
    }
    return left;
}
/**
 * Parse await expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AwaitExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location info
 */
function parseAwaitExpression(parser, context) {
    if (context & 2097152 /* InParameter */)
        recordErrors(parser, context, 0 /* Unexpected */);
    expect(parser, context, 4206 /* AwaitKeyword */);
    return {
        type: 'AwaitExpression',
        argument: parseUnaryExpression(parser, context),
    };
}
/**
 * Parses unary expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-UnaryExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseUnaryExpression(parser, context) {
    // UnaryExpression ::
    //   PostfixExpression
    //   'delete' UnaryExpression
    //   'void' UnaryExpression
    //   'typeof' UnaryExpression
    //   '++' UnaryExpression
    //   '--' UnaryExpression
    //   '+' UnaryExpression
    //   '-' UnaryExpression
    //   '~' UnaryExpression
    //   '!' UnaryExpression
    //   [+Await] AwaitExpression[?Yield]
    const { token } = parser;
    if ((token & 536870912 /* IsUnaryOp */) === 536870912 /* IsUnaryOp */) {
        nextToken(parser, context);
        const argument = parseUnaryExpression(parser, context);
        return {
            type: 'UnaryExpression',
            operator: tokenDesc(token),
            argument,
            prefix: true,
        };
    }
    else if (parser.token === 4206 /* AwaitKeyword */
        && ((context & 524288 /* Async */) === 524288 /* Async */ ||
            (context & 262144 /* InFunctionBody */) !== 262144 /* InFunctionBody */ && (context & 4096 /* OptionsExperimental */) === 4096 /* OptionsExperimental */)) {
        return parseAwaitExpression(parser, context);
    }
    return parseUpdateExpression(parser, context);
}
/**
 * Parses update expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-UpdateExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseUpdateExpression(parser, context) {
    // UpdateExpression ::
    //   LeftHandSideExpression ('++' | '--')?
    const { token } = parser;
    if ((parser.token & 1073741824 /* IsUpdateOp */) === 1073741824 /* IsUpdateOp */) {
        nextToken(parser, context);
        const expr = parseLeftHandSideExpression(parser, context);
        return {
            type: 'UpdateExpression',
            argument: expr,
            operator: tokenDesc(token),
            prefix: true,
        };
    }
    const expression = parseLeftHandSideExpression(parser, context);
    if ((parser.token & 1073741824 /* IsUpdateOp */) === 1073741824 /* IsUpdateOp */ && !(parser.flags & 1 /* NewLine */)) {
        const operator = parser.token;
        nextToken(parser, context);
        return {
            type: 'UpdateExpression',
            argument: expression,
            operator: tokenDesc(operator),
            prefix: false,
        };
    }
    return expression;
}
/**
 * Parse left hand side expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-LeftHandSideExpression)
 *
 * @param Parser Parer instance
 * @param Context Contextmasks
 * @param pos Location info
 */
function parseLeftHandSideExpression(parser, context) {
    // LeftHandSideExpression ::
    //   (NewExpression | MemberExpression) ...
    let expr = parseNewOrMemberExpression(parser, context);
    while (true) {
        switch (parser.token) {
            case 33554448 /* LeftBracket */:
                {
                    expect(parser, context, 33554448 /* LeftBracket */);
                    const property = parseExpression(parser, context);
                    expect(parser, context, 33554449 /* RightBracket */);
                    expr = {
                        type: 'MemberExpression',
                        object: expr,
                        computed: true,
                        property,
                    };
                    break;
                }
            case 33554442 /* Period */:
                {
                    expect(parser, context, 33554442 /* Period */);
                    const property = parseIdentifier(parser, context);
                    expr = {
                        type: 'MemberExpression',
                        object: expr,
                        computed: false,
                        property,
                    };
                    break;
                }
            case 33554440 /* LeftParen */:
                {
                    const args = parseArgumentList(parser, context);
                    if (parser.token === 33554439 /* Arrow */) {
                        parser.flags |= 16 /* SimpleParameterList */;
                        return args;
                    }
                    expr = {
                        type: 'CallExpression',
                        callee: expr,
                        arguments: args,
                    };
                    break;
                }
            case 67108869 /* TemplateSpan */:
                break;
            case 67108870 /* TemplateTail */:
                break;
            default:
                return expr;
        }
    }
}
/**
 * Parse new or member expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NewExpression)
 * @see [Link](https://tc39.github.io/ecma262/#prod-NewExpression)
 * @see [Link](https://tc39.github.io/ecma262/#prod-MemberExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseNewOrMemberExpression(parser, context) {
    if (parser.token === 8279 /* NewKeyword */) {
        let result;
        const id = parseIdentifier(parser, context);
        if (parser.token === 8281 /* SuperKeyword */) {
            result = parseSuperProperty(parser, context);
        }
        else if (parser.token === 8278 /* ImportKeyword */ && lookahead(parser, context, nextTokenIsLeftParen)) {
            recordErrors(parser, context, 0 /* Unexpected */);
        }
        else if (consume(parser, context, 33554442 /* Period */)) {
            result = parseNewTargetExpression(parser, context, id);
            return parseMemberExpressionContinuation(parser, context, result);
        }
        else {
            result = parseNewOrMemberExpression(parser, context);
        }
        return {
            type: 'NewExpression',
            callee: result,
            arguments: parser.token === 33554440 /* LeftParen */ ? parseArgumentList(parser, context) : [],
        };
    }
    return parseMemberExpression(parser, context);
}
function parseNewTargetExpression(parser, context, id) {
    if ((context & 33554432 /* NewTarget */) === 33554432 /* NewTarget */ && parser.tokenValue === 'target') {
        return parseMetaProperty(parser, context, id);
    }
    recordErrors(parser, context, 28 /* UnexpectedNewTarget */);
}
/**
 * Parse Import() expressions. (Stage 3 proposal)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location
 */
function parseImportExpressions(parser, context) {
    const id = parseIdentifier(parser, context);
    // Import.meta - Stage 3 proposal
    if (consume(parser, context, 33554442 /* Period */)) {
        if (!(context & 65536 /* Module */) || parser.tokenValue !== 'meta') {
            recordErrors(parser, context, 0 /* Unexpected */);
        }
        return parseMetaProperty(parser, context, id);
    }
    let expr = parseImportCall();
    expect(parser, context, 33554440 /* LeftParen */);
    const args = parseAssignmentExpression(parser, context);
    expect(parser, context, 33554445 /* RightParen */);
    expr = {
        type: 'CallExpression',
        callee: expr,
        arguments: [args],
    };
    return expr;
}
/**
 * Parse Import() expression. (Stage 3 proposal)
 *
 */
function parseImportCall() {
    return {
        type: 'Import',
    };
}
/**
 * Parse member expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-MemberExpression)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location info
 * @param expr Expression
 */
function parseMemberExpression(parser, context) {
    let result;
    if (parser.token === 8281 /* SuperKeyword */) {
        result = parseSuperProperty(parser, context);
    }
    else if (parser.token === 8278 /* ImportKeyword */) {
        result = parseImportExpressions(parser, context);
    }
    else {
        result = parsePrimaryExpression(parser, context);
    }
    return parseMemberExpressionContinuation(parser, context, result);
}
/**
 * Parse member expression continuation
 *
 * @param parser Parser object
 * @param context Context masks
 * @param pos Location info
 * @param expr Expression
 */
function parseMemberExpressionContinuation(parser, context, expr) {
    while (true) {
        switch (parser.token) {
            case 33554448 /* LeftBracket */:
                {
                    expect(parser, context, 33554448 /* LeftBracket */);
                    const property = parseExpression(parser, context);
                    expect(parser, context, 33554449 /* RightBracket */);
                    expr = {
                        type: 'MemberExpression',
                        object: expr,
                        computed: true,
                        property,
                    };
                    break;
                }
            case 33554442 /* Period */:
                {
                    expect(parser, context, 33554442 /* Period */);
                    const property = parseIdentifier(parser, context);
                    expr = {
                        type: 'MemberExpression',
                        object: expr,
                        computed: false,
                        property,
                    };
                    break;
                }
            case 67108869 /* TemplateSpan */:
                break;
            case 67108870 /* TemplateTail */:
                break;
            case 65536 /* Invalid */:
            default:
                return expr;
        }
    }
}
/**
 * Parse super property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SuperProperty)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseSuperProperty(parser, context) {
    // SuperProperty[Yield, Await]:
    //  super[Expression[+In, ?Yield, ?Await]]
    //  super.IdentifierName
    expect(parser, context, 8281 /* SuperKeyword */);
    switch (parser.token) {
        case 33554440 /* LeftParen */:
            // The super property has to be within a class constructor
            if (!(context & 536870912 /* AllowSuperProperty */))
                recordErrors(parser, context, 0 /* Unexpected */);
            break;
        case 33554448 /* LeftBracket */:
        case 33554442 /* Period */:
            if (!(context & 4194304 /* Method */))
                recordErrors(parser, context, 0 /* Unexpected */);
            break;
        default:
            recordErrors(parser, context, 0 /* Unexpected */);
    }
    return {
        type: 'Super',
    };
}
/**
 * Parse meta property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementList)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param meta Identifier
 * @param pos Location
 */
function parseMetaProperty(parser, context, meta) {
    return {
        meta,
        type: 'MetaProperty',
        property: parseIdentifier(parser, context),
    };
}
/**
 * Parse argument list
 *
 * @see [https://tc39.github.io/ecma262/#prod-ArgumentList)
 *
 * @param Parser Parser object
 * @param Context Context masks
 */
function parseArgumentList(parser, context) {
    // ArgumentList :
    //   AssignmentOrSpreadExpression
    //   ArgumentList , AssignmentOrSpreadExpression
    //
    // AssignmentOrSpreadExpression :
    //   ... AssignmentExpression
    //   AssignmentExpression
    expect(parser, context, 33554440 /* LeftParen */);
    const expressions = [];
    while (parser.token !== 33554445 /* RightParen */) {
        if (parser.token === 33554443 /* Ellipsis */) {
            expressions.push(parseSpreadElement(parser, context));
        }
        else {
            expressions.push(parseAssignmentExpression(parser, context));
        }
        if (parser.token !== 33554445 /* RightParen */)
            expect(parser, context, 33554447 /* Comma */);
    }
    expect(parser, context, 33554445 /* RightParen */);
    return expressions;
}
function parsePrimaryExpression(parser, context) {
    switch (parser.token) {
        case 16453 /* LetKeyword */:
        case 16491 /* YieldKeyword */:
        case 4206 /* AwaitKeyword */:
        case 8388704 /* Arguments */:
        case 8388705 /* Eval */:
        case 8388608 /* Identifier */:
            return parseIdentifier(parser, context);
        case 4194304 /* StringLiteral */:
            return parseLiteral(parser, context);
        case 2097275 /* BigInt */:
            return parseBigIntLiteral(parser, context);
        case 2097152 /* NumericLiteral */:
            return parseLiteral(parser, context);
        case 8193 /* FalseKeyword */:
        case 8194 /* TrueKeyword */:
        case 8195 /* NullKeyword */:
            return parseNullOrTrueOrFalseLiteral(parser, context);
        case 8283 /* ThisKeyword */:
            return parseThisExpression(parser, context);
        case 8276 /* FunctionKeyword */:
            return parseFunctionExpression(parser, context & ~524288 /* Async */);
        case 4205 /* AsyncKeyword */:
            return parseAsyncFunctionExpressionOrAsyncIdentifier(parser, context);
        case 33554441 /* LeftBrace */:
            return parseObjectLiteral(parser, context);
        case 8266 /* ClassKeyword */:
            return parseClassExpression(parser, context);
        case 33554440 /* LeftParen */:
            return parseParenthesizedExpression(parser, context);
        case 33554448 /* LeftBracket */:
            return parseArrayLiteral(parser, context);
        default:
            recordErrors(parser, context, 1 /* UnexpectedToken */, tokenDesc(nextToken(parser, context)));
    }
}
/**
 * Parses either null or boolean literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BooleanLiteral)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseNullOrTrueOrFalseLiteral(parser, context) {
    const { token } = parser;
    const raw = tokenDesc(token);
    parser.flags &= ~4 /* Assignable */;
    nextToken(parser, context);
    return {
        type: 'Literal',
        value: token === 8195 /* NullKeyword */ ? null : raw === 'true',
    };
    // if (context & Context.OptionsRaw) node.raw = raw;
}
function parseIdentifier(parser, context) {
    const { tokenValue } = parser;
    nextToken(parser, context);
    return {
        type: 'Identifier',
        name: tokenValue
    };
}
/**
 * Parses string and number literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NumericLiteral)
 * @see [Link](https://tc39.github.io/ecma262/#prod-StringLiteral)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseLiteral(parser, context) {
    const { tokenValue } = parser;
    parser.flags &= ~4 /* Assignable */;
    nextToken(parser, context);
    return {
        type: 'Literal',
        value: tokenValue
    };
}
/**
 * Parses BigInt literal (stage 3 proposal)
 *
 * @see [Link](https://tc39.github.io/proposal-bigint/)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseBigIntLiteral(parser, context) {
    const { tokenValue, tokenRaw } = parser;
    parser.flags &= ~4 /* Assignable */;
    nextToken(parser, context);
    return {
        type: 'Literal',
        value: tokenValue,
        bigint: tokenRaw,
    };
}
/**
 * Parse this expression
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseThisExpression(parser, context) {
    nextToken(parser, context);
    parser.flags &= ~4 /* Assignable */;
    return {
        type: 'ThisExpression',
    };
}
/**
 * Parse arrow function
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrowFunction)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseArrowFunction(parser, context, state, params) {
    expect(parser, context, 33554439 /* Arrow */);
    context = swapContext(context, state);
    for (const i in params)
        reinterpret(parser, context, params[i]);
    let body;
    const expression = parser.token !== 33554441 /* LeftBrace */;
    if (!expression) {
        body = parseFunctionBody(parser, context | 262144 /* InFunctionBody */);
    }
    else {
        body = parseAssignmentExpression(parser, context);
    }
    return {
        type: 'ArrowFunctionExpression',
        body,
        params,
        id: null,
        async: !!(state & 8 /* Async */),
        generator: false,
        expression,
    };
}
/**
 * Parses cover parenthesized expression and arrow parameter list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-parseCoverParenthesizedExpressionAndArrowParameterList)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseParenthesizedExpression(parser, context) {
    expect(parser, context, 33554440 /* LeftParen */);
    if (consume(parser, context, 33554445 /* RightParen */)) {
        if (parser.token === 33554439 /* Arrow */) {
            return [];
        }
    }
    const expr = parseExpression(parser, context);
    expect(parser, context, 33554445 /* RightParen */);
    if (parser.token === 33554439 /* Arrow */) {
        return expr.type === 'SequenceExpression' ? expr.expressions : [expr];
    }
    return expr;
}
/**
 * Parse array literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ArrayLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseArrayLiteral(parser, context) {
    // ArrayLiteral :
    //   [ Elisionopt ]
    //   [ ElementList ]
    //   [ ElementList , Elisionopt ]
    //
    // ElementList :
    //   Elisionopt AssignmentExpression
    //   Elisionopt ... AssignmentExpression
    //   ElementList , Elisionopt AssignmentExpression
    //   ElementList , Elisionopt SpreadElement
    //
    // Elision :
    //   ,
    //   Elision ,
    //
    // SpreadElement :
    //   ... AssignmentExpression
    //
    //
    expect(parser, context, 33554448 /* LeftBracket */);
    context = setContext(context, 1048576 /* DisallowIn */ | 268435456 /* Asi */);
    const elements = [];
    while (parser.token !== 33554449 /* RightBracket */) {
        if (consume(parser, context, 33554447 /* Comma */)) {
            elements.push(null);
        }
        else if (parser.token === 33554443 /* Ellipsis */) {
            elements.push(parseSpreadElement(parser, context));
            if (parser.token !== 33554449 /* RightBracket */) {
                expect(parser, context, 33554447 /* Comma */);
            }
        }
        else {
            elements.push(parseAssignmentExpression(parser, context));
            if (parser.token !== 33554449 /* RightBracket */)
                expect(parser, context, 33554447 /* Comma */);
        }
    }
    expect(parser, context, 33554449 /* RightBracket */);
    return {
        type: 'ArrayExpression',
        elements,
    };
}
/**
 * Parse spread element
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SpreadElement)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseSpreadElement(parser, context) {
    expect(parser, context, 33554443 /* Ellipsis */);
    const argument = parseAssignmentExpression(parser, context);
    return {
        type: 'SpreadElement',
        argument,
    };
}
/**
 * Parses function expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionExpression)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseFunctionExpression(parser, context, state = 0 /* None */) {
    expect(parser, context, 8276 /* FunctionKeyword */);
    if (consume(parser, context, 301992496 /* Multiply */))
        state |= 1 /* Generator */;
    let id = null;
    if (parser.token & 8417280 /* Keyword */) {
        id = parseBindingIdentifier(parser, context);
    }
    context = swapContext(context, state);
    const { params, body } = parseFormalListAndBody(parser, context);
    return {
        type: 'FunctionExpression',
        body,
        params,
        async: !!(state & 8 /* Async */),
        generator: !!(state & 1 /* Generator */),
        expression: false,
        id
    };
}
/**
 * Parses formal parameters and function body.
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionBody)
 * @see [Link](https://tc39.github.io/ecma262/#prod-FormalParameters)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseFormalListAndBody(parser, context) {
    const params = parseFormalParameters(parser, context);
    const body = parseFunctionBody(parser, context | 262144 /* InFunctionBody */);
    return {
        params,
        body
    };
}
/**
 * Parse formal parameters
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FormalParameters)
 *
 * @param Parser object
 * @param Context masks
 * @param Optional objectstate. Default to none
 */
function parseFormalParameters(parser, context) {
    context = context | 2097152 /* InParameter */;
    parser.flags = swapFlags(parser.flags, 16 /* SimpleParameterList */);
    expect(parser, context, 33554440 /* LeftParen */);
    const args = [];
    parseDelimitedBindingList(parser, context, 1 /* Args */, 2 /* FunctionArgs */, args);
    expect(parser, context, 33554445 /* RightParen */);
    return args;
}
/**
 * Parse funciton body
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-FunctionBody)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseFunctionBody(parser, context) {
    const body = [];
    expect(parser, context, 33554441 /* LeftBrace */);
    if (parser.token !== 33685516 /* RightBrace */) {
        // Note: A separate "while" loop is used to avoid unseting the
        // mutual flags within the iteration loop itself.
        while (parser.token === 4194304 /* StringLiteral */) {
            const { tokenRaw, tokenValue } = parser;
            body.push(parseDirective(parser, context));
            if (tokenRaw.length === /* length of prologue*/ 12 && tokenValue === 'use strict') {
                if (parser.flags & 16 /* SimpleParameterList */) {
                    recordErrors(parser, context, 31 /* IllegalUseStrict */);
                }
                else if (parser.flags & 128 /* StrictReserved */) {
                    recordErrors(parser, context, 33 /* UnexpectedStrictReserved */);
                }
                else if (parser.flags & 64 /* StrictEvalArguments */) {
                    recordErrors(parser, context, 32 /* StrictEvalArguments */);
                }
                context |= 32768 /* Strict */;
            }
        }
        parser.flags = swapFlags(parser.flags, 128 /* StrictReserved */ | 64 /* StrictEvalArguments */);
        const previousSwitchStatement = parser.switchStatement;
        const previousIterationStatement = parser.iterationStatement;
        if ((parser.switchStatement & 1 /* Iteration */) === 1 /* Iteration */) {
            parser.switchStatement = 2 /* CrossingBoundary */;
        }
        if ((parser.iterationStatement & 1 /* Iteration */) === 1 /* Iteration */) {
            parser.iterationStatement = 2 /* CrossingBoundary */;
        }
        addCrossingBoundary(parser);
        while (parser.token !== 33685516 /* RightBrace */) {
            body.push(parseStatementListItem(parser, context));
        }
        parser.labelDepth--;
        parser.switchStatement = previousSwitchStatement;
        parser.iterationStatement = previousIterationStatement;
    }
    expect(parser, context, 33685516 /* RightBrace */);
    return {
        type: 'BlockStatement',
        body,
    };
}
/**
 * Parse property name
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-PropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parsePropertyName(parser, context) {
    switch (parser.token) {
        case 2097152 /* NumericLiteral */:
        case 4194304 /* StringLiteral */:
        //  return parseLiteral(parser, context);
        case 33554448 /* LeftBracket */:
            return parseComputedPropertyName(parser, context);
        default:
            return parseIdentifier(parser, context);
    }
}
/**
 * Parse computed property names
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ComputedPropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseComputedPropertyName(parser, context) {
    expect(parser, context, 33554448 /* LeftBracket */);
    const key = parseAssignmentExpression(parser, context);
    expect(parser, context, 33554449 /* RightBracket */);
    return key;
}
/**
 * Parses class declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseClassExpression(parser, context) {
    context = context | 32768 /* Strict */;
    expect(parser, context, 8266 /* ClassKeyword */);
    let id = null;
    if ((parser.token & 8388608 /* Identifier */) === 8388608 /* Identifier */ || parser.token & 8417280 /* Keyword */ && parser.token !== 8273 /* ExtendsKeyword */) {
        id = parseBindingIdentifier(parser, context);
    }
    let superClass = null;
    if (consume(parser, context, 8273 /* ExtendsKeyword */)) {
        superClass = parseLeftHandSideExpression(parser, context | 32768 /* Strict */);
    }
    const body = parseClassBodyAndElementList(parser, context);
    return {
        type: 'ClassExpression',
        id,
        superClass,
        body
    };
}
/**
 * Parse class body and element list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassBody)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassElementList)
 *
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseClassBodyAndElementList(parser, context) {
    context = setContext(context, 67108864 /* TaggedTemplate */);
    expect(parser, context, 33554441 /* LeftBrace */);
    const body = [];
    while (parser.token !== 33685516 /* RightBrace */) {
        if (consume(parser, context, 33685518 /* Semicolon */))
            continue;
        body.push(parseClassElement(parser, context));
    }
    expect(parser, context, 33685516 /* RightBrace */);
    return {
        type: 'ClassBody',
        body,
    };
}
/**
 * Parse class element and class public instance fields & private instance fields
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassElement)
 * @see [Link](https://tc39.github.io/proposal-class-public-fields/)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseClassElement(parser, context) {
    let kind = 'method';
    let isStatic = false;
    let value;
    let state = 0 /* None */;
    if (consume(parser, context, 301992496 /* Multiply */))
        state = state | 1 /* Generator */;
    let token = parser.token;
    let key = parsePropertyName(parser, context);
    if (parser.tokenValue === 'constructor') {
        if (state & 1 /* Generator */) {
            recordErrors(parser, context, 29 /* InvalidConstructor */);
        }
        else if (state & 16 /* Heritage */)
            context |= 536870912 /* AllowSuperProperty */;
        state |= 32 /* Constructor */;
    }
    if (parser.token !== 33554440 /* LeftParen */) {
        if (token === 16490 /* StaticKeyword */) {
            isStatic = true;
            token = parser.token;
            if (parser.tokenValue === 'prototype')
                recordErrors(parser, context, 30 /* StaticPrototype */);
            key = parsePropertyName(parser, context);
        }
        if (token === 4205 /* AsyncKeyword */ && !(parser.flags & 1 /* NewLine */)) {
            token = parser.token;
            state = state | 8 /* Async */;
            if (consume(parser, context, 301992496 /* Multiply */))
                state = state | 1 /* Generator */;
            token = parser.token;
            key = parsePropertyName(parser, context);
            if (parser.token === 33554440 /* LeftParen */) {
                value = parseMethod(parser, context, state);
            }
        }
        else if (token === 4208 /* GetKeyword */ || token === 4209 /* SetKeyword */) {
            kind = token === 4208 /* GetKeyword */ ? 'get' : 'set';
            if (consume(parser, context, 301992496 /* Multiply */))
                state = state | 1 /* Generator */;
            token = parser.token;
            key = parsePropertyName(parser, context);
        }
    }
    if (parser.token === 33554440 /* LeftParen */) {
        if (token !== 33554448 /* LeftBracket */ && state & 32 /* Constructor */) {
            if (parser.flags & 32 /* HasConstructor */) {
                recordErrors(parser, context, 0 /* Unexpected */);
            }
            else
                parser.flags |= 32 /* HasConstructor */;
        }
        value = parseMethod(parser, context, state);
    }
    return {
        type: 'MethodDefinition',
        kind,
        static: isStatic,
        computed: token === 33554448 /* LeftBracket */,
        key,
        value,
    };
}
/**
 * Parse method
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-GeneratorMethod)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncMethod)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncGeneratorMethod)
 * @see [Link](https://tc39.github.io/ecma262/#prod-PropertyName)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseMethod(parser, context, state) {
    context = swapContext(context, state);
    const { params, body } = parseFormalListAndBody(parser, context);
    return {
        type: 'FunctionExpression',
        params,
        body,
        async: !!(state & 8 /* Async */),
        generator: !!(state & 1 /* Generator */),
        expression: false,
        id: null,
    };
}
/**
 * Parses object literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ObjectLiteral)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseObjectLiteral(parser, context) {
    expect(parser, context, 33554441 /* LeftBrace */);
    const properties = [];
    context = setContext(context, 1048576 /* DisallowIn */ | 268435456 /* Asi */);
    while (parser.token !== 33685516 /* RightBrace */) {
        properties.push(parser.token === 33554443 /* Ellipsis */ ?
            parseSpreadProperties(parser, context) :
            parsePropertyDefinition(parser, context));
        if (parser.token !== 33685516 /* RightBrace */)
            expect(parser, context, 33554447 /* Comma */);
    }
    expect(parser, context, 33685516 /* RightBrace */);
    return {
        type: 'ObjectExpression',
        properties,
    };
}
/**
 * Parse object spread properties
 *
 * @see [Link](https://tc39.github.io/proposal-object-rest-spread/#Spread)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseSpreadProperties(parser, context) {
    expect(parser, context, 33554443 /* Ellipsis */);
    const argument = parseAssignmentExpression(parser, context);
    return {
        type: 'SpreadElement',
        argument,
    };
}
/**
 * Parse property definition
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-PropertyDefinition)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parsePropertyDefinition(parser, context) {
    let value;
    let state = 64 /* Method */;
    if (consume(parser, context, 301992496 /* Multiply */))
        state = state | 1 /* Generator */;
    let token = parser.token;
    let key = parsePropertyName(parser, context);
    if (token === 4205 /* AsyncKeyword */ && !(parser.flags & 1 /* NewLine */)) {
        if (parser.token & (8388608 /* Identifier */ | 4194304 /* StringLiteral */ | 4096 /* Contextual */ | 2097152 /* NumericLiteral */) ||
            parser.token === 301992496 /* Multiply */ || parser.token === 33554448 /* LeftBracket */) {
            if (state & 1 /* Generator */)
                recordErrors(parser, context, 0 /* Unexpected */);
            state = state | 8 /* Async */;
            if (consume(parser, context, 301992496 /* Multiply */))
                state = state | 1 /* Generator */;
            token = parser.token;
            key = parsePropertyName(parser, context);
        }
    }
    if (token === 4208 /* GetKeyword */ || token === 4209 /* SetKeyword */) {
        if (parser.token & (8388608 /* Identifier */ | 4194304 /* StringLiteral */ | 4096 /* Contextual */ | 2097152 /* NumericLiteral */) ||
            parser.token === 301992496 /* Multiply */ || parser.token === 33554448 /* LeftBracket */) {
            if (state & 1 /* Generator */)
                recordErrors(parser, context, 0 /* Unexpected */);
            if (consume(parser, context, 301992496 /* Multiply */))
                state = state | 1 /* Generator */;
            state = state & ~64 /* Method */ | (token === 4208 /* GetKeyword */ ? 256 /* Getter */ : 512 /* Setter */);
            token = parser.token;
            key = parsePropertyName(parser, context);
        }
    }
    if (parser.token === 33554440 /* LeftParen */) {
        value = parseMethod(parser, context, state);
    }
    else {
        if (state & (1 /* Generator */ | 8 /* Async */)) {
            recordErrors(parser, context, 0 /* Unexpected */);
        }
        state = state & ~64 /* Method */;
        if (parser.token === 33554450 /* Colon */) {
            if (token !== 33554448 /* LeftBracket */ && parser.tokenValue === '__proto__') ;
            nextToken(parser, context);
            value = parseAssignmentExpression(parser, context);
        }
        else {
            state |= 128 /* Shorthand */;
            if (parser.token === 167772186 /* Assign */) {
                // TODO: 'CoverInitializedName'
                nextToken(parser, context);
                value = parseAssignmentPattern(parser, context, key);
            }
            else {
                value = key;
            }
        }
    }
    return {
        type: 'Property',
        key,
        value,
        computed: token === 33554448 /* LeftBracket */,
        method: (state & 64 /* Method */) === 64 /* Method */,
        shorthand: (state & 128 /* Shorthand */) === 128 /* Shorthand */,
        kind: !(state & 256 /* Getter */ | state & 512 /* Setter */) ?
            'init' :
            (state & 512 /* Setter */) ?
                'set' :
                'get',
    };
}
/**
 * Parses either async function declaration or async identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncFunctionDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncFunctionExpressionOrAsyncIdentifier(parser, context) {
    return lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, /* isLookaHead */ false) ?
        parseFunctionExpression(parser, context, 8 /* Async */) :
        parseIdentifier(parser, context);
}

/**
 * Parse statement list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementList)
 *
 * @param Parser instance
 * @param Context masks
 */
function parseStatementList(parser, context) {
    nextToken(parser, context);
    const statements = [];
    while (parser.token !== 131072 /* EndOfSource */) {
        if ((parser.token & 4194304 /* StringLiteral */) === 4194304 /* StringLiteral */) {
            if (!(context & 32768 /* Strict */) && parser.tokenRaw.length === 12 && parser.tokenValue === 'use strict') {
                context |= 32768 /* Strict */;
            }
            statements.push(parseDirective(parser, context));
        }
        else {
            statements.push(parseStatementListItem(parser, context));
        }
    }
    return statements;
}
/**
 * Parses statement list items
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementListItem)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseStatementListItem(parser, context) {
    switch (parser.token) {
        case 8276 /* FunctionKeyword */:
            return parseFunctionDeclaration(parser, context);
        case 8266 /* ClassKeyword */:
            return parseClassDeclaration(parser, context);
        case 8262 /* ConstKeyword */:
            return parseVariableStatement(parser, context, 8 /* Const */);
        case 16453 /* LetKeyword */:
            return parseLetOrExpressionStatement(parser, context);
        case 8282 /* SwitchKeyword */:
            return parseSwitchStatement(parser, context);
        case 4205 /* AsyncKeyword */:
            return parseAsyncFunctionDeclarationOrStatement(parser, context);
        default:
            return parseStatement(parser, context, 0 /* Allow */);
    }
}
/**
 * Parses statements
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseStatement(parser, context, label = 1 /* Disallow */) {
    switch (parser.token) {
        case 8260 /* VarKeyword */:
            return parseVariableStatement(parser, context, 2 /* Var */);
        case 8285 /* TryKeyword */:
            return parseTryStatement(parser, context);
        case 33685518 /* Semicolon */:
            return parseEmptyStatement(parser, context);
        case 8280 /* ReturnKeyword */:
            return parseReturnStatement(parser, context);
        case 33554441 /* LeftBrace */:
            return parseBlockStatement(parser, context);
        case 8268 /* DebuggerKeyword */:
            return parseDebuggerStatement(parser, context);
        case 8275 /* ForKeyword */:
            return parseForStatement(parser, context);
        case 8286 /* WhileKeyword */:
            return parseWhileStatement(parser, context);
        case 8270 /* DoKeyword */:
            return parseDoWhileStatement(parser, context);
        case 8277 /* IfKeyword */:
            return parseIfStatement(parser, context);
        case 8263 /* BreakKeyword */:
            return parseBreakStatement(parser, context);
        case 8267 /* ContinueKeyword */:
            return parseContinueStatement(parser, context);
        case 8287 /* WithKeyword */:
            return parseWithStatement(parser, context);
        case 8284 /* ThrowKeyword */:
            return parseThrowStatement(parser, context);
        case 4205 /* AsyncKeyword */:
            if (lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, /* isLookaHead */ false)) {
                if (context & 32 /* OptionsEditorMode */)
                    return parseFunctionDeclaration(parser, context, 8 /* Async */);
                recordErrors(parser, context, 20 /* AsyncFunctionInSingleStatementContext */);
            }
            return parseExpressionOrLabelledStatement(parser, context, label);
        case 8276 /* FunctionKeyword */:
            // A function declaration has to be parsed out for 'editor mode'
            if (context & 32 /* OptionsEditorMode */)
                return parseFunctionDeclaration(parser, context | 131072 /* RequireIdentifier */);
            recordErrors(parser, context, context & 32768 /* Strict */ ? 16 /* StrictFunction */ : 17 /* SloppyFunction */);
        case 8266 /* ClassKeyword */:
            recordErrors(parser, context, 0 /* Unexpected */);
        default:
            return parseExpressionOrLabelledStatement(parser, context, label);
    }
}
/**
 * Parses the debugger statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-DebuggerStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseDebuggerStatement(parser, context) {
    expect(parser, context, 8268 /* DebuggerKeyword */);
    consumeSemicolon(parser, context);
    return {
        type: 'DebuggerStatement'
    };
}
/**
 * Parses block statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BlockStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Block)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseBlockStatement(parser, context) {
    const body = [];
    expect(parser, context, 33554441 /* LeftBrace */);
    while (parser.token !== 33685516 /* RightBrace */) {
        body.push(parseStatementListItem(parser, context));
    }
    expect(parser, context, 33685516 /* RightBrace */);
    return {
        type: 'BlockStatement',
        body
    };
}
/**
 * Parses return statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ReturnStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseReturnStatement(parser, context) {
    if (!(context & (512 /* OptionsGlobalReturn */ | 262144 /* InFunctionBody */))) {
        recordErrors(parser, context, 27 /* IllegalReturn */);
    }
    expect(parser, context, 8280 /* ReturnKeyword */);
    const argument = (parser.token & 131072 /* ASI */) !== 131072 /* ASI */ && !(parser.flags & 1 /* NewLine */) ?
        parseExpression(parser, context & ~262144 /* InFunctionBody */) :
        null;
    consumeSemicolon(parser, context);
    return {
        type: 'ReturnStatement',
        argument
    };
}
/**
 * Parses empty statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-EmptyStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseEmptyStatement(parser, context) {
    nextToken(parser, context);
    return {
        type: 'EmptyStatement'
    };
}
/**
 * Parses try statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TryStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseTryStatement(parser, context) {
    expect(parser, context, 8285 /* TryKeyword */);
    const block = parseBlockStatement(parser, context);
    const handler = parser.token === 8265 /* CatchKeyword */ ? parseCatchBlock(parser, context) : null;
    const finalizer = consume(parser, context, 8274 /* FinallyKeyword */) ? parseBlockStatement(parser, context) : null;
    if (!handler && !finalizer)
        recordErrors(parser, context, 11 /* NoCatchOrFinally */);
    return {
        type: 'TryStatement',
        block,
        handler,
        finalizer
    };
}
/**
 * Parses catch block
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Catch)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseCatchBlock(parser, context) {
    expect(parser, context, 8265 /* CatchKeyword */);
    let param = null;
    if (consume(parser, context, 33554440 /* LeftParen */)) {
        if (parser.token === 33554445 /* RightParen */) {
            recordErrors(parser, context, 12 /* NoCatchClause */);
        }
        else {
            param = parseBindingIdentifierOrPattern(parser, context);
            if (parser.token === 167772186 /* Assign */)
                recordErrors(parser, context, 12 /* NoCatchClause */);
        }
        expect(parser, context, 33554445 /* RightParen */);
    }
    const body = parseBlockStatement(parser, context);
    return {
        type: 'CatchClause',
        param,
        body
    };
}
/**
 * Parses throw statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ThrowStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseThrowStatement(parser, context) {
    expect(parser, context, 8284 /* ThrowKeyword */);
    if (parser.flags & 1 /* NewLine */)
        recordErrors(parser, context, 26 /* NewlineAfterThrow */);
    const argument = parseExpression(parser, context);
    consumeSemicolon(parser, context);
    return {
        type: 'ThrowStatement',
        argument
    };
}
/**
 * Parses either expression or labelled statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-LabelledStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseExpressionOrLabelledStatement(parser, context, label) {
    const { tokenValue, token } = parser;
    const expr = parseExpression(parser, context);
    if (token & (8388608 /* Identifier */ | 8417280 /* Keyword */) && parser.token === 33554450 /* Colon */) {
        expect(parser, context, 33554450 /* Colon */);
        if (getLabel(parser, tokenValue, false, true)) {
            recordErrors(parser, context, 22 /* LabelRedeclaration */, tokenValue);
        }
        addLabel(parser, tokenValue);
        let body = null;
        if (parser.token === 8276 /* FunctionKeyword */ && !(context & 32768 /* Strict */) &&
            label === 0 /* Allow */) {
            body = parseFunctionDeclaration(parser, context);
        }
        else
            body = parseStatement(parser, context, 0 /* Allow */);
        parser.labelDepth--;
        return {
            type: 'LabeledStatement',
            label: expr,
            body
        };
    }
    consumeSemicolon(parser, context);
    return {
        type: 'ExpressionStatement',
        expression: expr
    };
}
/**
 * Parses either an lexical declaration (let) or an expression statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-let-and-const-declarations)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseLetOrExpressionStatement(parser, context) {
    return lookahead(parser, context, isLexical) ?
        parseVariableStatement(parser, context, 4 /* Let */) :
        parseExpressionOrLabelledStatement(parser, context, 1 /* Disallow */);
}
/**
 * Parses variable statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseVariableStatement(parser, context, type, origin = 32 /* Statement */) {
    const { token } = parser;
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, type, origin);
    consumeSemicolon(parser, context);
    return {
        type: 'VariableDeclaration',
        kind: tokenDesc(token),
        declarations
    };
}
/**
 * Parses either For, ForIn or ForOf statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-statement)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseForStatement(parser, context) {
    expect(parser, context, 8275 /* ForKeyword */);
    const forAwait = context & 524288 /* Async */ && consume(parser, context, 4206 /* AwaitKeyword */);
    expect(parser, context, 33554440 /* LeftParen */);
    let init = null;
    let declarations = null;
    let type = 'ForStatement';
    let test = null;
    let update = null;
    let right;
    let bindingType = 0 /* Empty */;
    if (parser.token !== 33685518 /* Semicolon */) {
        const token = parser.token;
        if (token === 8260 /* VarKeyword */) {
            bindingType = 2 /* Var */;
        }
        else if (token === 8262 /* ConstKeyword */) {
            bindingType = 8 /* Const */;
        }
        else if (token === 16453 /* LetKeyword */ && lookahead(parser, context, isLexical)) {
            bindingType = 4 /* Let */;
        }
        else
            init = parseAssignmentExpression(parser, context | 1048576 /* DisallowIn */);
        if (bindingType & 14 /* Variable */) {
            nextToken(parser, context);
            declarations = parseVariableDeclarationList(parser, context | 1048576 /* DisallowIn */, bindingType, 1 /* ForStatement */);
            init = {
                type: 'VariableDeclaration',
                kind: tokenDesc(token),
                declarations
            };
        }
    }
    if (forAwait ? expect(parser, context, 4211 /* OfKeyword */) : consume(parser, context, 4211 /* OfKeyword */)) {
        type = 'ForOfStatement';
        if (init)
            reinterpret(parser, context, init);
        else
            init = declarations;
        right = parseExpression(parser, context);
    }
    else if (consume(parser, context, 301999918 /* InKeyword */)) {
        type = 'ForInStatement';
        if (init)
            reinterpret(parser, context, init);
        else
            init = declarations;
        right = parseAssignmentExpression(parser, context);
    }
    else {
        if (parser.token === 33554447 /* Comma */)
            init = parseSequenceExpression(parser, context, init);
        expect(parser, context, 33685518 /* Semicolon */, 15 /* InvalidLhsInFor */);
        if (parser.token !== 33685518 /* Semicolon */) {
            test = parseExpression(parser, context);
        }
        expect(parser, context, 33685518 /* Semicolon */);
        if (parser.token !== 33554445 /* RightParen */)
            update = parseExpression(parser, context);
    }
    expect(parser, context, 33554445 /* RightParen */);
    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = 1 /* Iteration */;
    const body = parseStatement(parser, context, 1 /* Disallow */);
    parser.iterationStatement = previousIterationStatement;
    return type === 'ForOfStatement' ? {
        type,
        body,
        left: init,
        right,
        await: forAwait
    } :
        right ? {
            type: type,
            body,
            left: init,
            right
        } : {
            type: type,
            body,
            init,
            test,
            update
        };
}
/**
 * Parses switch statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SwitchStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseSwitchStatement(parser, context) {
    expect(parser, context, 8282 /* SwitchKeyword */);
    expect(parser, context, 33554440 /* LeftParen */);
    const discriminant = parseExpression(parser, context);
    context = setContext(context, 67108864 /* TaggedTemplate */);
    expect(parser, context, 33554445 /* RightParen */);
    expect(parser, context, 33554441 /* LeftBrace */);
    const cases = [];
    let seenDefault = false;
    const previousSwitchStatement = parser.switchStatement;
    parser.switchStatement = 1 /* Iteration */;
    while (parser.token !== 33685516 /* RightBrace */) {
        let test = null;
        if (consume(parser, context, 8264 /* CaseKeyword */)) {
            test = parseExpression(parser, context);
        }
        else {
            expect(parser, context, 8269 /* DefaultKeyword */);
            if (seenDefault)
                recordErrors(parser, context, 0 /* Unexpected */);
            seenDefault = true;
        }
        cases.push(parseCaseOrDefaultClauses(parser, context, test));
    }
    parser.switchStatement = previousSwitchStatement;
    expect(parser, context, 33685516 /* RightBrace */);
    return {
        type: 'SwitchStatement',
        discriminant,
        cases
    };
}
/**
 * Parses either default clause or case clauses
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-CaseClauses)
 * @see [Link](https://tc39.github.io/ecma262/#prod-DefaultClause)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseCaseOrDefaultClauses(parser, context, test) {
    expect(parser, context, 33554450 /* Colon */);
    const consequent = [];
    while (parser.token !== 8264 /* CaseKeyword */ && parser.token !== 33685516 /* RightBrace */ && parser.tokenValue !== 'default') {
        consequent.push(parseStatementListItem(parser, context));
    }
    return {
        type: 'SwitchCase',
        test,
        consequent
    };
}
/**
 * Parses the if statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-if-statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseIfStatement(parser, context) {
    expect(parser, context, 8277 /* IfKeyword */);
    expect(parser, context, 33554440 /* LeftParen */);
    const test = parseExpression(parser, context);
    expect(parser, context, 33554445 /* RightParen */);
    const consequent = parseConsequentOrAlternate(parser, context);
    const alternate = consume(parser, context, 8271 /* ElseKeyword */) ? parseConsequentOrAlternate(parser, context) : null;
    return {
        type: 'IfStatement',
        test,
        consequent,
        alternate
    };
}
/**
 * Parse either consequent or alternate. Supports AnnexB.
 * @param parser  Parser object
 * @param context Context masks
 */
function parseConsequentOrAlternate(parser, context) {
    return context & 32768 /* Strict */ || parser.token !== 8276 /* FunctionKeyword */ ?
        parseStatement(parser, context) :
        parseFunctionDeclaration(parser, context);
}
/**
 * Parses do while statement
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseDoWhileStatement(parser, context) {
    expect(parser, context, 8270 /* DoKeyword */);
    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = 1 /* Iteration */;
    const body = parseStatement(parser, context, 1 /* Disallow */);
    parser.iterationStatement = previousIterationStatement;
    expect(parser, context, 8286 /* WhileKeyword */);
    expect(parser, context, 33554440 /* LeftParen */);
    const test = parseExpression(parser, context);
    expect(parser, context, 33554445 /* RightParen */);
    consume(parser, context, 33685518 /* Semicolon */);
    return {
        type: 'DoWhileStatement',
        body,
        test
    };
}
/**
 * Parses while statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-grammar-notation-WhileStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseWhileStatement(parser, context) {
    expect(parser, context, 8286 /* WhileKeyword */);
    expect(parser, context, 33554440 /* LeftParen */);
    const test = parseExpression(parser, context);
    expect(parser, context, 33554445 /* RightParen */);
    const previousIterationStatement = parser.iterationStatement;
    parser.iterationStatement = 1 /* Iteration */;
    const body = parseStatement(parser, context, 1 /* Disallow */);
    parser.iterationStatement = previousIterationStatement;
    return {
        type: 'WhileStatement',
        test,
        body
    };
}
/**
 * Parses the continue statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ContinueStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseContinueStatement(parser, context) {
    expect(parser, context, 8267 /* ContinueKeyword */);
    let label = null;
    if (!(parser.flags & 1 /* NewLine */) && parser.token & (8388608 /* Identifier */ | 8417280 /* Keyword */)) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context);
        validateContinueLabel(parser, context, tokenValue);
    }
    consumeSemicolon(parser, context);
    if (label === null && (parser.iterationStatement & 0 /* Empty */) !== 0 /* Empty */) {
        recordErrors(parser, context, 24 /* IllegalContinue */);
    }
    return {
        type: 'ContinueStatement',
        label
    };
}
/**
 * Parses the break statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BreakStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseBreakStatement(parser, context) {
    expect(parser, context, 8263 /* BreakKeyword */);
    let label = null;
    if (!(parser.flags & 1 /* NewLine */) && parser.token & (8388608 /* Identifier */ | 8417280 /* Keyword */)) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context);
        validateBreakStatement(parser, context, tokenValue);
    }
    else if ((parser.iterationStatement & 0 /* Empty */) !== 0 /* Empty */ &&
        (parser.switchStatement & 0 /* Empty */) !== 0 /* Empty */) {
        recordErrors(parser, context, 25 /* IllegalBreak */);
    }
    consumeSemicolon(parser, context);
    return {
        type: 'BreakStatement',
        label
    };
}
/**
 * Parses with statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-WithStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseWithStatement(parser, context) {
    if (context & 32768 /* Strict */)
        recordErrors(parser, context, 19 /* StrictModeWith */);
    expect(parser, context, 8287 /* WithKeyword */);
    expect(parser, context, 33554440 /* LeftParen */);
    const object = parseExpression(parser, context);
    expect(parser, context, 33554445 /* RightParen */);
    const body = parseStatement(parser, context);
    return {
        type: 'WithStatement',
        object,
        body
    };
}
/**
 * Parses either async function declaration or statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncFunctionDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncFunctionDeclarationOrStatement(parser, context) {
    return lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, /* isLookaHead */ false) ?
        parseFunctionDeclaration(parser, context, 8 /* Async */) :
        parseStatement(parser, context);
}
/**
 * Parse directive
 *
 * * @see [Link](https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseDirective(parser, context) {
    const directive = parser.tokenRaw.slice(1, -1);
    const expr = parseExpression(parser, context);
    consumeSemicolon(parser, context);
    return {
        type: 'ExpressionStatement',
        expression: expr,
        directive
    };
}

function parseModuleItemList(parser, context) {
    // Prime the scanner
    nextToken(parser, context);
    const statements = [];
    while (parser.token !== 131072 /* EndOfSource */) {
        statements.push((parser.token & 4194304 /* StringLiteral */) === 4194304 /* StringLiteral */ ?
            parseDirective(parser, context) :
            parseModuleItem(parser, context));
    }
    return statements;
}
/**
 * Parse module item
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleItem)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseModuleItem(parser, context) {
    switch (parser.token) {
        // @decorator
        case 8388706 /* At */:
        //  return parseDecorators(parser, context);
        // ExportDeclaration
        case 8272 /* ExportKeyword */:
            return parseExportDeclaration(parser, context);
        // ImportDeclaration
        case 8278 /* ImportKeyword */:
            // 'Dynamic Import' or meta property disallowed here
            if (!(context & 8 /* OptionsNext */ && lookahead(parser, context, nextTokenIsLeftParenOrPeriod))) {
                return parseImportDeclaration(parser, context);
            }
        // falls through
        default:
            return parseStatementListItem(parser, context);
    }
}
/**
 * Parse export declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseExportDeclaration(parser, context) {
    // ExportDeclaration:
    // export * FromClause;
    // export ExportClause FromClause;
    // export VariableStatement
    // export Declaration
    // export HoistableDeclaration
    // export ClassDeclaration
    // export AssignmentExpression
    const specifiers = [];
    let source = null;
    let declaration = null;
    expect(parser, context, 8272 /* ExportKeyword */);
    switch (parser.token) {
        case 301992496 /* Multiply */:
            // export * from 'foo';
            return parseExportAllDeclaration(parser, context);
        case 8269 /* DefaultKeyword */:
            return parseExportDefault(parser, context);
        case 33554441 /* LeftBrace */:
            {
                // export {}
                // export {} from 'foo'
                expect(parser, context, 33554441 /* LeftBrace */);
                let hasReservedWord = false;
                while (parser.token !== 33685516 /* RightBrace */) {
                    if (parser.token & 8192 /* Reserved */) {
                        hasReservedWord = true;
                    }
                    specifiers.push(parseNamedExportDeclaration(parser, context));
                    if (parser.token !== 33685516 /* RightBrace */)
                        expect(parser, context, 33554447 /* Comma */);
                }
                expect(parser, context, 33685516 /* RightBrace */);
                if (parser.token === 4210 /* FromKeyword */) {
                    source = parseModuleSpecifier(parser, context);
                    //  The left hand side can't be a keyword where there is no
                    // 'from' keyword since it references a local binding.
                }
                else if (hasReservedWord)
                    recordErrors(parser, context, 37 /* UnexpectedReserved */);
                consumeSemicolon(parser, context);
                break;
            }
        case 8266 /* ClassKeyword */:
            // export class foo {}
            declaration = (parseClassDeclaration(parser, context));
            break;
        case 16453 /* LetKeyword */:
            // export let z = 0;
            // export let x
            declaration = parseVariableStatement(parser, context, 4 /* Let */, 8 /* Export */);
            break;
        case 8262 /* ConstKeyword */:
            // export const z = 0;
            // export const x
            declaration = parseVariableStatement(parser, context, 8 /* Const */, 8 /* Export */);
            break;
        case 8260 /* VarKeyword */:
            // export var ariya = 123;
            // export var a, b, c;
            declaration = parseVariableStatement(parser, context, 2 /* Var */, 8 /* Export */);
            break;
        // export HoistableDeclaration
        case 8276 /* FunctionKeyword */:
            // export function foo () {}
            // export function () {}
            // export function *foo() {}
            // export function *() {}
            declaration = parseFunctionDeclaration(parser, context);
            break;
        case 4205 /* AsyncKeyword */:
            // export async function *foo () {}
            // export async function foo () {}
            // export async function *() {}
            // export async function f(){}
            // export async function(){}
            // export async () => y
            // export async (x) => y
            // export async x => y
            if (lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, false)) {
                declaration = parseFunctionDeclaration(parser, context, 8 /* Async */);
                break;
            }
        // Falls through
        default:
            recordErrors(parser, context, 1 /* UnexpectedToken */, tokenDesc(parser.token));
    }
    return {
        type: 'ExportNamedDeclaration',
        source,
        specifiers,
        declaration,
    };
}
/**
 * Parse export all declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseExportAllDeclaration(parser, context) {
    expect(parser, context, 301992496 /* Multiply */);
    const source = parseModuleSpecifier(parser, context);
    consumeSemicolon(parser, context);
    return {
        type: 'ExportAllDeclaration',
        source,
    };
}
/**
 * Parse named export declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseNamedExportDeclaration(parser, context) {
    // ExportSpecifier :
    // IdentifierName
    // IdentifierName as IdentifierName
    const local = parseIdentifierName(parser, context, parser.token);
    const exported = consume(parser, context, 4204 /* AsKeyword */) ?
        parseIdentifierName(parser, context, parser.token) :
        local;
    return {
        type: 'ExportSpecifier',
        local,
        exported,
    };
}
/**
 * Parse export default
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-HoistableDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-HoistableDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param pos Location
 */
function parseExportDefault(parser, context) {
    expect(parser, context, 8269 /* DefaultKeyword */);
    let declaration;
    switch (parser.token) {
        // export default HoistableDeclaration[Default]
        case 8276 /* FunctionKeyword */:
            declaration = parseFunctionDeclaration(parser, context | 131072 /* RequireIdentifier */);
            break;
        // export default ClassDeclaration[Default]
        // export default  @decl ClassDeclaration[Default]
        case 8388706 /* At */:
        case 8266 /* ClassKeyword */:
            declaration = parseClassDeclaration(parser, context | 131072 /* RequireIdentifier */);
            break;
        // export default HoistableDeclaration[Default]
        case 4205 /* AsyncKeyword */:
            declaration = parseAsyncFunctionOrAssignmentExpression(parser, context | 131072 /* RequireIdentifier */);
            break;
        default:
            // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
            declaration = parseAssignmentExpression(parser, context);
            consumeSemicolon(parser, context);
    }
    return {
        type: 'ExportDefaultDeclaration',
        declaration,
    };
}
/**
 * Parse import declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseImportDeclaration(parser, context) {
    expect(parser, context, 8278 /* ImportKeyword */);
    let source;
    const specifiers = [];
    // 'import' ModuleSpecifier ';'
    if ((parser.token & 8388608 /* Identifier */) === 8388608 /* Identifier */) {
        specifiers.push(parseImportDefaultSpecifier(parser, context));
        if (consume(parser, context, 33554447 /* Comma */)) {
            if (parser.token === 301992496 /* Multiply */) {
                parseNameSpaceImport(parser, context, specifiers);
            }
            else if (parser.token === 33554441 /* LeftBrace */) {
                parseNamedImports(parser, context, specifiers);
            }
            else
                recordErrors(parser, context, 1 /* UnexpectedToken */, tokenDesc(parser.token));
        }
        source = parseModuleSpecifier(parser, context);
        // 'import' ModuleSpecifier ';'
    }
    else if ((parser.token & 4194304 /* StringLiteral */) === 4194304 /* StringLiteral */) {
        source = parseLiteral(parser, context);
    }
    else {
        if (parser.token === 301992496 /* Multiply */) {
            parseNameSpaceImport(parser, context, specifiers);
        }
        else if (parser.token === 33554441 /* LeftBrace */) {
            parseNamedImports(parser, context, specifiers);
        }
        else
            recordErrors(parser, context, 1 /* UnexpectedToken */, tokenDesc(parser.token));
        source = parseModuleSpecifier(parser, context);
    }
    consumeSemicolon(parser, context);
    return {
        type: 'ImportDeclaration',
        specifiers,
        source,
    };
}
/**
 * Parse named imports
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NamedImports)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseNamedImports(parser, context, specifiers) {
    expect(parser, context, 33554441 /* LeftBrace */);
    while (parser.token !== 33685516 /* RightBrace */) {
        specifiers.push(parseImportSpecifier(parser, context));
        if (parser.token !== 33685516 /* RightBrace */)
            expect(parser, context, 33554447 /* Comma */);
    }
    expect(parser, context, 33685516 /* RightBrace */);
}
/**
 * Parse import specifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportSpecifier)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseImportSpecifier(parser, context) {
    const { token } = parser;
    const imported = parseIdentifierName(parser, context, parser.token);
    let local;
    if (consume(parser, context, 4204 /* AsKeyword */)) {
        local = parseBindingIdentifier(parser, context);
    }
    else {
        // An import name that is a keyword is a syntax error if it is not followed
        // by the keyword 'as'.
        if ((token & 8192 /* Reserved */) === 8192 /* Reserved */)
            recordErrors(parser, context, 0 /* Unexpected */);
        local = imported;
    }
    return {
        type: 'ImportSpecifier',
        local,
        imported,
    };
}
/**
 * Parse binding identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NameSpaceImport)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseNameSpaceImport(parser, context, specifiers) {
    // NameSpaceImport:
    //  * as ImportedBinding
    expect(parser, context, 301992496 /* Multiply */);
    expect(parser, context, 4204 /* AsKeyword */, 35 /* AsAfterImportStart */);
    const local = parseBindingIdentifier(parser, context);
    specifiers.push({
        type: 'ImportNamespaceSpecifier',
        local,
    });
}
/**
 * Parse module specifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleSpecifier)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseModuleSpecifier(parser, context) {
    // ModuleSpecifier :
    //   StringLiteral
    expect(parser, context, 4210 /* FromKeyword */);
    if ((parser.token & 4194304 /* StringLiteral */) !== 4194304 /* StringLiteral */) {
        recordErrors(parser, context, 1 /* UnexpectedToken */, tokenDesc(parser.token));
    }
    return parseLiteral(parser, context);
}
/**
 * Parse import default specifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseImportDefaultSpecifier(parser, context) {
    return {
        type: 'ImportDefaultSpecifier',
        local: parseIdentifier(parser, context),
    };
}
/**
 * Parses either async function or assignment expression
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AssignmentExpression)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncFunctionDeclaration)
 * @see [Link](https://tc39.github.io/ecma262/#prod-AsyncGeneratorDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncFunctionOrAssignmentExpression(parser, context) {
    return lookahead(parser, context, nextTokenIsFuncKeywordOnSameLine, false) ?
        parseFunctionDeclaration(parser, context | 131072 /* RequireIdentifier */, 8 /* Async */) :
        parseAssignmentExpression(parser, context);
}

/**
 * Validates regular expression pattern
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 */
function verifyRegExpPattern(parser, context) {
    const bodyStart = parser.index;
    const bodyState = validateRegexBody(parser, context, 0, 65536 /* Valid */);
    const bodyEnd = parser.index - 1;
    const { index: flagStart } = parser;
    const flagState = scanRegexFlags(parser, context);
    const flags = parser.source.slice(flagStart, parser.index);
    const pattern = parser.source.slice(bodyStart, bodyEnd);
    const state = setRegExpState(parser, flagState, bodyState);
    return { flags, pattern, state };
}
/**
 * Validate the regular expression body
 *
 * @export
 * @param parser Parser object
 * @param context Context masks
 * @param depth
 * @param state Validation state
 */
function validateRegexBody(parser, context, depth, state) {
    let maybeQuantifier = false;
    while (parser.index !== parser.length) {
        switch (parser.source.charCodeAt(parser.index++)) {
            // `/`
            case 47 /* Slash */:
                if (depth !== 0)
                    return 262144 /* Invalid */;
                return state;
            // `|`
            case 124 /* VerticalBar */:
                maybeQuantifier = false;
                break;
            // `^`, `$`, `.`
            case 94 /* Caret */:
            case 46 /* Period */:
            case 36 /* Dollar */:
                maybeQuantifier = true;
                break;
            // `\`
            case 92 /* Backslash */:
                maybeQuantifier = true;
                if (parser.index >= parser.length) {
                    state = 262144 /* Invalid */;
                }
                else {
                    // Atom ::
                    //   \ AtomEscape
                    if (consumeOpt(parser, 98 /* LowerB */) || consumeOpt(parser, 66 /* UpperB */)) {
                        maybeQuantifier = false;
                    }
                    else {
                        state = setValidationState(state, validateAtomEscape(parser));
                    }
                }
                break;
            // `(`
            case 40 /* LeftParen */:
                let ch = parser.source.charCodeAt(parser.index);
                if (ch === 63 /* QuestionMark */) {
                    parser.index++;
                    parser.column++;
                    ch = parser.source.charCodeAt(parser.index);
                    if (ch === 58 /* Colon */ || ch === 61 /* EqualSign */ || ch === 33 /* Exclamation */) {
                        parser.index++;
                        parser.column++;
                    }
                    else
                        state = 262144 /* Invalid */;
                }
                else {
                    ++parser.capturingParens;
                }
                maybeQuantifier = true;
                state = setValidationState(state, validateRegexBody(parser, context, depth + 1, 65536 /* Valid */));
                break;
            // `)`
            case 41 /* RightParen */:
                if (depth > 0)
                    return state;
                state = 262144 /* Invalid */;
                maybeQuantifier = true;
                break;
            // `[`
            case 91 /* LeftBracket */:
                state = setValidationState(state, validateCharacterClass(parser));
                maybeQuantifier = true;
                break;
            // `]`
            case 93 /* RightBracket */:
                state = 262144 /* Invalid */;
                maybeQuantifier = true;
                break;
            // `?`, `*`, `+`
            case 42 /* Asterisk */:
            case 43 /* Plus */:
            case 63 /* QuestionMark */:
                if (maybeQuantifier) {
                    maybeQuantifier = false;
                    if (parser.index < parser.length) {
                        consumeOpt(parser, 63 /* QuestionMark */);
                    }
                }
                else {
                    state = 262144 /* Invalid */;
                }
                break;
            // `{`
            case 123 /* LeftBrace */:
                if (maybeQuantifier) {
                    // Missing the first digits - '/a{,15}/u' - results in,
                    // 'Incomplete quantifier' without the 'u-flag'
                    let res = validateQuantifierPrefix(parser);
                    if (res & 67108864 /* MissingDigits */) {
                        res = res ^ 67108864 /* MissingDigits */;
                        if (res)
                            state = 4096 /* SloppyMode */;
                        else
                            state = 262144 /* Invalid */;
                    }
                    else if (!res) {
                        // Nothing to repeat
                        state = 262144 /* Invalid */;
                    }
                    if (parser.index < parser.length) {
                        consumeOpt(parser, 63 /* QuestionMark */);
                    }
                    maybeQuantifier = false;
                }
                else {
                    state = 262144 /* Invalid */;
                }
                break;
            // `}`
            case 125 /* RightBrace */:
                state = 262144 /* Invalid */;
                maybeQuantifier = false;
                break;
            case 13 /* CarriageReturn */:
            case 10 /* LineFeed */:
            case 8232 /* LineSeparator */:
            case 8233 /* ParagraphSeparator */:
                return 262144 /* Invalid */;
            default:
                maybeQuantifier = true;
        }
    }
    return 262144 /* Invalid */;
}
/**
 * Validates atom escape
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-AtomEscape)
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape)
 *
 * @param parser Parser object
 */
function validateAtomEscape(parser) {
    // Atom ::
    //   \ AtomEscape
    const next = parser.source.charCodeAt(parser.index++);
    switch (next) {
        // AtomEscape ::
        //   CharacterClassEscape
        //
        // CharacterClassEscape :: one of
        //   d D s S w W
        case 100 /* LowerD */:
        case 68 /* UpperD */:
        case 115 /* LowerS */:
        case 83 /* UpperS */:
        case 119 /* LowerW */:
        case 87 /* UpperW */:
        // ControlEscape :: one of
        //   f n r t v
        case 102 /* LowerF */:
        case 110 /* LowerN */:
        case 114 /* LowerR */:
        case 116 /* LowerT */:
        case 118 /* LowerV */:
        case 94 /* Caret */:
        case 36 /* Dollar */:
        case 92 /* Backslash */:
        case 46 /* Period */:
        case 42 /* Asterisk */:
        case 43 /* Plus */:
        case 63 /* QuestionMark */:
        case 40 /* LeftParen */:
        case 41 /* RightParen */:
        case 91 /* LeftBracket */:
        case 93 /* RightBracket */:
        case 123 /* LeftBrace */:
        case 125 /* RightBrace */:
        case 47 /* Slash */:
        case 124 /* VerticalBar */:
            return 65536 /* Valid */;
        // RegExpUnicodeEscapeSequence[?U]
        case 117 /* LowerU */:
            if (consumeOpt(parser, 123 /* LeftBrace */)) {
                // \u{N}
                let ch2 = parser.source.charCodeAt(parser.index);
                let code = toHex(ch2);
                if (code < 0)
                    return 262144 /* Invalid */;
                parser.index++;
                ch2 = parser.source.charCodeAt(parser.index);
                while (ch2 !== 125 /* RightBrace */) {
                    const digit = toHex(ch2);
                    if (digit < 0)
                        return 262144 /* Invalid */;
                    code = code * 16 + digit;
                    // Code point out of bounds
                    if (code > 1114111 /* NonBMPMax */)
                        return 262144 /* Invalid */;
                    parser.index++;
                    ch2 = parser.source.charCodeAt(parser.index);
                }
                parser.index++;
                return 1024 /* UnicodeMode */;
            }
            // \uNNNN
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index)) < 0) {
                return 262144 /* Invalid */;
            }
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) {
                return 262144 /* Invalid */;
            }
        // falls through
        case 88 /* UpperX */:
        case 120 /* LowerX */:
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) {
                return 262144 /* Invalid */;
            }
            if (parser.index >= parser.length || toHex(parser.source.charCodeAt(parser.index++)) < 0) {
                return 262144 /* Invalid */;
            }
            return 65536 /* Valid */;
        case 99 /* LowerC */:
            {
                if (parser.index < parser.length) {
                    const ch1 = parser.source.charCodeAt(parser.index);
                    const letter = ch1 & ~(65 /* UpperA */ ^ 97 /* LowerA */);
                    // controlLetter is not in range 'A'-'Z' or 'a'-'z'.
                    if (letter >= 65 /* UpperA */ && letter <= 90 /* UpperZ */) {
                        parser.index++;
                        parser.column++;
                        return 4096 /* SloppyMode */;
                    }
                }
                return 262144 /* Invalid */;
            }
        case 48 /* Zero */:
            const ch = parser.source.charCodeAt(parser.index);
            if (parser.index >= parser.length || ch >= 48 /* Zero */ && ch <= 57 /* Nine */) {
                return 262144 /* Invalid */;
            }
            return 65536 /* Valid */;
        case 49 /* One */:
        case 50 /* Two */:
        case 51 /* Three */:
        case 52 /* Four */:
        case 53 /* Five */:
        case 54 /* Six */:
        case 55 /* Seven */:
        case 56 /* Eight */:
        case 57 /* Nine */:
            return parseBackReferenceIndex(parser, next);
        case 13 /* CarriageReturn */:
        case 10 /* LineFeed */:
        case 8233 /* ParagraphSeparator */:
        case 8232 /* LineSeparator */:
            return 262144 /* Invalid */;
        default:
            if (isFlagStart(next))
                return 262144 /* Invalid */;
            return 4096 /* SloppyMode */;
    }
}
/**
 * Validates character class
 *
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom)
 * @see [Link](https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash)
 * @param parser Parser object
 * @param context Context masks
 */
function validateCharacterClass(parser) {
    if (parser.index >= parser.length)
        return 262144 /* Invalid */;
    consumeOpt(parser, 94 /* Caret */);
    const next = parser.source.charCodeAt(parser.index);
    return validateClassRanges(parser, next);
}
/**
 * Scan regular expression flags
 *
 * @param parser Perser object
 * @param context Context masks
 * @returns
 */
function scanRegexFlags(parser, context) {
    let mask = 0 /* Empty */;
    loop: while (parser.index < parser.length) {
        const c = parser.source.charCodeAt(parser.index);
        switch (c) {
            case 103 /* LowerG */:
                if (mask & 1 /* Global */)
                    recordErrors(parser, context, 50 /* DuplicateRegExpFlag */, 'g');
                mask |= 1 /* Global */;
                break;
            case 105 /* LowerI */:
                if (mask & 2 /* IgnoreCase */)
                    recordErrors(parser, context, 50 /* DuplicateRegExpFlag */, 'i');
                mask |= 2 /* IgnoreCase */;
                break;
            case 109 /* LowerM */:
                if (mask & 4 /* Multiline */)
                    recordErrors(parser, context, 50 /* DuplicateRegExpFlag */, 'm');
                mask |= 4 /* Multiline */;
                break;
            case 117 /* LowerU */:
                if (mask & 8 /* Unicode */) {
                    recordErrors(parser, context, 50 /* DuplicateRegExpFlag */, 'u');
                    return 262144 /* Invalid */;
                }
                mask |= 8 /* Unicode */;
                break;
            case 121 /* LowerY */:
                if (mask & 16 /* Sticky */)
                    recordErrors(parser, context, 50 /* DuplicateRegExpFlag */, 'y');
                mask |= 16 /* Sticky */;
                break;
            case 115 /* LowerS */:
                if (mask & 32 /* DotAll */)
                    recordErrors(parser, context, 50 /* DuplicateRegExpFlag */, 's');
                mask |= 32 /* DotAll */;
                break;
            default:
                if (!isFlagStart(c))
                    break loop;
                return 262144 /* Invalid */;
        }
        parser.index++;
        parser.column++;
    }
    return mask & 8 /* Unicode */ ? 1024 /* UnicodeMode */ : 4096 /* SloppyMode */;
}
/**
 * Validates class and character class escape
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-CharacterClassEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-ClassEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-CharacterEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-strict-IdentityEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-strict-CharacterEscape)
 * @see [Link](https://tc39.github.io/ecma262/##prod-ControlEscape)
 * @see [Link](https://tc39.github.io/ecma262/#prod-strict-CharacterEscape)
 *
 * @param parser Parser object
 */
function validateClassAndClassCharacterEscape(parser) {
    switch (parser.source.charCodeAt(parser.index++)) {
        // 'b'
        case 98 /* LowerB */:
            return 1114113 /* InvalidCharClassRange */;
        // 'B'
        case 66 /* UpperB */:
            return 8 /* Backspace */;
        // CharacterClassEscape :: one of
        //   d D s S w W
        case 68 /* UpperD */:
        case 100 /* LowerD */:
        case 83 /* UpperS */:
        case 115 /* LowerS */:
        case 87 /* UpperW */:
        case 119 /* LowerW */:
            return 1114113 /* InvalidCharClassRange */;
        // ControlEscape :: one of
        //   f n r t v
        case 102 /* LowerF */:
            return 12 /* FormFeed */;
        case 110 /* LowerN */:
            return 10 /* LineFeed */;
        case 114 /* LowerR */:
            return 13 /* CarriageReturn */;
        case 116 /* LowerT */:
            return 9 /* Tab */;
        case 118 /* LowerV */:
            return 11 /* VerticalTab */;
        // '/'
        case 47 /* Slash */:
        case 94 /* Caret */:
        case 36 /* Dollar */:
        case 92 /* Backslash */:
        case 46 /* Period */:
        case 42 /* Asterisk */:
        case 43 /* Plus */:
        case 63 /* QuestionMark */:
        case 40 /* LeftParen */:
        case 41 /* RightParen */:
        case 91 /* LeftBracket */:
        case 93 /* RightBracket */:
        case 123 /* LeftBrace */:
        case 125 /* RightBrace */:
        case 124 /* VerticalBar */:
            return parser.source.charCodeAt(parser.index);
        // '-'
        case 45 /* Hyphen */:
            return 45 /* Hyphen */ | 16777216 /* InvalidCharClassInSloppy */;
        case 117 /* LowerU */:
            {
                if (consumeOpt(parser, 123 /* LeftBrace */)) {
                    // \u{N}
                    let ch = parser.source.charCodeAt(parser.index);
                    let code = toHex(ch);
                    if (code < 0)
                        return 1114112 /* InvalidCharClass */;
                    parser.index++;
                    ch = parser.source.charCodeAt(parser.index);
                    while (ch !== 125 /* RightBrace */) {
                        const digit = toHex(ch);
                        if (digit < 0)
                            return 1114112 /* InvalidCharClass */;
                        code = code * 16 + digit;
                        // Code point out of bounds
                        if (code > 1114111 /* NonBMPMax */)
                            return 1114112 /* InvalidCharClass */;
                        parser.index++;
                        ch = parser.source.charCodeAt(parser.index);
                    }
                    parser.index++;
                    return code | 16777216 /* InvalidCharClassInSloppy */;
                }
                else {
                    // \uNNNN
                    let codePoint = toHex(parser.source.charCodeAt(parser.index));
                    if (codePoint < 0)
                        return 1114112 /* InvalidCharClass */;
                    for (let i = 0; i < 3; i++) {
                        parser.index++;
                        parser.column++;
                        const digit = toHex(parser.source.charCodeAt(parser.index));
                        if (digit < 0)
                            return 1114112 /* InvalidCharClass */;
                        codePoint = codePoint * 16 + digit;
                    }
                    parser.index++;
                    parser.column++;
                    return codePoint;
                }
            }
        case 120 /* LowerX */:
            {
                if (parser.index >= parser.length - 1)
                    return 1114112 /* InvalidCharClass */;
                const ch1 = parser.source.charCodeAt(parser.index);
                const hi = toHex(ch1);
                if (hi < 0)
                    return 1114112 /* InvalidCharClass */;
                parser.index++;
                const ch2 = parser.source.charCodeAt(parser.index);
                const lo = toHex(ch2);
                if (lo < 0)
                    return 1114112 /* InvalidCharClass */;
                parser.index++;
                return (hi << 4) | lo;
            }
        case 99 /* LowerC */:
            if (parser.index < parser.length) {
                const ch = parser.source.charCodeAt(parser.index);
                const letter = ch & ~(65 /* UpperA */ ^ 97 /* LowerA */);
                // Control letters mapped to ASCII control characters in the range 0x00-0x1F.
                if (letter >= 65 /* UpperA */ && letter <= 90 /* UpperZ */) {
                    parser.index++;
                    parser.column++;
                    return ch & 0x1F;
                }
            }
            return 1114112 /* InvalidCharClass */;
        // '0'
        case 48 /* Zero */:
            {
                // With /u, \0 is interpreted as NUL if not followed by another digit.
                if (parser.index < parser.length) {
                    const next = parser.source.charCodeAt(parser.index);
                    if (!(next >= 48 /* Zero */ && next <= 57 /* Nine */))
                        return 0;
                }
                // falls through
            }
        case 49 /* One */:
        case 50 /* Two */:
        case 51 /* Three */:
        case 52 /* Four */:
        case 53 /* Five */:
        case 54 /* Six */:
        case 55 /* Seven */:
        case 56 /* Eight */:
        case 57 /* Nine */:
            // Invalid class escape
            return 1114112 /* InvalidCharClass */;
        default:
    }
    return 1114112 /* InvalidCharClass */;
}
/**
 * Validates character class ranges
 *
 * @param parser Parser object
 * @param context Context masks
 */
function validateClassRanges(parser, ch) {
    let prevChar = 0;
    let surrogate = 0;
    let leftUnicodeRange = 0;
    let CharacterRange = 0;
    let prevState = 0 /* Empty */;
    let subState = 65536 /* Valid */;
    let state = 0 /* Empty */;
    let count = 0;
    while (parser.index < parser.length) {
        parser.index++;
        parser.column++;
        switch (ch) {
            // `]`
            case 93 /* RightBracket */:
                {
                    if (state & 256 /* SeenUnicoderange */ &&
                        hasBit(prevState, 4 /* IsSurrogateLead */) &&
                        (leftUnicodeRange === 1114113 /* InvalidCharClassRange */ ||
                            prevChar & 1114113 /* InvalidCharClassRange */ || leftUnicodeRange > prevChar)) {
                        if (subState & 1024 /* UnicodeMode */ ||
                            subState & 262144 /* Invalid */)
                            return 262144 /* Invalid */;
                        return 4096 /* SloppyMode */;
                    }
                    return subState;
                }
            // `\`
            case 92 /* Backslash */:
                {
                    ch = validateClassAndClassCharacterEscape(parser);
                    if (ch === 1114112 /* InvalidCharClass */) {
                        subState = 262144 /* Invalid */;
                    }
                    else if (ch & 16777216 /* InvalidCharClassInSloppy */) {
                        ch = ch ^ 16777216 /* InvalidCharClassInSloppy */;
                        if (ch === 1114112 /* InvalidCharClass */)
                            subState = 262144 /* Invalid */;
                        else if (subState & 65536 /* Valid */)
                            subState = 1024 /* UnicodeMode */;
                        else if (subState & 4096 /* SloppyMode */)
                            subState = 262144 /* Invalid */;
                    }
                    break;
                }
        }
        if (hasBit(prevState, 4 /* IsSurrogateLead */) && ch >= 0xDC00 && ch <= 0xDFFF) {
            state = state & ~4 /* IsSurrogateLead */ | 1 /* IsTrailSurrogate */;
            surrogate = (prevChar - 0xD800) * 0x400 + (ch - 0xDC00) + 0x10000;
        }
        else if (!hasBit(prevState, 1 /* IsTrailSurrogate */) &&
            hasBit(prevState, 4 /* IsSurrogateLead */) &&
            (ch & 0x1fffff) > 0xffff) {
            state = state & ~4 /* IsSurrogateLead */ | 1 /* IsTrailSurrogate */;
            surrogate = ch;
        }
        else {
            state = state & ~(1 /* IsTrailSurrogate */ | 4 /* IsSurrogateLead */);
            if (ch >= 0xD800 && ch <= 0xDBFF)
                state = state | 4 /* IsSurrogateLead */;
        }
        if (state & 256 /* SeenUnicoderange */) {
            const rightUnicodeRange = state & 1 /* IsTrailSurrogate */ ? surrogate : hasBit(prevState, 4 /* IsSurrogateLead */) ? prevChar : ch;
            if (!(state & 4 /* IsSurrogateLead */) || hasBit(prevState, 4 /* IsSurrogateLead */)) {
                state = state & ~256 /* SeenUnicoderange */;
                subState = getUnicodeRange(leftUnicodeRange, subState, rightUnicodeRange);
            }
        }
        else if (ch === 45 /* Hyphen */ && count > 0) {
            state = state | 256 /* SeenUnicoderange */;
        }
        else {
            leftUnicodeRange = state & 1 /* IsTrailSurrogate */ ? surrogate : ch;
        }
        if (state & 1024 /* InCharacterRange */) {
            state = state & ~1024 /* InCharacterRange */;
            subState = getRange(ch, CharacterRange, subState);
        }
        else if (ch === 45 /* Hyphen */ && count > 0) {
            state = state | 1024 /* InCharacterRange */;
        }
        else {
            CharacterRange = ch;
        }
        prevState = state;
        prevChar = ch;
        count++;
        ch = parser.source.charCodeAt(parser.index);
    }
    return 262144 /* Invalid */;
}

/**
 * Creates the parser object
 *
 * @param source The source coode to parser
 * @param sourceFile Optional source file info to be attached in every node
 */
function createParserObject(source, onComment, onError) {
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
        flags: 4 /* Assignable */,
        // Tokenizing
        tokens: [],
        // Label tracking
        labelSet: undefined,
        labelSetStack: [],
        iterationStack: [],
        labelDepth: 0,
        switchStatement: 0 /* Empty */,
        iterationStatement: 0 /* Empty */,
        functionBoundaryStack: undefined,
        // Regular expression
        capturingParens: 0,
        largestBackReference: 0,
        // Misc
        token: 131072 /* EndOfSource */,
        tokenValue: undefined,
        tokenRaw: '',
        tokenRegExp: undefined,
        onError,
        onComment,
    };
}
/**
 * Creating the parser
 *
 * @param source The source coode to parser
 * @param options The parser options
 * @param context Context masks
 */
function parseSource(source, options, 
/*@internal*/
context) {
    let onError;
    let onComment;
    let sourceFile = '';
    if (options !== undefined) {
        // The flag to enable module syntax support
        if (options.module)
            context |= 65536 /* Module */;
        // The flag to enable stage 3 support (ESNext)
        if (options.next)
            context |= 8 /* OptionsNext */;
        // The flag to enable React JSX parsing
        if (options.jsx)
            context |= 2 /* OptionsJSX */;
        // The flag to enable start and end offsets to each node
        if (options.ranges)
            context |= 128 /* OptionsRanges */;
        // The flag to enable line/column location information to each node
        if (options.loc)
            context |= 64 /* OptionsLoc */;
        // The flag to attach raw property to each literal node
        if (options.raw)
            context |= 4 /* OptionsRaw */;
        // Attach raw property to each identifier node
        if (options.rawIdentifier)
            context |= 8192 /* OptionsRawidentifiers */;
        // The flag to allow return in the global scope
        if (options.globalReturn)
            context |= 512 /* OptionsGlobalReturn */;
        // The flag to allow to skip shebang - '#'
        if (options.skipShebang)
            context |= 2048 /* OptionsShebang */;
        // Set to true to record the source file in every node's loc object when the loc option is set.
        if (!!options.source)
            sourceFile = options.source;
        // Create a top-level comments array containing all comments
        if (!!options.comments)
            context |= 1024 /* OptionsComments */;
        // The flag to enable implied strict mode
        if (options.impliedStrict)
            context |= 32768 /* Strict */;
        // The flag to enable experimental features
        if (options.experimental)
            context |= 4096 /* OptionsExperimental */;
        // The flag to set to bypass methods in Node
        if (options.node)
            context |= 16384 /* OptionsNode */;
        // The flag to enable tokenizing
        if (options.tokenize)
            context |= 1 /* OptionsTokenize */;
        // The flag to enable web compat (annexB)
        if (options.webcompat)
            context |= 16 /* OptionsWebCompat */;
        // The flag to enable editor mode
        if (options.edit)
            context |= 32 /* OptionsEditorMode */;
        if (options.edit != null)
            onError = options.edit;
        if (options.onComment != null)
            onComment = options.onComment;
    }
    // Create the parser object
    const parser = createParserObject(source, onComment, onError);
    const body = (context & 65536 /* Module */) === 65536 /* Module */ ?
        parseModuleItemList(parser, context) : parseStatementList(parser, context);
    return {
        type: 'Program',
        sourceType: context & 65536 /* Module */ ? 'module' : 'script',
        body: body,
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
function parse(source, options) {
    return options && options.module ?
        parseModule(source, options) :
        parseScript(source, options);
}
/**
 * Parse script code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-scripts)
 *
 * @param source source code to parse
 * @param options parser options
 */
function parseScript(source, options) {
    return parseSource(source, options, 0 /* Empty */);
}
/**
 * Parse module code
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
function parseModule(source, options) {
    return parseSource(source, options, 32768 /* Strict */ | 65536 /* Module */);
}
/**
 * Validate regular expressions
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-modules)
 *
 * @param source source code to parse
 * @param options parser options
 */
function validateRegExp(source, options) {
    // Create the parser object
    const parser = createParserObject(source, undefined, undefined);
    let context = 0 /* Empty */;
    if (options !== undefined) {
        // The flag to enable editor mode
        if (options.edit)
            context |= 32 /* OptionsEditorMode */;
    }
    if (!consumeOpt(parser, 47 /* Slash */))
        recordErrors(parser, context, 51 /* InvalidRegularExp */);
    const { state } = verifyRegExpPattern(parser, context);
    if (state === 262144 /* Invalid */)
        recordErrors(parser, context, 51 /* InvalidRegularExp */);
    return (state === 65536 /* Valid */) ? true : false;
}

const version = '1.6.8';

exports.version = version;
exports.parse = parse;
exports.parseSource = parseSource;
exports.parseModule = parseModule;
exports.parseScript = parseScript;
exports.validateRegExp = validateRegExp;
