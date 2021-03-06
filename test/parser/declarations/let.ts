import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Let', () => {

  // valid tests
const valids: Array < [string, string, Context, any] > = [
  ['"use strict"; let foo;', '"use strict"; let foo;', Context.OptionsRanges | Context.OptionsLoc, {
    "type": "Program",
    "sourceType": "script",
    "body": [
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "Literal",
                raw: null,
                "value": "use strict",
                "start": 0,
                "end": 12,
                "loc": {
                    "start": {
                        "line": 1,
                        "column": 0
                    },
                    "end": {
                        "line": 1,
                        "column": 12
                    }
                }
            },
            "directive": "use strict",
            "start": 0,
            "end": 13,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 0
                },
                "end": {
                    "line": 1,
                    "column": 13
                }
            }
        },
        {
            "type": "VariableDeclaration",
            "kind": "let",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "init": null,
                    "id": {
                        "type": "Identifier",
                        "name": "foo",
                        "start": 18,
                        "end": 21,
                        "loc": {
                            "start": {
                                "line": 1,
                                "column": 18
                            },
                            "end": {
                                "line": 1,
                                "column": 21
                            }
                        }
                    },
                    "start": 18,
                    "end": 21,
                    "loc": {
                        "start": {
                            "line": 1,
                            "column": 18
                        },
                        "end": {
                            "line": 1,
                            "column": 21
                        }
                    }
                }
            ],
            "start": 14,
            "end": 22,
            "loc": {
                "start": {
                    "line": 1,
                    "column": 14
                },
                "end": {
                    "line": 1,
                    "column": 22
                }
            }
        }
    ],
    "start": 0,
    "end": 22,
    "loc": {
        "start": {
            "line": 1,
            "column": 0
        },
        "end": {
            "line": 1,
            "column": 22
        }
    }
}],
  ['let foo;', 'let foo;', Context.OptionsRanges | Context.OptionsLoc, {
    'type': 'Program',
    'sourceType': 'script',
    'body': [
        {
            'type': 'VariableDeclaration',
            'kind': 'let',
            'declarations': [
                {
                    'type': 'VariableDeclarator',
                    'init': null,
                    'id': {
                        'type': 'Identifier',
                        'name': 'foo',
                        'start': 4,
                        'end': 7,
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 4
                            },
                            'end': {
                                'line': 1,
                                'column': 7
                            }
                        }
                    },
                    'start': 4,
                    'end': 7,
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 4
                        },
                        'end': {
                            'line': 1,
                            'column': 7
                        }
                    }
                }
            ],
            'start': 0,
            'end': 8,
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 1,
                    'column': 8
                }
            }
        }
    ],
    'start': 0,
    'end': 8,
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 1,
            'column': 8
        }
    }
}],
['let [x, ...[a, b]] = obj;', 'let [x, ...[a, b]] = obj;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'obj',
                      'start': 21,
                      'end': 24,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 21
                          },
                          'end': {
                              'line': 1,
                              'column': 24
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': 'x',
                              'start': 5,
                              'end': 6,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 6
                                  }
                              }
                          },
                          {
                              'type': 'RestElement',
                              'argument': {
                                  'type': 'ArrayPattern',
                                  'elements': [
                                      {
                                          'type': 'Identifier',
                                          'name': 'a',
                                          'start': 12,
                                          'end': 13,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 12
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 13
                                              }
                                          }
                                      },
                                      {
                                          'type': 'Identifier',
                                          'name': 'b',
                                          'start': 15,
                                          'end': 16,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 15
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 16
                                              }
                                          }
                                      }
                                  ],
                                  'start': 11,
                                  'end': 17,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 11
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 17
                                      }
                                  }
                              },
                              'start': 8,
                              'end': 17,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 8
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 17
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 18,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 18
                          }
                      }
                  },
                  'start': 4,
                  'end': 24,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 24
                      }
                  }
              }
          ],
          'start': 0,
          'end': 25,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 25
              }
          }
      }
  ],
  'start': 0,
  'end': 25,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 25
      }
  }
}],
['let x, {foo} = y;', 'let x, {foo} = y;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': null,
                  'id': {
                      'type': 'Identifier',
                      'name': 'x',
                      'start': 4,
                      'end': 5,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 5
                          }
                      }
                  },
                  'start': 4,
                  'end': 5,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 5
                      }
                  }
              },
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'y',
                      'start': 15,
                      'end': 16,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 15
                          },
                          'end': {
                              'line': 1,
                              'column': 16
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'foo',
                                  'start': 8,
                                  'end': 11,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 8
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 11
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'Identifier',
                                  'name': 'foo',
                                  'start': 8,
                                  'end': 11,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 8
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 11
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': true,
                              'start': 8,
                              'end': 11,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 8
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 11
                                  }
                              }
                          }
                      ],
                      'start': 7,
                      'end': 12,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 7
                          },
                          'end': {
                              'line': 1,
                              'column': 12
                          }
                      }
                  },
                  'start': 7,
                  'end': 16,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 7
                      },
                      'end': {
                          'line': 1,
                          'column': 16
                      }
                  }
              }
          ],
          'start': 0,
          'end': 17,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 17
              }
          }
      }
  ],
  'start': 0,
  'end': 17,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 17
      }
  }
}],
['let x = y, {foo} = z;', 'let x = y, {foo} = z;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'y',
                      'start': 8,
                      'end': 9,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 8
                          },
                          'end': {
                              'line': 1,
                              'column': 9
                          }
                      }
                  },
                  'id': {
                      'type': 'Identifier',
                      'name': 'x',
                      'start': 4,
                      'end': 5,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 5
                          }
                      }
                  },
                  'start': 4,
                  'end': 9,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 9
                      }
                  }
              },
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'z',
                      'start': 19,
                      'end': 20,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 19
                          },
                          'end': {
                              'line': 1,
                              'column': 20
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'foo',
                                  'start': 12,
                                  'end': 15,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 12
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 15
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'Identifier',
                                  'name': 'foo',
                                  'start': 12,
                                  'end': 15,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 12
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 15
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': true,
                              'start': 12,
                              'end': 15,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 12
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 15
                                  }
                              }
                          }
                      ],
                      'start': 11,
                      'end': 16,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 11
                          },
                          'end': {
                              'line': 1,
                              'column': 16
                          }
                      }
                  },
                  'start': 11,
                  'end': 20,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 11
                      },
                      'end': {
                          'line': 1,
                          'column': 20
                      }
                  }
              }
          ],
          'start': 0,
          'end': 21,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 21
              }
          }
      }
  ],
  'start': 0,
  'end': 21,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 21
      }
  }
}],
['let {} = x;', 'let {} = x;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'x',
                      'start': 9,
                      'end': 10,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 10
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [],
                      'start': 4,
                      'end': 6,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 6
                          }
                      }
                  },
                  'start': 4,
                  'end': 10,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 10
                      }
                  }
              }
          ],
          'start': 0,
          'end': 11,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 11
              }
          }
      }
  ],
  'start': 0,
  'end': 11,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 11
      }
  }
}],
['let { s: t = a(), u: v = b(), w: x = c(), y: z = d() } = { s: null, u: 0, w: false, y: "" };', 'let { s: t = a(), u: v = b(), w: x = c(), y: z = d() } = { s: null, u: 0, w: false, y: "" };', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ObjectExpression',
                      'properties': [
                          {
                              'type': 'Property',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 's',
                                  'start': 59,
                                  'end': 60,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 59
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 60
                                      }
                                  }
                              },
                              'value': {
                                  'type': 'Literal',
                                  'value': null,
                                  'start': 62,
                                  'end': 66,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 62
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 66
                                      }
                                  }
                              },
                              'kind': 'init',
                              'computed': false,
                              'method': false,
                              'shorthand': false,
                              'start': 59,
                              'end': 66,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 59
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 66
                                  }
                              }
                          },
                          {
                              'type': 'Property',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'u',
                                  'start': 68,
                                  'end': 69,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 68
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 69
                                      }
                                  }
                              },
                              'value': {
                                  'type': 'Literal',
                                  raw: null,
                                  'value': 0,
                                  'start': 71,
                                  'end': 72,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 71
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 72
                                      }
                                  }
                              },
                              'kind': 'init',
                              'computed': false,
                              'method': false,
                              'shorthand': false,
                              'start': 68,
                              'end': 72,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 68
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 72
                                  }
                              }
                          },
                          {
                              'type': 'Property',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'w',
                                  'start': 74,
                                  'end': 75,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 74
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 75
                                      }
                                  }
                              },
                              'value': {
                                  'type': 'Literal',
                                  'value': false,
                                  'start': 77,
                                  'end': 82,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 77
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 82
                                      }
                                  }
                              },
                              'kind': 'init',
                              'computed': false,
                              'method': false,
                              'shorthand': false,
                              'start': 74,
                              'end': 82,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 74
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 82
                                  }
                              }
                          },
                          {
                              'type': 'Property',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'y',
                                  'start': 84,
                                  'end': 85,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 84
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 85
                                      }
                                  }
                              },
                              'value': {
                                  'type': 'Literal',
                                  raw: null,
                                  'value': '',
                                  'start': 87,
                                  'end': 89,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 87
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 89
                                      }
                                  }
                              },
                              'kind': 'init',
                              'computed': false,
                              'method': false,
                              'shorthand': false,
                              'start': 84,
                              'end': 89,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 84
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 89
                                  }
                              }
                          }
                      ],
                      'start': 57,
                      'end': 91,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 57
                          },
                          'end': {
                              'line': 1,
                              'column': 91
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 's',
                                  'start': 6,
                                  'end': 7,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 6
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 7
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 't',
                                      'start': 9,
                                      'end': 10,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 9
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 10
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'CallExpression',
                                      'callee': {
                                          'type': 'Identifier',
                                          'name': 'a',
                                          'start': 13,
                                          'end': 14,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 13
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 14
                                              }
                                          }
                                      },
                                      'arguments': [],
                                      'start': 13,
                                      'end': 16,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 13
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 16
                                          }
                                      }
                                  },
                                  'start': 9,
                                  'end': 16,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 9
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 16
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': false,
                              'start': 6,
                              'end': 16,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 6
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 16
                                  }
                              }
                          },
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'u',
                                  'start': 18,
                                  'end': 19,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 18
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 19
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'v',
                                      'start': 21,
                                      'end': 22,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 21
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 22
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'CallExpression',
                                      'callee': {
                                          'type': 'Identifier',
                                          'name': 'b',
                                          'start': 25,
                                          'end': 26,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 25
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 26
                                              }
                                          }
                                      },
                                      'arguments': [],
                                      'start': 25,
                                      'end': 28,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 25
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 28
                                          }
                                      }
                                  },
                                  'start': 21,
                                  'end': 28,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 21
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 28
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': false,
                              'start': 18,
                              'end': 28,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 18
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 28
                                  }
                              }
                          },
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'w',
                                  'start': 30,
                                  'end': 31,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 30
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 31
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'x',
                                      'start': 33,
                                      'end': 34,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 33
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 34
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'CallExpression',
                                      'callee': {
                                          'type': 'Identifier',
                                          'name': 'c',
                                          'start': 37,
                                          'end': 38,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 37
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 38
                                              }
                                          }
                                      },
                                      'arguments': [],
                                      'start': 37,
                                      'end': 40,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 37
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 40
                                          }
                                      }
                                  },
                                  'start': 33,
                                  'end': 40,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 33
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 40
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': false,
                              'start': 30,
                              'end': 40,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 30
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 40
                                  }
                              }
                          },
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'y',
                                  'start': 42,
                                  'end': 43,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 42
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 43
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'z',
                                      'start': 45,
                                      'end': 46,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 45
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 46
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'CallExpression',
                                      'callee': {
                                          'type': 'Identifier',
                                          'name': 'd',
                                          'start': 49,
                                          'end': 50,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 49
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 50
                                              }
                                          }
                                      },
                                      'arguments': [],
                                      'start': 49,
                                      'end': 52,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 49
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 52
                                          }
                                      }
                                  },
                                  'start': 45,
                                  'end': 52,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 45
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 52
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': false,
                              'start': 42,
                              'end': 52,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 42
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 52
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 54,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 54
                          }
                      }
                  },
                  'start': 4,
                  'end': 91,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 91
                      }
                  }
              }
          ],
          'start': 0,
          'end': 92,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 92
              }
          }
      }
  ],
  'start': 0,
  'end': 92,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 92
      }
  }
}],
['let foo = bar\nlet zoo;', 'let foo = bar\nlet zoo;', Context.OptionsRanges | Context.OptionsLoc, {
    'body': [
      {
        'declarations': [
          {
            'end': 13,
            'id': {
              'end': 7,
              'loc': {
                'end': {
                  'column': 7,
                  'line': 1,
                },
                'start': {
                  'column': 4,
                  'line': 1,
                }
              },
              'name': 'foo',
              'start': 4,
              'type': 'Identifier',
            },
            'init': {
              'end': 13,
              'loc': {
                'end': {
                  'column': 13,
                  'line': 1,
               },
                'start': {
                  'column': 10,
                  'line': 1,
                },
              },
              'name': 'bar',
              'start': 10,
              'type': 'Identifier',
            },
            'loc': {
              'end': {
                'column': 13,
                'line': 1,
              },
              'start': {
                'column': 4,
                'line': 1,
              },
            },
            'start': 4,
            'type': 'VariableDeclarator',
          },
        ],
        'end': 13,
        'kind': 'let',
        'loc': {
          'end': {
           'column': 13,
            'line': 1,
          },
          'start': {
           'column': 0,
            'line': 1,
          },
        },
        'start': 0,
        'type': 'VariableDeclaration'
      },
      {
        'declarations': [
          {
            'end': 21,
            'id': {
              'end': 21,
              'loc': {
                'end': {
                  'column': 7,
                  'line': 2,
                },
                'start': {
                  'column': 4,
                  'line': 2,
                },
              },
              'name': 'zoo',
              'start': 18,
              'type': 'Identifier',
            },
            'init': null,
            'loc': {
             'end': {
                'column': 7,
                'line': 2,
              },
              'start': {
                'column': 4,
                'line': 2,
              },
            },
            'start': 18,
            'type': 'VariableDeclarator',
          },
        ],
        'end': 22,
        'kind': 'let',
        'loc': {
         'end': {
            'column': 8,
            'line': 2,
         },
          'start': {
            'column': 0,
            'line': 2,
          },
        },
        'start': 14,
        'type': 'VariableDeclaration',
      },
    ],
    'end': 22,
    'loc': {
      'end': {
        'column': 8,
        'line': 2,
     },
      'start': {
        'column': 0,
        'line': 1,
      },
    },
    'sourceType': 'script',
    'start': 0,
    'type': 'Program'
  }],
