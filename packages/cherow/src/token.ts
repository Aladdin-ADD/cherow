/**
 * https://tc39.github.io/ecma262/#sec-ecmascript-language-source-code
 */
export const enum Token {
    Type = 0xFF,

    /* Precedence */
    PrecStart          = 8,
    Precedence         = 15 << PrecStart, // 8-11

    /* Attribute names */
    Contextual         = 1 << 12,
    Reserved           = 1 << 13,
    FutureReserved     = 1 << 14,
    Invalid            = 1 << 16,
    ASI                = 1 << 17,
    IsLogical          = 1 << 18,

    /* ECMA tokens */
    WhiteSpace         = 1 << 19, // Note: LineTerminator and WhiteSpace are treated as one token
    Comments           = 1 << 20 | WhiteSpace,
    NumericLiteral     = 1 << 21,
    StringLiteral      = 1 << 22,
    Identifier         = 1 << 23,
    IdentifierOrContextual = Identifier | Contextual,
    RegularExpression  = 1 << 24,
    Punctuator        = 1 << 25,
    Template           = 1 << 26,

    /** Misc */
    IsAssignOp         = 1 << 27,
    IsBinaryOp         = 1 << 28,
    IsUnaryOp          = 1 << 29,
    IsUpdateOp         = 1 << 30,

    /** Constants */
    Keyword = Token.Identifier | Token.Reserved | Token.FutureReserved | Token.Contextual,

    /* Node types */
    EndOfSource = 0 | ASI, // Pseudo

    /* Booleans */
    FalseKeyword      = 1 | Reserved,
    TrueKeyword       = 2 | Reserved,

    /* Null literal */
    NullKeyword       = 3 | Reserved,

    /* Template nodes */
    TemplateHead  = 4 | Template,
    TemplateCont = 5 | Template,
    TemplateTail  = 6 | Template,

    /* Punctuators */
    Arrow        = 7  | Punctuator, // =>
    LeftParen    = 8  | Punctuator, // (
    LeftBrace    = 9  | Punctuator, // {
    Period       = 10 | Punctuator, // .
    Ellipsis     = 11 | Punctuator, // ...
    RightBrace   = 12 | Punctuator | ASI, // }
    RightParen   = 13 | Punctuator, // )
    Semicolon    = 14 | Punctuator | ASI, // ;
    Comma        = 15 | Punctuator, // ,
    LeftBracket  = 16 | Punctuator, // [
    RightBracket = 17 | Punctuator, // ]
    Colon        = 18 | Punctuator, // :
    QuestionMark = 19 | Punctuator, // ?
    SingleQuote  = 20 | Punctuator, // '
    DoubleQuote  = 21 | Punctuator, // "
    JSXClose     = 22 | Punctuator, // </
    JSXAutoClose = 23 | Punctuator, // />

    /* Update operators */
    Increment = 24 | Punctuator | IsUpdateOp, // ++
    Decrement = 25 | Punctuator | IsUpdateOp, // --

    /* Assign operators */
    Assign                  = 26  | Punctuator | IsAssignOp, // =
    ShiftLeftAssign         = 27  | Punctuator | IsAssignOp, // <<=
    ShiftRightAssign        = 28  | Punctuator | IsAssignOp, // >>=
    LogicalShiftRightAssign = 29  | Punctuator | IsAssignOp, // >>>=
    ExponentiateAssign      = 30  | Punctuator | IsAssignOp, // **=
    AddAssign               = 31  | Punctuator | IsAssignOp, // +=
    SubtractAssign          = 32  | Punctuator | IsAssignOp, // -=
    MultiplyAssign          = 33  | Punctuator | IsAssignOp, // *=
    DivideAssign            = 34  | Punctuator | IsAssignOp, // /=
    ModuloAssign            = 35  | Punctuator | IsAssignOp, // %=
    BitwiseXorAssign        = 36  | Punctuator | IsAssignOp, // ^=
    BitwiseOrAssign         = 37  | Punctuator | IsAssignOp, // |=
    BitwiseAndAssign        = 38  | Punctuator | IsAssignOp, // &=

    /* Unary/binary operators */
    TypeofKeyword      = 39  | IsUnaryOp | Punctuator | Reserved,
    DeleteKeyword      = 40  | IsUnaryOp | Punctuator | Reserved,
    VoidKeyword        = 41  | IsUnaryOp | Punctuator | Reserved,
    Negate             = 42  | IsUnaryOp | Punctuator, // !
    Complement         = 43  | IsUnaryOp | Punctuator, // ~
    Add                = 44  | IsUnaryOp | IsBinaryOp | Punctuator | 9 << PrecStart, // +
    Subtract           = 45  | IsUnaryOp | IsBinaryOp | Punctuator | 9 << PrecStart, // -
    InKeyword          = 46  | IsBinaryOp | Punctuator | 7 << PrecStart | Reserved,
    InstanceofKeyword  = 47  | IsBinaryOp | Punctuator | 7 << PrecStart | Reserved,
    Multiply           = 48  | IsBinaryOp | Punctuator | 10 << PrecStart, // *
    Modulo             = 49  | IsBinaryOp | Punctuator | 10 << PrecStart, // %
    Divide             = 50  | IsBinaryOp | Punctuator | 10 << PrecStart, // /
    Exponentiate       = 51  | IsBinaryOp | Punctuator | 11 << PrecStart, // **
    LogicalAnd         = 52  | IsBinaryOp | Punctuator | 2 << PrecStart | IsLogical, // &&
    LogicalOr          = 53  | IsBinaryOp | Punctuator | 1 << PrecStart | IsLogical, // ||
    StrictEqual        = 54  | IsBinaryOp | Punctuator | 6 << PrecStart, // ===
    StrictNotEqual     = 55  | IsBinaryOp | Punctuator | 6 << PrecStart, // !==
    LooseEqual         = 56  | IsBinaryOp | Punctuator | 6 << PrecStart, // ==
    LooseNotEqual      = 57  | IsBinaryOp | Punctuator | 6 << PrecStart, // !=
    LessThanOrEqual    = 58  | IsBinaryOp | Punctuator | 7 << PrecStart, // <=
    GreaterThanOrEqual = 59  | IsBinaryOp | Punctuator | 7 << PrecStart, // >=
    LessThan           = 60  | IsBinaryOp | Punctuator | 7 << PrecStart, // <
    GreaterThan        = 61  | IsBinaryOp | Punctuator | 7 << PrecStart, // >
    ShiftLeft          = 62  | IsBinaryOp | Punctuator | 8 << PrecStart, // <<
    ShiftRight         = 63  | IsBinaryOp | Punctuator | 8 << PrecStart, // >>
    LogicalShiftRight  = 64  | IsBinaryOp | Punctuator | 8 << PrecStart, // >>>
    BitwiseAnd         = 65  | IsBinaryOp | Punctuator | 5 << PrecStart, // &
    BitwiseOr          = 66  | IsBinaryOp | Punctuator | 3 << PrecStart, // |
    BitwiseXor         = 67  | IsBinaryOp | Punctuator | 4 << PrecStart, // ^

    /* Variable declaration kinds */
    VarKeyword   = 68 | Reserved,
    LetKeyword   = 69 | FutureReserved,
    ConstKeyword = 70 | Reserved,

    /* Other reserved words */
    BreakKeyword    = 71 | Reserved,
    CaseKeyword     = 72 | Reserved,
    CatchKeyword    = 73 | Reserved,
    ClassKeyword    = 74 | Reserved,
    ContinueKeyword = 75 | Reserved,
    DebuggerKeyword = 76 | Reserved,
    DefaultKeyword  = 77 | Reserved,
    DoKeyword       = 78 | Reserved,
    ElseKeyword     = 79 | Reserved,
    ExportKeyword   = 80 | Reserved,
    ExtendsKeyword  = 81 | Reserved,
    FinallyKeyword  = 82 | Reserved,
    ForKeyword      = 83 | Reserved,
    FunctionKeyword = 84 | Reserved,
    IfKeyword       = 85 | Reserved,
    ImportKeyword   = 86 | Reserved,
    NewKeyword      = 87 | Reserved,
    ReturnKeyword   = 88 | Reserved,
    SuperKeyword    = 89 | Reserved,
    SwitchKeyword   = 90 | Reserved,
    ThisKeyword     = 91 | Reserved,
    ThrowKeyword    = 92 | Reserved,
    TryKeyword      = 93 | Reserved,
    WhileKeyword    = 94 | Reserved,
    WithKeyword     = 95 | Reserved,

    /* Eval & arguments */
    Arguments        = 96 | Identifier,
    Eval             = 97 | Identifier,

    /* Decorators */
    At               = 98 | Identifier,

    /* Private names or shebang comment start */
    Hash             = 99 | Identifier,

    /* Strict mode reserved words */
    ImplementsKeyword = 100 | FutureReserved,
    InterfaceKeyword  = 101 | FutureReserved,
    PackageKeyword    = 102 | FutureReserved,
    PrivateKeyword    = 103 | FutureReserved,
    ProtectedKeyword  = 104 | FutureReserved,
    PublicKeyword     = 105 | FutureReserved,
    StaticKeyword     = 106 | FutureReserved,
    YieldKeyword      = 107 | FutureReserved,

    /* Contextual keywords */
    AsKeyword          = 108 | Contextual,
    AsyncKeyword       = 109 | Contextual,
    AwaitKeyword       = 110 | Contextual,
    ConstructorKeyword = 111 | Contextual,
    GetKeyword         = 112 | Contextual,
    SetKeyword         = 113 | Contextual,
    FromKeyword        = 114 | Contextual,
    OfKeyword          = 115 | Contextual,

    /* Comments */
    SingleComment      = 116 | WhiteSpace | Comments,
    MultiComment       = 117 | WhiteSpace | Comments,
    HTMLComment        = 118 | WhiteSpace | Comments,

    /* WhiteSpace */
    Space              = 119 | WhiteSpace,
    Tab                = 120 | WhiteSpace,
    LineFeed           = 121 | WhiteSpace,
    CarriageReturn     = 122 | WhiteSpace,

    /* Numbers */
    BigInt             = 123 | NumericLiteral,

    /* Enum */
    EnumKeyword        = 124 | Reserved,

    /** Escaped keywords */

    EscapedStrictReserved  = 125,
    EscapedKeyword         = 126,
}

