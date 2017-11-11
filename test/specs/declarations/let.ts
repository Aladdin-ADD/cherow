import { parseScript, parseModule } from '../../../src/cherow';
import * as chai from 'chai';

const expect = chai.expect;

describe('Declarations - Let', () => {
  
      it('should fail on predeclared "Infinity"', () => {
          expect(() => {
              parseScript('let Infinity');
          }).to.throw();
      });
  
      it('should fail on let let| split across two lines', () => {
          expect(() => {
              parseScript(`let
          let = foo;`);
          }).to.throw();
      });
  
      it('should fail on escaped let', () => {
          expect(() => {
              parseScript(`l\\u0065t`);
          }).to.throw();
      });
  
      it('should disallow let as LHS expression in strict mode', () => {
          expect(() => {
              parseScript(`"use strict"; for (let in o) { }`);
          }).to.throw();
      });
  
      it('should disallow let as LHS expression in strict mode', () => {
          expect(() => {
              parseScript(`for (let let in {}) { }`);
          }).to.throw();
      });
  
      it('should fail on let in array pattern without initializer', () => {
          expect(() => {
              parseScript('let [x]');
          }).to.throw();
      });
  
      it('should fail on let in object pattern without initializer', () => {
          expect(() => {
              parseScript('let [x]');
          }).to.throw();
      });
  
      it('should parse "let [a,,b] = c"', () => {
          expect(parseScript(`let [a,,b] = c`, {
              ranges: true,
              raw: true,
              next: true,
              locations: true
          })).to.eql({
              "type": "Program",
              "start": 0,
              "end": 14,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 14
                  }
              },
              "body": [{
                  "type": "VariableDeclaration",
                  "start": 0,
                  "end": 14,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 14
                      }
                  },
                  "declarations": [{
                      "type": "VariableDeclarator",
                      "start": 4,
                      "end": 14,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 4
                          },
                          "end": {
                              "line": 1,
                              "column": 14
                          }
                      },
                      "id": {
                          "type": "ArrayPattern",
                          "start": 4,
                          "end": 10,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 4
                              },
                              "end": {
                                  "line": 1,
                                  "column": 10
                              }
                          },
                          "elements": [{
                                  "type": "Identifier",
                                  "start": 5,
                                  "end": 6,
                                  "loc": {
                                      "start": {
                                          "line": 1,
                                          "column": 5
                                      },
                                      "end": {
                                          "line": 1,
                                          "column": 6
                                      }
                                  },
                                  "name": "a"
                              },
                              null,
                              {
                                  "type": "Identifier",
                                  "start": 8,
                                  "end": 9,
                                  "loc": {
                                      "start": {
                                          "line": 1,
                                          "column": 8
                                      },
                                      "end": {
                                          "line": 1,
                                          "column": 9
                                      }
                                  },
                                  "name": "b"
                              }
                          ]
                      },
                      "init": {
                          "type": "Identifier",
                          "start": 13,
                          "end": 14,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 13
                              },
                              "end": {
                                  "line": 1,
                                  "column": 14
                              }
                          },
                          "name": "c"
                      }
                  }],
                  "kind": "let"
              }],
              "sourceType": "script"
          });
      });
  
      it('should parse "let {a: b} = ({});"', () => {
          expect(parseScript(`let {a: b} = ({});`, {
              ranges: true,
              raw: true,
              next: true,
              locations: true
          })).to.eql({
              "type": "Program",
              "start": 0,
              "end": 18,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 18
                  }
              },
              "body": [{
                  "type": "VariableDeclaration",
                  "start": 0,
                  "end": 18,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 18
                      }
                  },
                  "declarations": [{
                      "type": "VariableDeclarator",
                      "start": 4,
                      "end": 17,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 4
                          },
                          "end": {
                              "line": 1,
                              "column": 17
                          }
                      },
                      "id": {
                          "type": "ObjectPattern",
                          "start": 4,
                          "end": 10,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 4
                              },
                              "end": {
                                  "line": 1,
                                  "column": 10
                              }
                          },
                          "properties": [{
                              "type": "Property",
                              "start": 5,
                              "end": 9,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 5
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 9
                                  }
                              },
                              "method": false,
                              "shorthand": false,
                              "computed": false,
                              "key": {
                                  "type": "Identifier",
                                  "start": 5,
                                  "end": 6,
                                  "loc": {
                                      "start": {
                                          "line": 1,
                                          "column": 5
                                      },
                                      "end": {
                                          "line": 1,
                                          "column": 6
                                      }
                                  },
                                  "name": "a"
                              },
                              "value": {
                                  "type": "Identifier",
                                  "start": 8,
                                  "end": 9,
                                  "loc": {
                                      "start": {
                                          "line": 1,
                                          "column": 8
                                      },
                                      "end": {
                                          "line": 1,
                                          "column": 9
                                      }
                                  },
                                  "name": "b"
                              },
                              "kind": "init"
                          }]
                      },
                      "init": {
                          "type": "ObjectExpression",
                          "start": 14,
                          "end": 16,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 14
                              },
                              "end": {
                                  "line": 1,
                                  "column": 16
                              }
                          },
                          "properties": []
                      }
                  }],
                  "kind": "let"
              }],
              "sourceType": "script"
          });
      });
  
      it('should parse let instanceof', () => {
          expect(parseScript('let instanceof Foo', {
              raw: true,
              ranges: true,
              locations: true
          })).to.eql({
              "type": "Program",
              "start": 0,
              "end": 18,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 18
                  }
              },
              "body": [{
                  "type": "ExpressionStatement",
                  "start": 0,
                  "end": 18,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 18
                      }
                  },
                  "expression": {
                      "type": "BinaryExpression",
                      "start": 0,
                      "end": 18,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 0
                          },
                          "end": {
                              "line": 1,
                              "column": 18
                          }
                      },
                      "left": {
                          "type": "Identifier",
                          "start": 0,
                          "end": 3,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 0
                              },
                              "end": {
                                  "line": 1,
                                  "column": 3
                              }
                          },
                          "name": "let"
                      },
                      "operator": "instanceof",
                      "right": {
                          "type": "Identifier",
                          "start": 15,
                          "end": 18,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 15
                              },
                              "end": {
                                  "line": 1,
                                  "column": 18
                              }
                          },
                          "name": "Foo"
                      }
                  }
              }],
              "sourceType": "script"
          });
      });
  
      it('should parse let as async keyword in module code', () => {
          expect(parseModule('let async = ""', {
              raw: true,
              ranges: true,
              locations: true
          })).to.eql({
              "type": "Program",
              "start": 0,
              "end": 14,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 14
                  }
              },
              "body": [{
                  "type": "VariableDeclaration",
                  "start": 0,
                  "end": 14,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 14
                      }
                  },
                  "declarations": [{
                      "type": "VariableDeclarator",
                      "start": 4,
                      "end": 14,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 4
                          },
                          "end": {
                              "line": 1,
                              "column": 14
                          }
                      },
                      "id": {
                          "type": "Identifier",
                          "start": 4,
                          "end": 9,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 4
                              },
                              "end": {
                                  "line": 1,
                                  "column": 9
                              }
                          },
                          "name": "async"
                      },
                      "init": {
                          "type": "Literal",
                          "start": 12,
                          "end": 14,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 12
                              },
                              "end": {
                                  "line": 1,
                                  "column": 14
                              }
                          },
                          "value": "",
                          "raw": "\"\""
                      }
                  }],
                  "kind": "let"
              }],
              "sourceType": "module"
          });
      });
  
      it('should parse function name arrow', () => {
          expect(parseScript('let arrow = () => {};', {
              raw: true,
              ranges: true,
              locations: true
          })).to.eql({
              "type": "Program",
              "start": 0,
              "end": 21,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 21
                  }
              },
              "body": [{
                  "type": "VariableDeclaration",
                  "start": 0,
                  "end": 21,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 21
                      }
                  },
                  "declarations": [{
                      "type": "VariableDeclarator",
                      "start": 4,
                      "end": 20,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 4
                          },
                          "end": {
                              "line": 1,
                              "column": 20
                          }
                      },
                      "id": {
                          "type": "Identifier",
                          "start": 4,
                          "end": 9,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 4
                              },
                              "end": {
                                  "line": 1,
                                  "column": 9
                              }
                          },
                          "name": "arrow"
                      },
                      "init": {
                          "type": "ArrowFunctionExpression",
                          "start": 12,
                          "end": 20,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 12
                              },
                              "end": {
                                  "line": 1,
                                  "column": 20
                              }
                          },
                          "id": null,
                          "generator": false,
                          "expression": false,
                          "async": false,
                          "params": [],
                          "body": {
                              "type": "BlockStatement",
                              "start": 18,
                              "end": 20,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 18
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 20
                                  }
                              },
                              "body": []
                          }
                      }
                  }],
                  "kind": "let"
              }],
              "sourceType": "script"
          });
      });
  
      it('should parse function name class', () => {
          expect(parseScript('let xCls2 = class { static name() {} };', {
              raw: true,
              ranges: true,
              locations: true
          })).to.eql({
              "type": "Program",
              "start": 0,
              "end": 39,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 39
                  }
              },
              "body": [{
                  "type": "VariableDeclaration",
                  "start": 0,
                  "end": 39,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 39
                      }
                  },
                  "declarations": [{
                      "type": "VariableDeclarator",
                      "start": 4,
                      "end": 38,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 4
                          },
                          "end": {
                              "line": 1,
                              "column": 38
                          }
                      },
                      "id": {
                          "type": "Identifier",
                          "start": 4,
                          "end": 9,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 4
                              },
                              "end": {
                                  "line": 1,
                                  "column": 9
                              }
                          },
                          "name": "xCls2"
                      },
                      "init": {
                          "type": "ClassExpression",
                          "start": 12,
                          "end": 38,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 12
                              },
                              "end": {
                                  "line": 1,
                                  "column": 38
                              }
                          },
                          "id": null,
                          "superClass": null,
                          "body": {
                              "type": "ClassBody",
                              "start": 18,
                              "end": 38,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 18
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 38
                                  }
                              },
                              "body": [{
                                  "type": "MethodDefinition",
                                  "start": 20,
                                  "end": 36,
                                  "loc": {
                                      "start": {
                                          "line": 1,
                                          "column": 20
                                      },
                                      "end": {
                                          "line": 1,
                                          "column": 36
                                      }
                                  },
                                  "computed": false,
                                  "key": {
                                      "type": "Identifier",
                                      "start": 27,
                                      "end": 31,
                                      "loc": {
                                          "start": {
                                              "line": 1,
                                              "column": 27
                                          },
                                          "end": {
                                              "line": 1,
                                              "column": 31
                                          }
                                      },
                                      "name": "name"
                                  },
                                  "static": true,
                                  "kind": "method",
                                  "value": {
                                      "type": "FunctionExpression",
                                      "start": 31,
                                      "end": 36,
                                      "loc": {
                                          "start": {
                                              "line": 1,
                                              "column": 31
                                          },
                                          "end": {
                                              "line": 1,
                                              "column": 36
                                          }
                                      },
                                      "id": null,
                                      "generator": false,
                                      "expression": false,
                                      "async": false,
                                      "params": [],
                                      "body": {
                                          "type": "BlockStatement",
                                          "start": 34,
                                          "end": 36,
                                          "loc": {
                                              "start": {
                                                  "line": 1,
                                                  "column": 34
                                              },
                                              "end": {
                                                  "line": 1,
                                                  "column": 36
                                              }
                                          },
                                          "body": []
                                      }
                                  }
                              }]
                          }
                      }
                  }],
                  "kind": "let"
              }],
              "sourceType": "script"
          });
      });
  
      it('should parse function name generator', () => {
          expect(parseScript('let gen = function*() {};', {
              raw: true,
              ranges: true,
              locations: true
          })).to.eql({
              "type": "Program",
              "start": 0,
              "end": 25,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 25
                  }
              },
              "body": [{
                  "type": "VariableDeclaration",
                  "start": 0,
                  "end": 25,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 0
                      },
                      "end": {
                          "line": 1,
                          "column": 25
                      }
                  },
                  "declarations": [{
                      "type": "VariableDeclarator",
                      "start": 4,
                      "end": 24,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 4
                          },
                          "end": {
                              "line": 1,
                              "column": 24
                          }
                      },
                      "id": {
                          "type": "Identifier",
                          "start": 4,
                          "end": 7,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 4
                              },
                              "end": {
                                  "line": 1,
                                  "column": 7
                              }
                          },
                          "name": "gen"
                      },
                      "init": {
                          "type": "FunctionExpression",
                          "start": 10,
                          "end": 24,
                          "loc": {
                              "start": {
                                  "line": 1,
                                  "column": 10
                              },
                              "end": {
                                  "line": 1,
                                  "column": 24
                              }
                          },
                          "id": null,
                          "generator": true,
                          "expression": false,
                          "async": false,
                          "params": [],
                          "body": {
                              "type": "BlockStatement",
                              "start": 22,
                              "end": 24,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 22
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 24
                                  }
                              },
                              "body": []
                          }
                      }
                  }],
                  "kind": "let"
              }],
              "sourceType": "script"
          });
      });
  });