['let foo = bar, zoo = boo;', 'let foo = bar, zoo = boo;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'bar',
                      'start': 10,
                      'end': 13,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 10
                          },
                          'end': {
                              'line': 1,
                              'column': 13
                          }
                      }
                  },
                  'id': {
                      'type': 'Identifier',
                      'name': 'foo',
                      'start': 4,
                      'end': 7,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 7
                          }
                      }
                  },
                  'start': 4,
                  'end': 13,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 13
                      }
                  }
              },
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'boo',
                      'start': 21,
                      'end': 24,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 21
                          },
                          'end': {
                              'line': 1,
                              'column': 24
                          }
                      }
                  },
                  'id': {
                      'type': 'Identifier',
                      'name': 'zoo',
                      'start': 15,
                      'end': 18,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 15
                          },
                          'end': {
                              'line': 1,
                              'column': 18
                          }
                      }
                  },
                  'start': 15,
                  'end': 24,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 15
                      },
                      'end': {
                          'line': 1,
                          'column': 24
                      }
                  }
              }
          ],
          'start': 0,
          'end': 25,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 25
              }
          }
      }
  ],
  'start': 0,
  'end': 25,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 25
      }
  }
}],
['let [,] = x;', 'let [,] = x;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'x',
                      'start': 10,
                      'end': 11,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 10
                          },
                          'end': {
                              'line': 1,
                              'column': 11
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          null
                      ],
                      'start': 4,
                      'end': 7,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 7
                          }
                      }
                  },
                  'start': 4,
                  'end': 11,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 11
                      }
                  }
              }
          ],
          'start': 0,
          'end': 12,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 12
              }
          }
      }
  ],
  'start': 0,
  'end': 12,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 12
      }
  }
}],
['for (let [,,] in x);', 'for (let [,,] in x);', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'ForInStatement',
          'body': {
              'type': 'EmptyStatement',
              'start': 19,
              'end': 20,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 19
                  },
                  'end': {
                      'line': 1,
                      'column': 20
                  }
              }
          },
          'left': {
              'type': 'VariableDeclaration',
              'kind': 'let',
              'declarations': [
                  {
                      'type': 'VariableDeclarator',
                      'init': null,
                      'id': {
                          'type': 'ArrayPattern',
                          'elements': [
                              null,
                              null
                          ],
                          'start': 9,
                          'end': 13,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 9
                              },
                              'end': {
                                  'line': 1,
                                  'column': 13
                              }
                          }
                      },
                      'start': 9,
                      'end': 13,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 13
                          }
                      }
                  }
              ],
              'start': 5,
              'end': 13,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 5
                  },
                  'end': {
                      'line': 1,
                      'column': 13
                  }
              }
          },
          'right': {
              'type': 'Identifier',
              'name': 'x',
              'start': 17,
              'end': 18,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 17
                  },
                  'end': {
                      'line': 1,
                      'column': 18
                  }
              }
          },
          'start': 0,
          'end': 20,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 20
              }
          }
      }
  ],
  'start': 0,
  'end': 20,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 20
      }
  }
}],
['for (let [foo,,] in arr);', 'for (let [foo,,] in arr);', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'ForInStatement',
          'body': {
              'type': 'EmptyStatement',
              'start': 24,
              'end': 25,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 24
                  },
                  'end': {
                      'line': 1,
                      'column': 25
                  }
              }
          },
          'left': {
              'type': 'VariableDeclaration',
              'kind': 'let',
              'declarations': [
                  {
                      'type': 'VariableDeclarator',
                      'init': null,
                      'id': {
                          'type': 'ArrayPattern',
                          'elements': [
                              {
                                  'type': 'Identifier',
                                  'name': 'foo',
                                  'start': 10,
                                  'end': 13,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 10
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 13
                                      }
                                  }
                              },
                              null
                          ],
                          'start': 9,
                          'end': 16,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 9
                              },
                              'end': {
                                  'line': 1,
                                  'column': 16
                              }
                          }
                      },
                      'start': 9,
                      'end': 16,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 16
                          }
                      }
                  }
              ],
              'start': 5,
              'end': 16,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 5
                  },
                  'end': {
                      'line': 1,
                      'column': 16
                  }
              }
          },
          'right': {
              'type': 'Identifier',
              'name': 'arr',
              'start': 20,
              'end': 23,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 20
                  },
                  'end': {
                      'line': 1,
                      'column': 23
                  }
              }
          },
          'start': 0,
          'end': 25,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 25
              }
          }
      }
  ],
  'start': 0,
  'end': 25,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 25
      }
  }
}],
['for (let [foo=a, bar] in arr);', 'for (let [foo=a, bar] in arr);', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'ForInStatement',
          'body': {
              'type': 'EmptyStatement',
              'start': 29,
              'end': 30,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 29
                  },
                  'end': {
                      'line': 1,
                      'column': 30
                  }
              }
          },
          'left': {
              'type': 'VariableDeclaration',
              'kind': 'let',
              'declarations': [
                  {
                      'type': 'VariableDeclarator',
                      'init': null,
                      'id': {
                          'type': 'ArrayPattern',
                          'elements': [
                              {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'foo',
                                      'start': 10,
                                      'end': 13,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 10
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 13
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'Identifier',
                                      'name': 'a',
                                      'start': 14,
                                      'end': 15,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 14
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 15
                                          }
                                      }
                                  },
                                  'start': 10,
                                  'end': 15,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 10
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 15
                                      }
                                  }
                              },
                              {
                                  'type': 'Identifier',
                                  'name': 'bar',
                                  'start': 17,
                                  'end': 20,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 17
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 20
                                      }
                                  }
                              }
                          ],
                          'start': 9,
                          'end': 21,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 9
                              },
                              'end': {
                                  'line': 1,
                                  'column': 21
                              }
                          }
                      },
                      'start': 9,
                      'end': 21,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 21
                          }
                      }
                  }
              ],
              'start': 5,
              'end': 21,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 5
                  },
                  'end': {
                      'line': 1,
                      'column': 21
                  }
              }
          },
          'right': {
              'type': 'Identifier',
              'name': 'arr',
              'start': 25,
              'end': 28,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 25
                  },
                  'end': {
                      'line': 1,
                      'column': 28
                  }
              }
          },
          'start': 0,
          'end': 30,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 30
              }
          }
      }
  ],
  'start': 0,
  'end': 30,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 30
      }
  }
}],
['for (let [...foo] of obj);', 'for (let [...foo] of obj);', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'ForOfStatement',
          'body': {
              'type': 'EmptyStatement',
              'start': 25,
              'end': 26,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 25
                  },
                  'end': {
                      'line': 1,
                      'column': 26
                  }
              }
          },
          'left': {
              'type': 'VariableDeclaration',
              'kind': 'let',
              'declarations': [
                  {
                      'type': 'VariableDeclarator',
                      'init': null,
                      'id': {
                          'type': 'ArrayPattern',
                          'elements': [
                              {
                                  'type': 'RestElement',
                                  'argument': {
                                      'type': 'Identifier',
                                      'name': 'foo',
                                      'start': 13,
                                      'end': 16,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 13
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 16
                                          }
                                      }
                                  },
                                  'start': 10,
                                  'end': 16,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 10
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 16
                                      }
                                  }
                              }
                          ],
                          'start': 9,
                          'end': 17,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 9
                              },
                              'end': {
                                  'line': 1,
                                  'column': 17
                              }
                          }
                      },
                      'start': 9,
                      'end': 17,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 17
                          }
                      }
                  }
              ],
              'start': 5,
              'end': 17,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 5
                  },
                  'end': {
                      'line': 1,
                      'column': 17
                  }
              }
          },
          'right': {
              'type': 'Identifier',
              'name': 'obj',
              'start': 21,
              'end': 24,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 21
                  },
                  'end': {
                      'line': 1,
                      'column': 24
                  }
              }
          },
          'await': false,
          'start': 0,
          'end': 26,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 26
              }
          }
      }
  ],
  'start': 0,
  'end': 26,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 26
      }
  }
}],
['let {} = obj;', 'let {} = obj;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'obj',
                      'start': 9,
                      'end': 12,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 12
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [],
                      'start': 4,
                      'end': 6,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 6
                          }
                      }
                  },
                  'start': 4,
                  'end': 12,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 12
                      }
                  }
              }
          ],
          'start': 0,
          'end': 13,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 13
              }
          }
      }
  ],
  'start': 0,
  'end': 13,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 13
      }
  }
}],
['let {} = undefined;', 'let {} = undefined;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'undefined',
                      'start': 9,
                      'end': 18,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 18
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [],
                      'start': 4,
                      'end': 6,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 6
                          }
                      }
                  },
                  'start': 4,
                  'end': 18,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 18
                      }
                  }
              }
          ],
          'start': 0,
          'end': 19,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 19
              }
          }
      }
  ],
  'start': 0,
  'end': 19,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 19
      }
  }
}],
['let [, , ...x] = [1, 2];', 'let [, , ...x] = [1, 2];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 1,
                              'start': 18,
                              'end': 19,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 18
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 19
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 2,
                              'start': 21,
                              'end': 22,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 21
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 22
                                  }
                              }
                          }
                      ],
                      'start': 17,
                      'end': 23,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 17
                          },
                          'end': {
                              'line': 1,
                              'column': 23
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          null,
                          null,
                          {
                              'type': 'RestElement',
                              'argument': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 12,
                                  'end': 13,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 12
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 13
                                      }
                                  }
                              },
                              'start': 9,
                              'end': 13,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 9
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 13
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 14,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 14
                          }
                      }
                  },
                  'start': 4,
                  'end': 23,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 23
                      }
                  }
              }
          ],
          'start': 0,
          'end': 24,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 24
              }
          }
      }
  ],
  'start': 0,
  'end': 24,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 24
      }
  }
}],
['switch (true) { default: let x = 1; }', 'switch (true) { default: let x = 1; }', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'SwitchStatement',
          'discriminant': {
              'type': 'Literal',
              'value': true,
              'start': 8,
              'end': 12,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 8
                  },
                  'end': {
                      'line': 1,
                      'column': 12
                  }
              }
          },
          'cases': [
              {
                  'type': 'SwitchCase',
                  'test': null,
                  'consequent': [
                      {
                          'type': 'VariableDeclaration',
                          'kind': 'let',
                          'declarations': [
                              {
                                  'type': 'VariableDeclarator',
                                  'init': {
                                      'type': 'Literal',
                                      raw: null,
                                      'value': 1,
                                      'start': 33,
                                      'end': 34,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 33
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 34
                                          }
                                      }
                                  },
                                  'id': {
                                      'type': 'Identifier',
                                      'name': 'x',
                                      'start': 29,
                                      'end': 30,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 29
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 30
                                          }
                                      }
                                  },
                                  'start': 29,
                                  'end': 34,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 29
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 34
                                      }
                                  }
                              }
                          ],
                          'start': 25,
                          'end': 35,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 25
                              },
                              'end': {
                                  'line': 1,
                                  'column': 35
                              }
                          }
                      }
                  ],
                  'start': 16,
                  'end': 35,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 16
                      },
                      'end': {
                          'line': 1,
                          'column': 35
                      }
                  }
              }
          ],
          'start': 0,
          'end': 37,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 37
              }
          }
      }
  ],
  'start': 0,
  'end': 37,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 37
      }
  }
}],
['let {foo=3} = {};', 'let {foo=3} = {};', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ObjectExpression',
                      'properties': [],
                      'start': 14,
                      'end': 16,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 14
                          },
                          'end': {
                              'line': 1,
                              'column': 16
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'foo',
                                  'start': 5,
                                  'end': 8,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 5
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 8
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'foo',
                                      'start': 5,
                                      'end': 8,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 5
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 8
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'Literal',
                                      raw: null,
                                      'value': 3,
                                      'start': 9,
                                      'end': 10,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 9
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 10
                                          }
                                      }
                                  },
                                  'start': 5,
                                  'end': 10,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 5
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 10
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': true,
                              'start': 5,
                              'end': 10,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 10
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 11,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 11
                          }
                      }
                  },
                  'start': 4,
                  'end': 16,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 16
                      }
                  }
              }
          ],
          'start': 0,
          'end': 17,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 17
              }
          }
      }
  ],
  'start': 0,
  'end': 17,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 17
      }
  }
}],
['let {[foo("abc")]:x} = {abc:42};', 'let {[foo("abc")]:x} = {abc:42};', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ObjectExpression',
                      'properties': [
                          {
                              'type': 'Property',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'abc',
                                  'start': 24,
                                  'end': 27,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 24
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 27
                                      }
                                  }
                              },
                              'value': {
                                  'type': 'Literal',
                                  raw: null,
                                  'value': 42,
                                  'start': 28,
                                  'end': 30,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 28
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 30
                                      }
                                  }
                              },
                              'kind': 'init',
                              'computed': false,
                              'method': false,
                              'shorthand': false,
                              'start': 24,
                              'end': 30,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 24
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 30
                                  }
                              }
                          }
                      ],
                      'start': 23,
                      'end': 31,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 23
                          },
                          'end': {
                              'line': 1,
                              'column': 31
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'CallExpression',
                                  'callee': {
                                      'type': 'Identifier',
                                      'name': 'foo',
                                      'start': 6,
                                      'end': 9,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 6
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 9
                                          }
                                      }
                                  },
                                  'arguments': [
                                      {
                                          'type': 'Literal',
                                          raw: null,
                                          'value': 'abc',
                                          'start': 10,
                                          'end': 15,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 10
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 15
                                              }
                                          }
                                      }
                                  ],
                                  'start': 6,
                                  'end': 16,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 6
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 16
                                      }
                                  }
                              },
                              'computed': true,
                              'value': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 18,
                                  'end': 19,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 18
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 19
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': false,
                              'start': 5,
                              'end': 19,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 19
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 20,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 20
                          }
                      }
                  },
                  'start': 4,
                  'end': 31,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 31
                      }
                  }
              }
          ],
          'start': 0,
          'end': 32,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 32
              }
          }
      }
  ],
  'start': 0,
  'end': 32,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 32
      }
  }
}],
['var {[foo("abc")]:x} = {};', 'var {[foo("abc")]:x} = {};', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'var',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ObjectExpression',
                      'properties': [],
                      'start': 23,
                      'end': 25,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 23
                          },
                          'end': {
                              'line': 1,
                              'column': 25
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'CallExpression',
                                  'callee': {
                                      'type': 'Identifier',
                                      'name': 'foo',
                                      'start': 6,
                                      'end': 9,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 6
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 9
                                          }
                                      }
                                  },
                                  'arguments': [
                                      {
                                          'type': 'Literal',
                                          raw: null,
                                          'value': 'abc',
                                          'start': 10,
                                          'end': 15,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 10
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 15
                                              }
                                          }
                                      }
                                  ],
                                  'start': 6,
                                  'end': 16,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 6
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 16
                                      }
                                  }
                              },
                              'computed': true,
                              'value': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 18,
                                  'end': 19,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 18
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 19
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': false,
                              'start': 5,
                              'end': 19,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 19
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 20,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 20
                          }
                      }
                  },
                  'start': 4,
                  'end': 25,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 25
                      }
                  }
              }
          ],
          'start': 0,
          'end': 26,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 26
              }
          }
      }
  ],
  'start': 0,
  'end': 26,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 26
      }
  }
}],
['let [a, , c] = f();', 'let [a, , c] = f();', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'CallExpression',
                      'callee': {
                          'type': 'Identifier',
                          'name': 'f',
                          'start': 15,
                          'end': 16,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 15
                              },
                              'end': {
                                  'line': 1,
                                  'column': 16
                              }
                          }
                      },
                      'arguments': [],
                      'start': 15,
                      'end': 18,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 15
                          },
                          'end': {
                              'line': 1,
                              'column': 18
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': 'a',
                              'start': 5,
                              'end': 6,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 6
                                  }
                              }
                          },
                          null,
                          {
                              'type': 'Identifier',
                              'name': 'c',
                              'start': 10,
                              'end': 11,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 10
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 11
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 12,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 12
                          }
                      }
                  },
                  'start': 4,
                  'end': 18,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 18
                      }
                  }
              }
          ],
          'start': 0,
          'end': 19,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 19
              }
          }
      }
  ],
  'start': 0,
  'end': 19,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 19
      }
  }
}],
['let [a, , c, d] = f();', 'let [a, , c, d] = f();', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'CallExpression',
                      'callee': {
                          'type': 'Identifier',
                          'name': 'f',
                          'start': 18,
                          'end': 19,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 18
                              },
                              'end': {
                                  'line': 1,
                                  'column': 19
                              }
                          }
                      },
                      'arguments': [],
                      'start': 18,
                      'end': 21,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 18
                          },
                          'end': {
                              'line': 1,
                              'column': 21
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': 'a',
                              'start': 5,
                              'end': 6,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 6
                                  }
                              }
                          },
                          null,
                          {
                              'type': 'Identifier',
                              'name': 'c',
                              'start': 10,
                              'end': 11,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 10
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 11
                                  }
                              }
                          },
                          {
                              'type': 'Identifier',
                              'name': 'd',
                              'start': 13,
                              'end': 14,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 13
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 14
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 15,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 15
                          }
                      }
                  },
                  'start': 4,
                  'end': 21,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 21
                      }
                  }
              }
          ],
          'start': 0,
          'end': 22,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 22
              }
          }
      }
  ],
  'start': 0,
  'end': 22,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 22
      }
  }
}],
['let [a, b, ,] = f();', 'let [a, b, ,] = f();', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'CallExpression',
                      'callee': {
                          'type': 'Identifier',
                          'name': 'f',
                          'start': 16,
                          'end': 17,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 16
                              },
                              'end': {
                                  'line': 1,
                                  'column': 17
                              }
                          }
                      },
                      'arguments': [],
                      'start': 16,
                      'end': 19,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 16
                          },
                          'end': {
                              'line': 1,
                              'column': 19
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': 'a',
                              'start': 5,
                              'end': 6,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 6
                                  }
                              }
                          },
                          {
                              'type': 'Identifier',
                              'name': 'b',
                              'start': 8,
                              'end': 9,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 8
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 9
                                  }
                              }
                          },
                          null
                      ],
                      'start': 4,
                      'end': 13,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 13
                          }
                      }
                  },
                  'start': 4,
                  'end': 19,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 19
                      }
                  }
              }
          ],
          'start': 0,
          'end': 20,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 20
              }
          }
      }
  ],
  'start': 0,
  'end': 20,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 20
      }
  }
}],
['let [a,,b] = c', 'let [a,,b] = c', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'c',
                      'start': 13,
                      'end': 14,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 13
                          },
                          'end': {
                              'line': 1,
                              'column': 14
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': 'a',
                              'start': 5,
                              'end': 6,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 6
                                  }
                              }
                          },
                          null,
                          {
                              'type': 'Identifier',
                              'name': 'b',
                              'start': 8,
                              'end': 9,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 8
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 9
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 10,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 10
                          }
                      }
                  },
                  'start': 4,
                  'end': 14,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 14
                      }
                  }
              }
          ],
          'start': 0,
          'end': 14,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 14
              }
          }
      }
  ],
  'start': 0,
  'end': 14,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 14
      }
  }
}],
['let++;', 'let++;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'ExpressionStatement',
          'expression': {
              'type': 'UpdateExpression',
              'argument': {
                  'type': 'Identifier',
                  'name': 'let',
                  'start': 0,
                  'end': 3,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 0
                      },
                      'end': {
                          'line': 1,
                          'column': 3
                      }
                  }
              },
              'operator': '++',
              'prefix': false,
              'start': 0,
              'end': 5,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 0
                  },
                  'end': {
                      'line': 1,
                      'column': 5
                  }
              }
          },
          'start': 0,
          'end': 6,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 6
              }
          }
      }
  ],
  'start': 0,
  'end': 6,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 6
      }
  }
}],
['let {a: b} = ({});', 'let {a: b} = ({});', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ObjectExpression',
                      'properties': [],
                      'start': 14,
                      'end': 16,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 14
                          },
                          'end': {
                              'line': 1,
                              'column': 16
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'a',
                                  'start': 5,
                                  'end': 6,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 5
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 6
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'Identifier',
                                  'name': 'b',
                                  'start': 8,
                                  'end': 9,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 8
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 9
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': false,
                              'start': 5,
                              'end': 9,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 9
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 10,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 10
                          }
                      }
                  },
                  'start': 4,
                  'end': 17,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 17
                      }
                  }
              }
          ],
          'start': 0,
          'end': 18,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 18
              }
          }
      }
  ],
  'start': 0,
  'end': 18,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 18
      }
  }
}],
['let [_, x] = [];', 'let [_, x] = [];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [],
                      'start': 13,
                      'end': 15,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 13
                          },
                          'end': {
                              'line': 1,
                              'column': 15
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': '_',
                              'start': 5,
                              'end': 6,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 6
                                  }
                              }
                          },
                          {
                              'type': 'Identifier',
                              'name': 'x',
                              'start': 8,
                              'end': 9,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 8
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 9
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 10,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 10
                          }
                      }
                  },
                  'start': 4,
                  'end': 15,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 15
                      }
                  }
              }
          ],
          'start': 0,
          'end': 16,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 16
              }
          }
      }
  ],
  'start': 0,
  'end': 16,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 16
      }
  }
}],
['"use strict"; let [x, y, z] = [1, 2, 3];', '"use strict"; let [x, y, z] = [1, 2, 3];', Context.OptionsRanges | Context.OptionsLoc, {
  "type": "Program",
  "sourceType": "script",
  "body": [
      {
          "type": "ExpressionStatement",
          "expression": {
              "type": "Literal",
              raw: null,
              "value": "use strict",
              "start": 0,
              "end": 12,
              "loc": {
                  "start": {
                      "line": 1,
                      "column": 0
                  },
                  "end": {
                      "line": 1,
                      "column": 12
                  }
              }
          },
          "directive": "use strict",
          "start": 0,
          "end": 13,
          "loc": {
              "start": {
                  "line": 1,
                  "column": 0
              },
              "end": {
                  "line": 1,
                  "column": 13
              }
          }
      },
      {
          "type": "VariableDeclaration",
          "kind": "let",
          "declarations": [
              {
                  "type": "VariableDeclarator",
                  "init": {
                      "type": "ArrayExpression",
                      "elements": [
                          {
                              "type": "Literal",
                              raw: null,
                              "value": 1,
                              "start": 31,
                              "end": 32,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 31
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 32
                                  }
                              }
                          },
                          {
                              "type": "Literal",
                              raw: null,
                              "value": 2,
                              "start": 34,
                              "end": 35,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 34
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 35
                                  }
                              }
                          },
                          {
                              "type": "Literal",
                              raw: null,
                              "value": 3,
                              "start": 37,
                              "end": 38,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 37
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 38
                                  }
                              }
                          }
                      ],
                      "start": 30,
                      "end": 39,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 30
                          },
                          "end": {
                              "line": 1,
                              "column": 39
                          }
                      }
                  },
                  "id": {
                      "type": "ArrayPattern",
                      "elements": [
                          {
                              "type": "Identifier",
                              "name": "x",
                              "start": 19,
                              "end": 20,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 19
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 20
                                  }
                              }
                          },
                          {
                              "type": "Identifier",
                              "name": "y",
                              "start": 22,
                              "end": 23,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 22
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 23
                                  }
                              }
                          },
                          {
                              "type": "Identifier",
                              "name": "z",
                              "start": 25,
                              "end": 26,
                              "loc": {
                                  "start": {
                                      "line": 1,
                                      "column": 25
                                  },
                                  "end": {
                                      "line": 1,
                                      "column": 26
                                  }
                              }
                          }
                      ],
                      "start": 18,
                      "end": 27,
                      "loc": {
                          "start": {
                              "line": 1,
                              "column": 18
                          },
                          "end": {
                              "line": 1,
                              "column": 27
                          }
                      }
                  },
                  "start": 18,
                  "end": 39,
                  "loc": {
                      "start": {
                          "line": 1,
                          "column": 18
                      },
                      "end": {
                          "line": 1,
                          "column": 39
                      }
                  }
              }
          ],
          "start": 14,
          "end": 40,
          "loc": {
              "start": {
                  "line": 1,
                  "column": 14
              },
              "end": {
                  "line": 1,
                  "column": 40
              }
          }
      }
  ],
  "start": 0,
  "end": 40,
  "loc": {
      "start": {
          "line": 1,
          "column": 0
      },
      "end": {
          "line": 1,
          "column": 40
      }
  }
}],
['let [x, y, z] = [1, 2, 3];', 'let [x, y, z] = [1, 2, 3];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 1,
                              'start': 17,
                              'end': 18,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 17
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 18
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 2,
                              'start': 20,
                              'end': 21,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 20
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 21
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 3,
                              'start': 23,
                              'end': 24,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 23
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 24
                                  }
                              }
                          }
                      ],
                      'start': 16,
                      'end': 25,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 16
                          },
                          'end': {
                              'line': 1,
                              'column': 25
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': 'x',
                              'start': 5,
                              'end': 6,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 6
                                  }
                              }
                          },
                          {
                              'type': 'Identifier',
                              'name': 'y',
                              'start': 8,
                              'end': 9,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 8
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 9
                                  }
                              }
                          },
                          {
                              'type': 'Identifier',
                              'name': 'z',
                              'start': 11,
                              'end': 12,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 11
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 12
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 13,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 13
                          }
                      }
                  },
                  'start': 4,
                  'end': 25,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 25
                      }
                  }
              }
          ],
          'start': 0,
          'end': 26,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 26
              }
          }
      }
  ],
  'start': 0,
  'end': 26,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 26
      }
  }
}],
['switch (true) { default: let x; }', 'switch (true) { default: let x; }', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'SwitchStatement',
          'discriminant': {
              'type': 'Literal',
              'value': true,
              'start': 8,
              'end': 12,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 8
                  },
                  'end': {
                      'line': 1,
                      'column': 12
                  }
              }
          },
          'cases': [
              {
                  'type': 'SwitchCase',
                  'test': null,
                  'consequent': [
                      {
                          'type': 'VariableDeclaration',
                          'kind': 'let',
                          'declarations': [
                              {
                                  'type': 'VariableDeclarator',
                                  'init': null,
                                  'id': {
                                      'type': 'Identifier',
                                      'name': 'x',
                                      'start': 29,
                                      'end': 30,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 29
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 30
                                          }
                                      }
                                  },
                                  'start': 29,
                                  'end': 30,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 29
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 30
                                      }
                                  }
                              }
                          ],
                          'start': 25,
                          'end': 31,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 25
                              },
                              'end': {
                                  'line': 1,
                                  'column': 31
                              }
                          }
                      }
                  ],
                  'start': 16,
                  'end': 31,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 16
                      },
                      'end': {
                          'line': 1,
                          'column': 31
                      }
                  }
              }
          ],
          'start': 0,
          'end': 33,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 33
              }
          }
      }
  ],
  'start': 0,
  'end': 33,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 33
      }
  }
}],
['switch (true) { default: let x; }', 'switch (true) { default: let x; }', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'SwitchStatement',
          'discriminant': {
              'type': 'Literal',
              'value': true,
              'start': 8,
              'end': 12,
              'loc': {
                  'start': {
                      'line': 1,
                      'column': 8
                  },
                  'end': {
                      'line': 1,
                      'column': 12
                  }
              }
          },
          'cases': [
              {
                  'type': 'SwitchCase',
                  'test': null,
                  'consequent': [
                      {
                          'type': 'VariableDeclaration',
                          'kind': 'let',
                          'declarations': [
                              {
                                  'type': 'VariableDeclarator',
                                  'init': null,
                                  'id': {
                                      'type': 'Identifier',
                                      'name': 'x',
                                      'start': 29,
                                      'end': 30,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 29
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 30
                                          }
                                      }
                                  },
                                  'start': 29,
                                  'end': 30,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 29
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 30
                                      }
                                  }
                              }
                          ],
                          'start': 25,
                          'end': 31,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 25
                              },
                              'end': {
                                  'line': 1,
                                  'column': 31
                              }
                          }
                      }
                  ],
                  'start': 16,
                  'end': 31,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 16
                      },
                      'end': {
                          'line': 1,
                          'column': 31
                      }
                  }
              }
          ],
          'start': 0,
          'end': 33,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 33
              }
          }
      }
  ],
  'start': 0,
  'end': 33,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 33
      }
  }
}],
['let [[x]] = [null];', 'let [[x]] = [null];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [
                          {
                              'type': 'Literal',
                              'value': null,
                              'start': 13,
                              'end': 17,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 13
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 17
                                  }
                              }
                          }
                      ],
                      'start': 12,
                      'end': 18,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 12
                          },
                          'end': {
                              'line': 1,
                              'column': 18
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'ArrayPattern',
                              'elements': [
                                  {
                                      'type': 'Identifier',
                                      'name': 'x',
                                      'start': 6,
                                      'end': 7,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 6
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 7
                                          }
                                      }
                                  }
                              ],
                              'start': 5,
                              'end': 8,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 8
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 9,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 9
                          }
                      }
                  },
                  'start': 4,
                  'end': 18,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 18
                      }
                  }
              }
          ],
          'start': 0,
          'end': 19,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 19
              }
          }
      }
  ],
  'start': 0,
  'end': 19,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 19
      }
  }
}],
['let [cover = (function () {}), xCover = (0, function() {})] = [];', 'let [cover = (function () {}), xCover = (0, function() {})] = [];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [],
                      'start': 62,
                      'end': 64,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 62
                          },
                          'end': {
                              'line': 1,
                              'column': 64
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'AssignmentPattern',
                              'left': {
                                  'type': 'Identifier',
                                  'name': 'cover',
                                  'start': 5,
                                  'end': 10,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 5
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 10
                                      }
                                  }
                              },
                              'right': {
                                  'type': 'FunctionExpression',
                                  'params': [],
                                  'body': {
                                      'type': 'BlockStatement',
                                      'body': [],
                                      'start': 26,
                                      'end': 28,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 26
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 28
                                          }
                                      }
                                  },
                                  'async': false,
                                  'generator': false,
                                  'expression': false,
                                  'id': null,
                                  'start': 14,
                                  'end': 28,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 14
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 28
                                      }
                                  }
                              },
                              'start': 5,
                              'end': 29,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 29
                                  }
                              }
                          },
                          {
                              'type': 'AssignmentPattern',
                              'left': {
                                  'type': 'Identifier',
                                  'name': 'xCover',
                                  'start': 31,
                                  'end': 37,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 31
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 37
                                      }
                                  }
                              },
                              'right': {
                                  'type': 'SequenceExpression',
                                  'expressions': [
                                      {
                                          'type': 'Literal',
                                          raw: null,
                                          'value': 0,
                                          'start': 41,
                                          'end': 42,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 41
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 42
                                              }
                                          }
                                      },
                                      {
                                          'type': 'FunctionExpression',
                                          'params': [],
                                          'body': {
                                              'type': 'BlockStatement',
                                              'body': [],
                                              'start': 55,
                                              'end': 57,
                                              'loc': {
                                                  'start': {
                                                      'line': 1,
                                                      'column': 55
                                                  },
                                                  'end': {
                                                      'line': 1,
                                                      'column': 57
                                                  }
                                              }
                                          },
                                          'async': false,
                                          'generator': false,
                                          'expression': false,
                                          'id': null,
                                          'start': 44,
                                          'end': 57,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 44
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 57
                                              }
                                          }
                                      }
                                  ],
                                  'start': 41,
                                  'end': 57,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 41
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 57
                                      }
                                  }
                              },
                              'start': 31,
                              'end': 58,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 31
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 58
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 59,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 59
                          }
                      }
                  },
                  'start': 4,
                  'end': 64,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 64
                      }
                  }
              }
          ],
          'start': 0,
          'end': 65,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 65
              }
          }
      }
  ],
  'start': 0,
  'end': 65,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 65
      }
  }
}],
['let [x = 23] = [undefined];', 'let [x = 23] = [undefined];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [
                          {
                              'type': 'Identifier',
                              'name': 'undefined',
                              'start': 16,
                              'end': 25,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 16
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 25
                                  }
                              }
                          }
                      ],
                      'start': 15,
                      'end': 26,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 15
                          },
                          'end': {
                              'line': 1,
                              'column': 26
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'AssignmentPattern',
                              'left': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 5,
                                  'end': 6,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 5
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 6
                                      }
                                  }
                              },
                              'right': {
                                  'type': 'Literal',
                                  raw: null,
                                  'value': 23,
                                  'start': 9,
                                  'end': 11,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 9
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 11
                                      }
                                  }
                              },
                              'start': 5,
                              'end': 11,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 11
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 12,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 12
                          }
                      }
                  },
                  'start': 4,
                  'end': 26,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 26
                      }
                  }
              }
          ],
          'start': 0,
          'end': 27,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 27
              }
          }
      }
  ],
  'start': 0,
  'end': 27,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 27
      }
  }
}],
['let [...[]] = iter;', 'let [...[]] = iter;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Identifier',
                      'name': 'iter',
                      'start': 14,
                      'end': 18,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 14
                          },
                          'end': {
                              'line': 1,
                              'column': 18
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'RestElement',
                              'argument': {
                                  'type': 'ArrayPattern',
                                  'elements': [],
                                  'start': 8,
                                  'end': 10,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 8
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 10
                                      }
                                  }
                              },
                              'start': 5,
                              'end': 10,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 10
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 11,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 11
                          }
                      }
                  },
                  'start': 4,
                  'end': 18,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 18
                      }
                  }
              }
          ],
          'start': 0,
          'end': 19,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 19
              }
          }
      }
  ],
  'start': 0,
  'end': 19,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 19
      }
  }
}],
['let [ , , ...x] = [1, 2, 3, 4, 5];', 'let [ , , ...x] = [1, 2, 3, 4, 5];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 1,
                              'start': 19,
                              'end': 20,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 19
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 20
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 2,
                              'start': 22,
                              'end': 23,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 22
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 23
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 3,
                              'start': 25,
                              'end': 26,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 25
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 26
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 4,
                              'start': 28,
                              'end': 29,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 28
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 29
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 5,
                              'start': 31,
                              'end': 32,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 31
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 32
                                  }
                              }
                          }
                      ],
                      'start': 18,
                      'end': 33,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 18
                          },
                          'end': {
                              'line': 1,
                              'column': 33
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          null,
                          null,
                          {
                              'type': 'RestElement',
                              'argument': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 13,
                                  'end': 14,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 13
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 14
                                      }
                                  }
                              },
                              'start': 10,
                              'end': 14,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 10
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 14
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 15,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 15
                          }
                      }
                  },
                  'start': 4,
                  'end': 33,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 33
                      }
                  }
              }
          ],
          'start': 0,
          'end': 34,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 34
              }
          }
      }
  ],
  'start': 0,
  'end': 34,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 34
      }
  }
}],
['let [...x] = [1, 2, 3];', 'let [...x] = [1, 2, 3];', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ArrayExpression',
                      'elements': [
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 1,
                              'start': 14,
                              'end': 15,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 14
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 15
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 2,
                              'start': 17,
                              'end': 18,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 17
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 18
                                  }
                              }
                          },
                          {
                              'type': 'Literal',
                              raw: null,
                              'value': 3,
                              'start': 20,
                              'end': 21,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 20
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 21
                                  }
                              }
                          }
                      ],
                      'start': 13,
                      'end': 22,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 13
                          },
                          'end': {
                              'line': 1,
                              'column': 22
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          {
                              'type': 'RestElement',
                              'argument': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 8,
                                  'end': 9,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 8
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 9
                                      }
                                  }
                              },
                              'start': 5,
                              'end': 9,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 5
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 9
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 10,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 10
                          }
                      }
                  },
                  'start': 4,
                  'end': 22,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 22
                      }
                  }
              }
          ],
          'start': 0,
          'end': 23,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 23
              }
          }
      }
  ],
  'start': 0,
  'end': 23,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 23
      }
  }
}],
['let {} = null;', 'let {} = null;', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'Literal',
                      'value': null,
                      'start': 9,
                      'end': 13,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 9
                          },
                          'end': {
                              'line': 1,
                              'column': 13
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [],
                      'start': 4,
                      'end': 6,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 6
                          }
                      }
                  },
                  'start': 4,
                  'end': 13,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 13
                      }
                  }
              }
          ],
          'start': 0,
          'end': 14,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 14
              }
          }
      }
  ],
  'start': 0,
  'end': 14,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 14
      }
  }
}],
['let { cover = (function () {}), xCover = (0, function() {})  } = {};', 'let { cover = (function () {}), xCover = (0, function() {})  } = {};', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ObjectExpression',
                      'properties': [],
                      'start': 65,
                      'end': 67,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 65
                          },
                          'end': {
                              'line': 1,
                              'column': 67
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'cover',
                                  'start': 6,
                                  'end': 11,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 6
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 11
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'cover',
                                      'start': 6,
                                      'end': 11,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 6
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 11
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'FunctionExpression',
                                      'params': [],
                                      'body': {
                                          'type': 'BlockStatement',
                                          'body': [],
                                          'start': 27,
                                          'end': 29,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 27
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 29
                                              }
                                          }
                                      },
                                      'async': false,
                                      'generator': false,
                                      'expression': false,
                                      'id': null,
                                      'start': 15,
                                      'end': 29,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 15
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 29
                                          }
                                      }
                                  },
                                  'start': 6,
                                  'end': 30,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 6
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 30
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': true,
                              'start': 6,
                              'end': 30,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 6
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 30
                                  }
                              }
                          },
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'xCover',
                                  'start': 32,
                                  'end': 38,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 32
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 38
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'xCover',
                                      'start': 32,
                                      'end': 38,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 32
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 38
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'SequenceExpression',
                                      'expressions': [
                                          {
                                              'type': 'Literal',
                                              raw: null,
                                              'value': 0,
                                              'start': 42,
                                              'end': 43,
                                              'loc': {
                                                  'start': {
                                                      'line': 1,
                                                      'column': 42
                                                  },
                                                  'end': {
                                                      'line': 1,
                                                      'column': 43
                                                  }
                                              }
                                          },
                                          {
                                              'type': 'FunctionExpression',
                                              'params': [],
                                              'body': {
                                                  'type': 'BlockStatement',
                                                  'body': [],
                                                  'start': 56,
                                                  'end': 58,
                                                  'loc': {
                                                      'start': {
                                                          'line': 1,
                                                          'column': 56
                                                      },
                                                      'end': {
                                                          'line': 1,
                                                          'column': 58
                                                      }
                                                  }
                                              },
                                              'async': false,
                                              'generator': false,
                                              'expression': false,
                                              'id': null,
                                              'start': 45,
                                              'end': 58,
                                              'loc': {
                                                  'start': {
                                                      'line': 1,
                                                      'column': 45
                                                  },
                                                  'end': {
                                                      'line': 1,
                                                      'column': 58
                                                  }
                                              }
                                          }
                                      ],
                                      'start': 42,
                                      'end': 58,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 42
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 58
                                          }
                                      }
                                  },
                                  'start': 32,
                                  'end': 59,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 32
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 59
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': true,
                              'start': 32,
                              'end': 59,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 32
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 59
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 62,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 62
                          }
                      }
                  },
                  'start': 4,
                  'end': 67,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 67
                      }
                  }
              }
          ],
          'start': 0,
          'end': 68,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 68
              }
          }
      }
  ],
  'start': 0,
  'end': 68,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 68
      }
  }
}],
[` let async = function(a){return {bind: "someMethodButIUseString"}};
async(function (req, res) { }).bind;`, ` let async = function(a){return {bind: "someMethodButIUseString"}};
async(function (req, res) { }).bind;`, Context.Empty, {
    "body": [
      {
        "declarations": [
          {
            "id": {
              "name": "async",
              "type": "Identifier",
            },
            "init": {
              "async": false,
              "body": {
                "body": [
                  {
                    "argument": {
                      "properties": [
                        {
                          "computed": false,
                          "key": {
                            "name": "bind",
                            "type": "Identifier",
                          },
                          "kind": "init",
                          "method": false,
                          "shorthand": false,
                          "type": "Property",
                          "value": {
                         "raw": null,
                            "type": "Literal",
                            "value": "someMethodButIUseString",
                          }
                        }
                      ],
                      "type": "ObjectExpression",
                    },
                    "type": "ReturnStatement"
                  }
                ],
                "type": "BlockStatement"
              },
              "expression": false,
              "generator": false,
              "id": null,
              "params": [
                {
                  "name": "a",
                  "type": "Identifier",
                },
              ],
              "type": "FunctionExpression"
            },
            "type": "VariableDeclarator"
          }
        ],
        "kind": "let",
        "type": "VariableDeclaration"
     },
      {
        "expression": {
          "computed": false,
          "object": {
            "arguments": [
              {
                "async": false,
                "body": {
                  "body": [],
                  "type": "BlockStatement",
                },
                "expression": false,
                "generator": false,
                "id": null,
                "params": [
                  {
                    "name": "req",
                    "type": "Identifier",
                  },
                  {
                    "name": "res",
                    "type": "Identifier",
                  },
                ],
                "type": "FunctionExpression",
              },
            ],
            "callee": {
              "name": "async",
              "type": "Identifier",
            },
            "type": "CallExpression",
          },
          "property": {
            "name": "bind",
            "type": "Identifier",
          },
          "type": "MemberExpression"
        },
        "type": "ExpressionStatement"
      }
    ],
    "sourceType": "script",
    "type": "Program"
  }],
