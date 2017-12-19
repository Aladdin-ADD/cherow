import parserTest262 from '../tools/test262';
import * as path from 'path';
import { parseScript, parseModule} from '../../src/cherow';

describe('test262 tests', () => parserTest262({
    test262Dir: path.join(__dirname, '../../', 'node_modules', 'test262'),
    annexB: true,
    test: it,
    skip: [
        'regexp-lookbehind',
        'regexp-named-groups',
        'regexp-unicode-property-escapes',
    ],
    ignore: [
        // TODO!
        'test/annexB/language/global-code/block-decl-global-no-skip-try.js',
        'test/annexB/language/comments/multi-line-html-close.js',
        'test/annexB/language/statements/for-in/nonstrict-initializer.js',
        'test/language/block-scope/syntax/redeclaration/class-declaration-attempt-to-redeclare-with-var-declaration.js',
        'test/language/block-scope/syntax/redeclaration/class-declaration-attempt-to-redeclare-with-var-declaration.js',
        'test/language/block-scope/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-class-declaration.js',
        'test/language/block-scope/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-class-declaration.js',
        'test/language/statements/if/let-array-with-newline.js',
        'test/language/statements/labeled/let-array-with-newline.js',
        'test/language/statements/with/let-array-with-newline.js',
        'test/language/asi/S7.9_A5.7_T1.js',
        'test/language/expressions/this/S11.1.1_A1.js',
        'test/language/expressions/this/S11.1.1_A1.js',
        'test/language/expressions/tagged-template/invalid-escape-sequences.js',
        'test/language/expressions/tagged-template/invalid-escape-sequences.js',
        'test/language/expressions/template-literal/tv-null-character-escape-sequence.js',
        'test/language/expressions/template-literal/tv-null-character-escape-sequence.js',
        'test/language/expressions/prefix-increment/11.4.4-2-2-s.js',
        'test/language/expressions/prefix-increment/non-simple.js',
        'test/language/expressions/prefix-increment/target-cover-newtarget.js',
        'test/language/expressions/prefix-increment/target-cover-yieldexpr.js',
        'test/language/expressions/prefix-increment/target-newtarget.js',
        'test/language/expressions/prefix-decrement/11.4.5-2-2-s.js',
        'test/language/expressions/prefix-decrement/non-simple.js',
        'test/language/expressions/prefix-decrement/target-cover-newtarget.js',
        'test/language/expressions/prefix-decrement/target-cover-yieldexpr.js',
        'test/language/expressions/prefix-decrement/target-newtarget.js',
        'test/language/expressions/postfix-decrement/11.3.2-2-1-s.js',
        'test/language/expressions/postfix-decrement/non-simple.js',
        'test/language/expressions/postfix-decrement/target-cover-newtarget.js',
        'test/language/expressions/postfix-decrement/target-cover-yieldexpr.js',
        'test/language/expressions/postfix-decrement/target-newtarget.js',
        'test/language/expressions/postfix-increment/non-simple.js',
        'test/language/expressions/postfix-increment/non-simple.js',
        'test/language/expressions/postfix-increment/11.3.1-2-1-s.js',
        'test/language/expressions/postfix-increment/target-newtarget.js',
        'test/language/expressions/postfix-increment/target-newtarget.js',
        'test/language/expressions/postfix-increment/target-cover-yieldexpr.js',
        'test/language/expressions/postfix-increment/target-cover-yieldexpr.js',
        'test/language/expressions/postfix-increment/target-cover-newtarget.js',
        'test/language/expressions/object/method-definition/meth-dflt-params-duplicates.js',
        'test/language/expressions/class/accessor-name-static-literal-string-line-continuation.js',
        'test/language/expressions/class/accessor-name-inst-literal-string-line-continuation.js',
        'test/language/expressions/object/accessor-name-literal-string-line-continuation.js',
        'test/language/expressions/object/cover-initialized-name.js',
        'test/language/expressions/object/cover-initialized-name.js',
        'test/language/expressions/object/11.1.5_7-2-2-s.js',
        'test/language/expressions/object/11.1.5-3-s.js',
        'test/language/expressions/object/11.1.5_7-2-1-s.js',
        'test/language/expressions/new.target/escaped-target.js',
        'test/language/expressions/compound-assignment/u-right-shift-non-simple.js',
        'test/language/expressions/function/dflt-params-duplicates.js',
        'test/language/expressions/compound-assignment/right-shift-non-simple.js',
        'test/language/expressions/compound-assignment/subtract-non-simple.js',
        'test/language/expressions/compound-assignment/mult-non-simple.js',
        'test/language/expressions/compound-assignment/mod-div-non-simple.js',
        'test/language/expressions/compound-assignment/left-shift-non-simple.js',
        'test/language/expressions/compound-assignment/div-non-simple.js',
        'test/language/expressions/compound-assignment/btws-xor-non-simple.js',
        'test/language/expressions/compound-assignment/btws-or-non-simple.js',
        'test/language/expressions/compound-assignment/btws-and-non-simple.js',
        'test/language/expressions/compound-assignment/add-non-simple.js',
        'test/language/expressions/class/fields-typeof-init-err-contains-arguments.js',
        'test/language/expressions/class/fields-private-typeof-init-err-contains-arguments.js',
        'test/language/expressions/class/fields-equality-init-err-contains-arguments.js',
        'test/language/expressions/class/fields-private-typeof-init-err-contains-arguments.js',
        'test/language/expressions/class/fields-direct-eval-err-contains-newtarget.js',
        'test/language/expressions/class/fields-direct-eval-err-contains-newtarget.js',
        'test/language/expressions/class/fields-direct-eval-err-contains-arguments.js',
        'test/language/expressions/class/fields-derived-cls-direct-eval-err-contains-superproperty-2.js',
        'test/language/expressions/class/fields-direct-eval-err-contains-arguments.js',
        'test/language/expressions/class/fields-derived-cls-direct-eval-err-contains-superproperty-1.js',
        'test/language/expressions/class/fields-derived-cls-direct-eval-err-contains-supercall.js',
        'test/language/expressions/class/fields-derived-cls-direct-eval-err-contains-supercall-2.js',
        'test/language/expressions/class/fields-derived-cls-direct-eval-err-contains-supercall-1.js',
        'test/language/expressions/object/11.1.5_6-2-1-s.js',
        'test/language/expressions/await/early-errors-await-not-simple-assignment-target.js',
        'test/language/expressions/async-generator/early-errors-expression-not-simple-assignment-target.js',
        'test/language/expressions/async-generator/early-errors-expression-not-simple-assignment-target.js',
        'test/language/expressions/async-function/early-errors-expression-not-simple-assignment-target.js',
        'test/language/expressions/async-function/early-errors-expression-not-simple-assignment-target.js',
        'test/language/expressions/assignment/target-string.js',
        'test/language/expressions/assignment/target-string.js',
        'test/language/expressions/assignment/target-number.js',
        'test/language/expressions/assignment/target-null.js',
        'test/language/expressions/assignment/target-newtarget.js',
        'test/language/expressions/assignment/target-cover-yieldexpr.js',
        'test/language/expressions/assignment/target-boolean.js',
        'test/language/expressions/assignment/non-simple-target.js',
        'test/language/expressions/assignment/dstr-obj-rest-not-last-element-invalid.js',
        'test/language/expressions/assignment/dstr-array-rest-init.js',
        'test/language/expressions/assignment/destructuring/obj-prop-__proto__dup.js',
        'test/language/expressions/assignment/11.13.1-4-31-s.js',
        'test/language/expressions/assignment/11.13.1-4-29-s.js',
        'test/language/module-code/namespace/**/*.js',
        'test/language/module-code/early-dup-export-dflt-id.js',
        'test/language/module-code/early-dup-export-id-as.js',
        'test/language/module-code/early-dup-export-id.js',
        'test/language/module-code/early-export-unresolvable.js',
        'test/language/module-code/eval-gtbndng*.js',
        'test/language/module-code/eval-rqstd*.js',
        'test/language/module-code/instn*.js',
        'test/language/module-code/parse-err-hoist-lex-fun.js',
        'test/language/module-code/parse-err-hoist-lex-gen.js',
        'test/language/module-code/parse-err-reference.js',
        'test/language/module-code/privatename-valid-no-earlyerr.js',
        'test/language/block-scope/shadowing/const-declarations-shadowing-parameter-name-let-const-and-var-variables.js',
        'test/language/block-scope/shadowing/let-declarations-shadowing-parameter-name-let-const-and-var.js',
        'test/language/block-scope/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-var-declaration.js', //
        'test/language/block-scope/syntax/redeclaration/async-function-declaration-attempt-to-redeclare-with-var-declaration.js', //
        'test/language/block-scope/syntax/redeclaration/async-generator-declaration-attempt-to-redeclare-with-var-declaration.js', //
        'test/language/block-scope/syntax/redeclaration/function-declaration-attempt-to-redeclare-with-var-declaration.js', //
        'test/language/block-scope/syntax/redeclaration/generator-declaration-attempt-to-redeclare-with-var-declaration.js', //
        'test/language/block-scope/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-async-generator-declaration.js', //
        'test/language/block-scope/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-function-declaration.js', //
        'test/language/block-scope/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-generator-declaration.js',
        'test/language/directive-prologue/10.1.1-23-s.js',
        'test/language/directive-prologue/10.1.1-24-s.js',
        'test/language/directive-prologue/14.1-4-s.js',
        'test/language/eval-code/direct/global-env-rec-eval.js',
        'test/language/eval-code/direct/switch-case-decl-strict-caller.js',
        'test/language/eval-code/direct/switch-case-decl-strict-source.js',
        'test/language/eval-code/direct/switch-dflt-decl-strict-caller.js',
        'test/language/eval-code/direct/switch-dflt-decl-strict-source.js',
        'test/language/eval-code/indirect/global-env-rec-eval.js',
        'test/language/eval-code/indirect/switch-case-decl-strict.js',
        'test/language/eval-code/indirect/switch-dflt-decl-strict.js',
        'test/annexB/language/global-code/block-decl-global-no-skip-try.js',
        'test/language/statements/break/S12.8_A1_T2.js',
        'test/language/statements/break/S12.8_A1_T4.js',
        'test/language/statements/break/S12.8_A5_T3.js',
        'test/language/statements/class/accessor-name-inst-literal-string-line-continuation.js',
        'test/language/statements/class/accessor-name-static-literal-string-line-continuation.js',
        'test/language/statements/class/definition/early-errors-class-method-NSPL-with-USD.js',
        'test/language/statements/class/fields-derived-cls-direct-eval-err-contains-supercall-1.js',
        'test/language/statements/class/fields-derived-cls-direct-eval-err-contains-supercall-2.js',
        'test/language/statements/class/fields-derived-cls-direct-eval-err-contains-supercall.js',
        'test/language/statements/class/fields-derived-cls-direct-eval-err-contains-superproperty-1.js',
        'test/language/statements/class/fields-derived-cls-direct-eval-err-contains-superproperty-2.js',
        'test/language/statements/class/fields-direct-eval-err-contains-arguments.js',
        'test/language/statements/class/fields-direct-eval-err-contains-newtarget.js',
        'test/language/statements/class/fields-equality-init-err-contains-arguments.js',
        'test/language/statements/class/privatename-not-valid-earlyerr-script-4.js',
        'test/language/statements/class/privatename-not-valid-eval-earlyerr-3.js',
        'test/language/statements/continue/S12.7_A5_T3.js',
        'test/language/statements/do-while/S12.6.1_A8.js',
        'test/language/statements/for-await-of/async-func-decl-dstr-obj-id-put-unresolvable-no-strict.js',
        'test/language/statements/for-await-of/async-func-decl-dstr-obj-prop-put-unresolvable-no-strict.js',
        'test/language/statements/for-await-of/async-gen-decl-dstr-obj-id-put-unresolvable-no-strict.js',
        'test/language/statements/for-await-of/async-gen-decl-dstr-obj-prop-put-unresolvable-no-strict.js',
        'test/language/statements/for-await-of/let-array-with-newline.js',
        'test/language/statements/for-in/dstr-array-rest-before-element.js',
        'test/language/statements/for-in/dstr-array-rest-before-elision.js',
        'test/language/statements/for-in/dstr-array-rest-before-rest.js',
        'test/language/statements/for-in/dstr-array-rest-elision-invalid.js',
        'test/language/statements/for-in/head-const-bound-names-in-stmt.js',
        'test/language/statements/for-in/head-let-bound-names-in-stmt.js',
        'test/language/statements/for-of/body-put-error.js',
        'test/language/statements/for-of/dstr-array-rest-before-element.js',
        'test/language/statements/for-of/dstr-array-rest-before-elision.js',
        'test/language/statements/for-of/dstr-array-rest-before-rest.js',
        'test/language/statements/for-of/dstr-array-rest-elision-invalid.js',
        'test/language/statements/for-of/head-const-bound-names-in-stmt.js',
        'test/language/statements/for-of/head-let-bound-names-in-stmt.js',
        'test/language/statements/for-of/head-lhs-member.js',
        'test/language/statements/for-of/let-array-with-newline.js',
        'test/language/statements/for/head-let-bound-names-in-stmt.js',
        'test/language/statements/for-in/let-array-with-newline.js',
        'test/language/statements/while/let-block-with-newline.js',
        'test/language/statements/while/let-identifier-with-newline.js',
        'test/language/statements/function/13.1-40-s.js',
        'test/language/statements/function/13.1-42-s.js',
        'test/language/statements/function/13.1-12-s.js',
        'test/language/statements/function/13.1-24-s.js',
        'test/language/statements/function/13.1-26-s.js',
        'test/language/statements/function/13.1-28-s.js',
        'test/language/statements/function/13.1-30-s.js',
        'test/language/statements/function/13.1-32-s.js',
        'test/language/statements/function/13.1-34-s.js',
        'test/language/statements/function/13.1-36-s.js',
        'test/language/statements/function/13.1-38-s.js',
        'test/language/statements/function/dflt-params-duplicates.js',
        'test/language/statements/function/use-strict-with-non-simple-param.js',
        'test/language/statements/generators/use-strict-with-non-simple-param.js',
        'test/language/statements/if/let-block-with-newline.js',
        'test/language/statements/if/let-identifier-with-newline.js',
        'test/language/statements/labeled/continue.js',
        'test/language/statements/labeled/let-block-with-newline.js',
        'test/language/statements/labeled/let-identifier-with-newline.js',
        'test/language/statements/switch/syntax/redeclaration/class-declaration-attempt-to-redeclare-with-var-declaration.js',
        'test/language/statements/switch/syntax/redeclaration/function-declaration-attempt-to-redeclare-with-var-declaration.js',
        'test/language/statements/switch/syntax/redeclaration/generator-declaration-attempt-to-redeclare-with-var-declaration.js',
        'test/language/statements/switch/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-class-declaration.js',
        'test/language/statements/switch/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-function-declaration.js',
        'test/language/statements/switch/syntax/redeclaration/var-declaration-attempt-to-redeclare-with-generator-declaration.js',
        'test/language/statements/try/early-catch-duplicates.js',
        'test/language/statements/try/early-catch-var.js',
        'test/language/statements/try/scope-catch-block-lex-close.js',
        'test/language/statements/while/let-array-with-newline.js',
        'test/language/statements/with/12.10.1-10-s.js',
        'test/language/statements/with/12.10.1-12-s.js',
        'test/language/statements/with/12.10.1-4-s.js',
        'test/language/statements/with/12.10.1-8-s.js',
        'test/language/statements/with/let-block-with-newline.js',
        'test/language/statements/with/let-identifier-with-newline.js',
        'test/language/statements/for-in/head-decl-expr.js',
        'test/language/statements/for-in/head-expr-expr.js',
        'test/language/statements/for-in/head-var-expr.js',
        'test/language/statements/for/let-array-with-newline.js',
        'test/language/statements/class/fields-private-typeof-init-err-contains-arguments.js',
        'test/language/statements/class/fields-typeof-init-err-contains-arguments.js',
        'test/language/statements/class/privatefieldget-typeerror*.js',
        'test/language/statements/class/privatefieldset-typeerror-1.js',
        'test/language/statements/class/privatefieldset-typeerror-3.js',
        'test/language/statements/class/privatefieldset-typeerror-5.js',
        'test/language/statements/class/privatefieldset-typeerror-3.js',
        'test/language/statements/class/privatefieldset-typeerror-3.js',
        'test/language/statements/class/privatefieldset-typeerror-3.js',
        'test/language/statements/class/privatefieldset-typeerror-3.js',
        'test/language/statements/class/privatefieldset-typeerror-3.js',
        'test/language/global-code/decl-lex-restricted-global.js',
        'test/language/global-code/decl-lex-restricted-global.js',
        'test/language/literals/regexp/u-dec-esc.js',
        'test/language/literals/regexp/u-invalid-class-escape.js',
        'test/language/literals/regexp/u-invalid*.js',
        'test/language/literals/regexp/u-unicode*.js',
        'test/language/literals/regexp/**/*.js',
        'test/language/literals/string/7.8.4-1-s.js',
        'test/language/literals/string/legacy-non-octal-escape-sequence-strict.js',
        'test/language/types/boolean/S8.3_A2.1.js',
        'test/language/types/boolean/S8.3_A2.2.js',
        'test/language/types/reference/S8.7.2_A1_T1.js',
        'test/language/types/reference/S8.7.2_A1_T2.js',
    ],
    parse: (file: string, source: string, opts: any) => {
        const cherowOpts = {
            impliedStrict: opts.type === 'strict',
            directives: true,
            next: true
        };
        if (opts.type === 'module') return parseModule(source, cherowOpts);
        return parseScript(source, cherowOpts);
    },
}));