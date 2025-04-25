/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/de_garden.json`.
 */
export type DeGarden = {
  "address": "J8vn4oXKvsJyyRPcEscXcPkdpcEz4EoPhjM7ebVcvhqi",
  "metadata": {
    "name": "deGarden",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addHost",
      "discriminator": [
        191,
        4,
        97,
        225,
        59,
        238,
        72,
        213
      ],
      "accounts": [
        {
          "name": "host",
          "writable": true,
          "signer": true
        },
        {
          "name": "sensorHostState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82,
                  95,
                  72,
                  79,
                  83,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "host"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "hostTokenAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "host"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "buyTokens",
      "discriminator": [
        189,
        21,
        230,
        133,
        247,
        2,
        110,
        42
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  71,
                  76,
                  79,
                  66,
                  65,
                  76,
                  95,
                  83,
                  84,
                  65,
                  84,
                  69
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "buyerTokenAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositCollateral",
      "discriminator": [
        156,
        131,
        142,
        116,
        146,
        247,
        162,
        120
      ],
      "accounts": [
        {
          "name": "host",
          "writable": true,
          "signer": true
        },
        {
          "name": "sensorHostState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82,
                  95,
                  72,
                  79,
                  83,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "host"
              }
            ]
          }
        },
        {
          "name": "sensor",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "sensorHostState"
              },
              {
                "kind": "arg",
                "path": "sensorId"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "hostTokenAta",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "host"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "vaultTokenAta",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "sensorId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeGlobalState",
      "discriminator": [
        232,
        254,
        209,
        244,
        123,
        89,
        154,
        207
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "program",
          "address": "J8vn4oXKvsJyyRPcEscXcPkdpcEz4EoPhjM7ebVcvhqi"
        },
        {
          "name": "programData"
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  71,
                  76,
                  79,
                  66,
                  65,
                  76,
                  95,
                  83,
                  84,
                  65,
                  84,
                  69
                ]
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "vaultTokenAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokenPriceInLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "paySensorData",
      "discriminator": [
        135,
        184,
        250,
        16,
        122,
        176,
        162,
        219
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "payerTokenAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "payer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "hostTokenAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "host"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "sensorHost",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82,
                  95,
                  72,
                  79,
                  83,
                  84
                ]
              },
              {
                "kind": "arg",
                "path": "host"
              }
            ]
          }
        },
        {
          "name": "sensor",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "sensorHost"
              },
              {
                "kind": "arg",
                "path": "sensorId"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "host",
          "type": "pubkey"
        },
        {
          "name": "sensorId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "registerSensor",
      "discriminator": [
        130,
        120,
        3,
        101,
        228,
        123,
        18,
        95
      ],
      "accounts": [
        {
          "name": "host",
          "writable": true,
          "signer": true
        },
        {
          "name": "sensorHostState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82,
                  95,
                  72,
                  79,
                  83,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "host"
              }
            ]
          }
        },
        {
          "name": "sensor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "sensorHostState"
              },
              {
                "kind": "account",
                "path": "sensor_host_state.sensor_counter",
                "account": "sensorHost"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "latitude",
          "type": "i64"
        },
        {
          "name": "longitude",
          "type": "i64"
        }
      ]
    },
    {
      "name": "sellTokens",
      "discriminator": [
        114,
        242,
        25,
        12,
        62,
        126,
        92,
        2
      ],
      "accounts": [
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  71,
                  76,
                  79,
                  66,
                  65,
                  76,
                  95,
                  83,
                  84,
                  65,
                  84,
                  69
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "sellerTokenAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "slashCollateral",
      "discriminator": [
        48,
        90,
        11,
        43,
        179,
        65,
        184,
        4
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "program",
          "address": "J8vn4oXKvsJyyRPcEscXcPkdpcEz4EoPhjM7ebVcvhqi"
        },
        {
          "name": "programData"
        },
        {
          "name": "sensorHostState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82,
                  95,
                  72,
                  79,
                  83,
                  84
                ]
              },
              {
                "kind": "arg",
                "path": "host"
              }
            ]
          }
        },
        {
          "name": "sensor",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "sensorHostState"
              },
              {
                "kind": "arg",
                "path": "sensorId"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "vaultTokenAta",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "hostTokenAta",
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "host"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "host",
          "type": "pubkey"
        },
        {
          "name": "sensorId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawCollateral",
      "discriminator": [
        115,
        135,
        168,
        106,
        139,
        214,
        138,
        150
      ],
      "accounts": [
        {
          "name": "host",
          "writable": true,
          "signer": true
        },
        {
          "name": "sensorHostState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82,
                  95,
                  72,
                  79,
                  83,
                  84
                ]
              },
              {
                "kind": "account",
                "path": "host"
              }
            ]
          }
        },
        {
          "name": "sensor",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  69,
                  78,
                  83,
                  79,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "sensorHostState"
              },
              {
                "kind": "arg",
                "path": "sensorId"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  79,
                  75,
                  69,
                  78,
                  95,
                  77,
                  73,
                  78,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "hostTokenAta",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "host"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  86,
                  65,
                  85,
                  76,
                  84
                ]
              }
            ]
          }
        },
        {
          "name": "vaultTokenAta",
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "sensorId",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "discriminator": [
        163,
        46,
        74,
        168,
        216,
        123,
        133,
        98
      ]
    },
    {
      "name": "sensor",
      "discriminator": [
        134,
        105,
        67,
        177,
        57,
        239,
        163,
        212
      ]
    },
    {
      "name": "sensorHost",
      "discriminator": [
        225,
        44,
        62,
        31,
        215,
        19,
        232,
        99
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    }
  ],
  "events": [
    {
      "name": "paySensorDataRequest",
      "discriminator": [
        160,
        101,
        53,
        183,
        50,
        139,
        232,
        84
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "wrongSensorStatus",
      "msg": "Wrong sensor status"
    },
    {
      "code": 6001,
      "name": "overflow",
      "msg": "overflow"
    }
  ],
  "types": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenPriceInLamports",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "paySensorDataRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sensorId",
            "type": "u64"
          },
          {
            "name": "payer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "sensor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "host",
            "type": "pubkey"
          },
          {
            "name": "latitude",
            "type": "i64"
          },
          {
            "name": "longitude",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "sensorStatus"
              }
            }
          },
          {
            "name": "lastCollateralizedAt",
            "type": "i64"
          },
          {
            "name": "lastUncollateralizedAt",
            "type": "i64"
          },
          {
            "name": "lastSlashedAt",
            "type": "i64"
          },
          {
            "name": "totalIncome",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "sensorHost",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "sensorCounter",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "sensorStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "uncollateralized"
          },
          {
            "name": "collateralized"
          },
          {
            "name": "slashed"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "feeSeed",
      "type": "string",
      "value": "\"FEE\""
    },
    {
      "name": "globalStateSeed",
      "type": "string",
      "value": "\"GLOBAL_STATE\""
    },
    {
      "name": "mintDecimals",
      "type": "u8",
      "value": "9"
    },
    {
      "name": "sensorCollateralAmount",
      "type": "u64",
      "value": "900"
    },
    {
      "name": "sensorDataRequestCost",
      "type": "u64",
      "value": "10000000"
    },
    {
      "name": "sensorHostSeed",
      "type": "string",
      "value": "\"SENSOR_HOST\""
    },
    {
      "name": "sensorSeed",
      "type": "string",
      "value": "\"SENSOR\""
    },
    {
      "name": "tokenMintSeed",
      "type": "string",
      "value": "\"TOKEN_MINT\""
    },
    {
      "name": "vaultSeed",
      "type": "string",
      "value": "\"VAULT\""
    }
  ]
};