['let { x = thrower() } = {};', 'let { x = thrower() } = {};', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'ObjectExpression',
                      'properties': [],
                      'start': 24,
                      'end': 26,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 24
                          },
                          'end': {
                              'line': 1,
                              'column': 26
                          }
                      }
                  },
                  'id': {
                      'type': 'ObjectPattern',
                      'properties': [
                          {
                              'type': 'Property',
                              'kind': 'init',
                              'key': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 6,
                                  'end': 7,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 6
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 7
                                      }
                                  }
                              },
                              'computed': false,
                              'value': {
                                  'type': 'AssignmentPattern',
                                  'left': {
                                      'type': 'Identifier',
                                      'name': 'x',
                                      'start': 6,
                                      'end': 7,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 6
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 7
                                          }
                                      }
                                  },
                                  'right': {
                                      'type': 'CallExpression',
                                      'callee': {
                                          'type': 'Identifier',
                                          'name': 'thrower',
                                          'start': 10,
                                          'end': 17,
                                          'loc': {
                                              'start': {
                                                  'line': 1,
                                                  'column': 10
                                              },
                                              'end': {
                                                  'line': 1,
                                                  'column': 17
                                              }
                                          }
                                      },
                                      'arguments': [],
                                      'start': 10,
                                      'end': 19,
                                      'loc': {
                                          'start': {
                                              'line': 1,
                                              'column': 10
                                          },
                                          'end': {
                                              'line': 1,
                                              'column': 19
                                          }
                                      }
                                  },
                                  'start': 6,
                                  'end': 19,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 6
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 19
                                      }
                                  }
                              },
                              'method': false,
                              'shorthand': true,
                              'start': 6,
                              'end': 19,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 6
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 19
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 21,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 21
                          }
                      }
                  },
                  'start': 4,
                  'end': 26,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 26
                      }
                  }
              }
          ],
          'start': 0,
          'end': 27,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 27
              }
          }
      }
  ],
  'start': 0,
  'end': 27,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 27
      }
  }
}],
['let [, ...x] = function*() {}();', 'let [, ...x] = function*() {}();', Context.OptionsRanges | Context.OptionsLoc, {
  'type': 'Program',
  'sourceType': 'script',
  'body': [
      {
          'type': 'VariableDeclaration',
          'kind': 'let',
          'declarations': [
              {
                  'type': 'VariableDeclarator',
                  'init': {
                      'type': 'CallExpression',
                      'callee': {
                          'type': 'FunctionExpression',
                          'params': [],
                          'body': {
                              'type': 'BlockStatement',
                              'body': [],
                              'start': 27,
                              'end': 29,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 27
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 29
                                  }
                              }
                          },
                          'async': false,
                          'generator': true,
                          'expression': false,
                          'id': null,
                          'start': 15,
                          'end': 29,
                          'loc': {
                              'start': {
                                  'line': 1,
                                  'column': 15
                              },
                              'end': {
                                  'line': 1,
                                  'column': 29
                              }
                          }
                      },
                      'arguments': [],
                      'start': 15,
                      'end': 31,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 15
                          },
                          'end': {
                              'line': 1,
                              'column': 31
                          }
                      }
                  },
                  'id': {
                      'type': 'ArrayPattern',
                      'elements': [
                          null,
                          {
                              'type': 'RestElement',
                              'argument': {
                                  'type': 'Identifier',
                                  'name': 'x',
                                  'start': 10,
                                  'end': 11,
                                  'loc': {
                                      'start': {
                                          'line': 1,
                                          'column': 10
                                      },
                                      'end': {
                                          'line': 1,
                                          'column': 11
                                      }
                                  }
                              },
                              'start': 7,
                              'end': 11,
                              'loc': {
                                  'start': {
                                      'line': 1,
                                      'column': 7
                                  },
                                  'end': {
                                      'line': 1,
                                      'column': 11
                                  }
                              }
                          }
                      ],
                      'start': 4,
                      'end': 12,
                      'loc': {
                          'start': {
                              'line': 1,
                              'column': 4
                          },
                          'end': {
                              'line': 1,
                              'column': 12
                          }
                      }
                  },
                  'start': 4,
                  'end': 31,
                  'loc': {
                      'start': {
                          'line': 1,
                          'column': 4
                      },
                      'end': {
                          'line': 1,
                          'column': 31
                      }
                  }
              }
          ],
          'start': 0,
          'end': 32,
          'loc': {
              'start': {
                  'line': 1,
                  'column': 0
              },
              'end': {
                  'line': 1,
                  'column': 32
              }
          }
      }
  ],
  'start': 0,
  'end': 32,
  'loc': {
      'start': {
          'line': 1,
          'column': 0
      },
      'end': {
          'line': 1,
          'column': 32
      }
  }
}],
];

