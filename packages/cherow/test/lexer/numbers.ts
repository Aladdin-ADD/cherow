import * as t from 'assert';
import { nextToken } from '../../src/lexer/scan';
import { createParserObject } from '../../src/parser/parser';
import { Context } from '../../src/common';
import { Token, tokenDesc } from '../../src/token';

describe('Lexer - Numbers', () => {

  describe("Pass", () => {

      function pass(name: string, opts: any): any {
          function test(name: string, context: Context): any {
              it(name, () => {
                  if (opts.strict !== true) {
                      const parser = createParserObject(opts.source, undefined);

                      t.deepEqual({
                          token: nextToken(parser, context),
                          value: parser.tokenValue,
                          line: parser.line,
                          column: parser.column,
                      }, {
                          token: opts.token,
                          value: opts.value,
                          line: opts.line,
                          column: opts.column,
                      });
                  }
              });
          }
          test(`${name}`, Context.OptionsRaw);
      }

      function fail(name: string, context: Context, opts: any): any {
          it(name, () => {
              const parser = createParserObject(opts.source, undefined);
              t.throws(() => {
                  nextToken(parser, context)
              });
          });
      }

      fail('should fail "00o0"', Context.Empty, {
          source: '0o8'
      })

      fail('should fail "1eTYU+1"', Context.Empty, {
          source: '1eTYU+1'
      })

      fail('Strict Mode - octal extension (00) is forbidden in strict mode', Context.Strict | Context.Module, {
          source: '00_7_8_3_2'
      })

      fail('Strict Mode - octal extension (01) is forbidden in strict mode', Context.Strict | Context.Module, {
          source: '01'
      })


      fail('HexIntegerLiteral :: 0(x/X) is incorrect', Context.Strict | Context.Module, {
          source: '0x'
      })

      fail('HexIntegerLiteral :: 0(x/X) is incorrect', Context.Strict | Context.Module, {
          source: '0X'
      })

      fail('0xG is incorrect', Context.Strict | Context.Module, {
          source: '0xG'
      })

      fail('NumericLiteralSeparator may not appear adjacent to another', Context.Strict | Context.Module, {
          source: '1__0123456789'
      })

      fail('NumericLiteralSeparator may not appear adjacent to another', Context.Empty, {
          source: '1__0123456789'
      })

      fail('NumericLiteralSeparator may not be the last digit character of a BinaryIntegerLiteral', Context.Empty, {
          source: '0b0_'
      })


       fail('Binary-integer-literal-like sequence containing an invalid digit', Context.Empty, {
         source: '0b2'
       })

       // fail('Octal-integer-literal-like sequence containing an invalid digit', Context.Empty, {
       //  source: '0o2'
      // })

       fail('Octal-integer-literal-like sequence containing numeric separator', Context.Empty, {
         source: '0o_'
       })

      //fail('Binary-integer-literal-like sequence with a leading 0', Context.Empty, {
        //  source: '00b0'
      //})

      fail('Binary-integer-literal-like sequence without any digits', Context.Empty, {
          source: '0b'
      })

       fail('NonOctalDecimalIntegerLiteral is not enabled in strict mode code', Context.Strict | Context.Module, {
         source: '08'
       })

      fail('Octal-integer-literal-like sequence without any digits', Context.Empty, {
          source: '0o'
      })

      fail('LegacyOctalIntegerLiteral is not enabled in strict mode code', Context.Strict, {
          source: '00'
      })

      // fail('Octal-integer-literal-like sequence with a leading 0', Context.Empty, {
      //   source: '00o0'
      // })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '123_'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '123_'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '12___3'
      })

      fail('should fail on private name followed by space', Context.Empty, {
        source: '0_'
      })

      fail('should fail on private name followed by space', Context.Empty, {
        source: '0_123'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '12______3'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '12_3______'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '123._1234'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '123a'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '123_'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '123_'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0.333n'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '.333n'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0xA______3'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0xA______'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0xA__'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0x__A'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0__xA'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0O123__45670'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0_O12345670'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0O12_345670_'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0O12345__670'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0_O12345_670'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '.00_00____'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '.00____00'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '.00__00'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '.0000__'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0b0____1__'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0_000__'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0_b01'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0b0__1'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0b01__'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '0.1E+__100__'
      })

      fail('should fail on private name followed by space', Context.Empty, {
          source: '32e__32'
      })

      fail(' NumericLiteralSeparator may not be the appear adjacent to `0o` | `0O` in a OctalIntegerLiteral', Context.Empty, {
          source: '0o_1'
          })

          pass("scans '.0000", {
              source: ".0000",
              "value": 0,
              raw: "",
              token: Token.NumericLiteral,
              line: 1,
              column: 5,
          });

          pass("scans '7890", {
              source: "7890",
              value: 7890,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 4,
          });

          pass("scans '123456789_0", {
              source: "123456789_0",
              "value": 1234567890,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 11,
          });

          pass("scans '.5", {
              source: ".5",
              value: 0.5,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 2,
          });

          pass("scans '0o01_0", {
              source: "0o01_0",
              value: 8,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 6,
          });

          pass("scans '.5_1", {
              source: ".5_12",
              value: 0.512,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 5,
          });

          pass("scans '0b01_00", {
              source: "0b01_00",
              value: 4,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 7,
          });

          pass("scans '0b01_00", {
              source: "0b01_00",
              value: 4,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 7,
          });

          pass("scans '1.0e-10_0", {
              source: "1.0e-10_0",
              value: 1e-100,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 9,
          });

          pass("scans '5_12n", {
              source: "5_12n",
              value: 512,
              raw: "''",
              token: Token.BigInt,
              line: 1,
              column: 5,
          });

          pass("scans '2.3", {
              source: "2.3",
              value: 2.3,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });

          pass("scans '1234567890.0987654321", {
              source: "1234567890.0987654321",
              value: 1234567890.0987654321,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 21,
          });

          pass("scans '12_345_67890.0987_654321", {
              source: "12_345_67890.0987_654321",
              value: 1234567890.0987654,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 24,
          });

          pass("scans '32e32", {
              source: "32e32",
              raw: "3.2e+33",
              "value": 3.2e+33,
              token: Token.NumericLiteral,
              line: 1,
              column: 5,
          });
          pass("scans '1E-100", {
              source: "1E-100",
              value: 1e-100,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 6,
          });

          pass("scans '.1e+100", {
              source: ".1e+100",
              value: 1e+99,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 7,
          });

          pass("scans '0.1E+100", {
              source: "0.1E+100",
              value: 1e+99,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 8,
          });

          pass("scans '0o12345670", {
              source: "0o12345670",
              value: 2739128,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 10
          });

          pass("scans '0x34", {
              source: "0x34",
              value: 52,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });

          pass("scans '0b01", {
              source: "0b01",
              value: 1,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 4,
          });



          pass("scans '0009", {
              source: "0009",
              value: 9,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 4,
          });

          pass("scans '0009.444", {
              source: "0009.444",
              value: 9.444,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 8,
          });

          pass("scans '043", {
              source: "043",
              "value": 35,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });


          pass("scans '087", {
              source: "087",
              value: 87,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });

          pass("scans '000", {
              source: "000",
              value: 0,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });

          pass("scans '000", {
              source: "000",
              value: 0,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });

          pass("scans '00", {
              source: "00",
              value: 0,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 2,
          });

          pass("scans '0123", {
              source: "0123",
              value: 83,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 4,
          });

          pass("scans '0123789", {
              source: "0123789",
              value: 123789,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 7,
          });

          pass("scans '0xD", {
              source: "0xD",
              value: 13,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 2,
          });

          pass("scans '0o4", {
              source: "0o4",
              value: 4,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });

          pass("scans '0o12", {
              source: "0o12",
              value: 10,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 4,
          });

          pass("scans '0o1_2", {
              source: "0o1_2",
              value: 10,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 5,
          });

          pass("scans '0x67", {
              source: "0x67",
              value: 103,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 3,
          });

          pass("scans '0x67", {
              source: "0x6_7",
              value: 103,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 4,
          });

          pass("scans '0O12345670", {
              source: "0O12345670",
              value: 2739128,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 10,
          });

          pass("scans '0xA", {
              source: "1",
              value: 1,
              raw: "''",
              token: Token.NumericLiteral,
              line: 1,
              column: 1,
          });

          pass("scans '0xAn", {
              source: "0xAn",
              value: 10,
              raw: "''",
              token: Token.BigInt,
              line: 1,
              column: 3,
          });
      });
  });