// Note: this *must* be kept in sync with the enum's order.
//
// It exploits the enum value ordering, and it's necessarily a complete and
// utter hack.
//
// All to lower it to a single monomorphic array access.
export const KeywordDescTable = [
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

    'enum',

    /* Escaped keywords */

    'escaped strict reserved', 'escaped keyword'
];

/**
 * The conversion function between token and its string description/representation.
 */
export function tokenDesc(token: Token): string {
    if ((token & Token.Type) < KeywordDescTable.length) {
        return KeywordDescTable[token & Token.Type];
    } else {
        throw new Error('unreachable');
    }
}

// Normal object is much faster than Object.create(null), even with typeof check to avoid Object.prototype interference
export const descKeywordTable: {[key: string]: Token} = {
  this: Token.ThisKeyword,
  function: Token.FunctionKeyword,
  if: Token.IfKeyword,
  return: Token.ReturnKeyword,
  var: Token.VarKeyword,
  else: Token.ElseKeyword,
  for: Token.ForKeyword,
  new: Token.NewKeyword,
  in: Token.InKeyword,
  typeof: Token.TypeofKeyword,
  while: Token.WhileKeyword,
  case: Token.CaseKeyword,
  break: Token.BreakKeyword,
  try: Token.TryKeyword,
  catch: Token.CatchKeyword,
  delete: Token.DeleteKeyword,
  throw: Token.ThrowKeyword,
  switch: Token.SwitchKeyword,
  continue: Token.ContinueKeyword,
  default: Token.DefaultKeyword,
  instanceof: Token.InstanceofKeyword,
  do: Token.DoKeyword,
  void: Token.VoidKeyword,
  finally: Token.FinallyKeyword,
  arguments: Token.Arguments,
  async: Token.AsyncKeyword,
  await: Token.AwaitKeyword,
  class: Token.ClassKeyword,
  const: Token.ConstKeyword,
  constructor: Token.ConstructorKeyword,
  debugger: Token.DebuggerKeyword,
  enum: Token.EnumKeyword,
  eval: Token.Eval,
  export: Token.ExportKeyword,
  extends: Token.ExtendsKeyword,
  false: Token.FalseKeyword,
  from: Token.FromKeyword,
  get: Token.GetKeyword,
  implements: Token.ImplementsKeyword,
  import: Token.ImportKeyword,
  interface: Token.InterfaceKeyword,
  let: Token.LetKeyword,
  null: Token.NullKeyword,
  of: Token.OfKeyword,
  package: Token.PackageKeyword,
  private: Token.PrivateKeyword,
  protected: Token.ProtectedKeyword,
  public: Token.PublicKeyword,
  set: Token.SetKeyword,
  static: Token.StaticKeyword,
  super: Token.SuperKeyword,
  true: Token.TrueKeyword,
  with: Token.WithKeyword,
  yield: Token.YieldKeyword,
  as: Token.AsKeyword,
};