const invalids: Array < [string, string, Context, any] > = [
  ['let [...[ x ] = []] = [];', 'let [...[ x ] = []] = [];', Context.Empty, {}],
  ['let [...x = []] = [];', 'let [...x = []] = [];', Context.Empty, {}],
  ['let [...{ x } = []] = [];', 'let [...{ x } = []] = [];', Context.Empty, {}],
  ['let [...[x], y] = [1, 2, 3];', 'let [...[x], y] = [1, 2, 3];', Context.Empty, {}],
  ['let [...x, y] = [1, 2, 3];', 'let [...x, y] = [1, 2, 3];', Context.Empty, {}],
  ['let [...{ x }, y] = [1, 2, 3];', 'let [...{ x }, y] = [1, 2, 3];', Context.Empty, {}],
  ['for (;false;) let x = 1;', 'for (;false;) let x = 1;', Context.Empty, {}],
  ['do let x; while (false)', 'do let x; while (false)', Context.Empty, {}],
  ['if (true) {} else let x;', 'if (true) {} else let x;', Context.Empty, {}],
  ['if (true) let x;', 'if (true) let x;', Context.Empty, {}],
  ['label: let x;', 'label: let x;', Context.Empty, {}],
  ['while (false) let x;', 'while (false) let x;', Context.Empty, {}],
  ['label: let x;', 'label: let x;', Context.Empty, {}],
  ['let let', 'let let', Context.Empty, {}],
  ['let {a: o.a} = obj;', 'let {a: o.a} = obj;', Context.Empty, {}],
  ['let default', 'let default', Context.Empty, {}],
  ['do let x = 1; while (false)', 'do let x = 1; while (false)', Context.Empty, {}],
  ['if (true) {} else let x = 1;', 'if (true) {} else let x = 1;', Context.Empty, {}],
  ['if (true) let x = 1;', 'if (true) let x = 1;', Context.Empty, {}],
  ['for (let {x} = a, y of obj);', 'for (let {x} = a, y of obj);', Context.Empty, {}],
  ['for (let {x} = a, obj of obj2);', 'for (let {x} = a, obj of obj2);', Context.Empty, {}],
  ['for (let x, {y} of obj);', 'for (let x, {y} of obj);', Context.Empty, {}],
  ['for (let {x}, {y} of z);', 'for (let {x}, {y} of z);', Context.Empty, {}],
  ['export let {,x} = obj;', 'export let {,x} = obj;', Context.Strict | Context.Module, {}],
  ['export let {,} = obj;', 'export let {,} = obj;', Context.Strict | Context.Module, {}],
];

fail('Declarations - Let (failures)', invalids);
pass('Declarations - Let (pass)', valids);

});
