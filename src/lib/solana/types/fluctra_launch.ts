// Auto-generated from IDL
import type { Idl } from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';

export interface FluctraLaunch extends Idl {
  version: '0.1.0';
  name: 'fluctra_launch';
  instructions: [
  {
    "name": "initializePool",
    "discriminator": [175, 175, 109, 31, 225, 117, 123, 245],
    "accounts": [
      {
        "name": "creator",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "poolAccount",
        "isMut": true,
        "isSigner": false,
        "pda": {
          "seeds": [
            {
              "kind": "const",
              "value": [112, 111, 111, 108]
            },
            {
              "kind": "account",
              "path": "creator.key"
            },
            {
              "kind": "account",
              "path": "tokenMint.key"
            }
          ]
        }
      },
      {
        "name": "creatorTokenAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "poolTokenAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "feeRecipientWallet",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "tokenMint",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "associatedTokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "rent",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "fixedListingFeeAmount",
        "type": "u64"
      },
      {
        "name": "totalTokensForSale",
        "type": "u64"
      },
      {
        "name": "discountRateBasisPoints",
        "type": "u16"
      },
      {
        "name": "durationSeconds",
        "type": "u64"
      },
      {
        "name": "bump",
        "type": "u8"
      }
    ]
  },
  {
    "name": "purchaseTokens",
    "discriminator": [183, 18, 70, 156, 148, 109, 161, 34],
    "accounts": [
      {
        "name": "poolAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "poolTokenAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "buyer",
        "isMut": true,
        "isSigner": true
      },
      {
        "name": "buyerInfo",
        "isMut": true,
        "isSigner": false,
        "pda": {
          "seeds": [
            {
              "kind": "const",
              "value": [98, 117, 121, 101, 114]
            },
            {
              "kind": "account",
              "path": "buyer.key"
            },
            {
              "kind": "account",
              "path": "poolAccount.key"
            }
          ]
        }
      },
      {
        "name": "buyerTokenAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "creator",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "treasury",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      },
      {
        "name": "systemProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": [
      {
        "name": "tokenAmount",
        "type": "u64"
      }
    ]
  },
  {
    "name": "closePool",
    "discriminator": [227, 50, 10, 44, 110, 142, 72, 138],
    "accounts": [
      {
        "name": "poolAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "creator",
        "isMut": false,
        "isSigner": true
      }
    ],
    "args": []
  },
  {
    "name": "withdrawRemainingTokens",
    "discriminator": [182, 14, 104, 104, 116, 104, 84, 251],
    "accounts": [
      {
        "name": "poolAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "creator",
        "isMut": false,
        "isSigner": true
      },
      {
        "name": "poolTokenAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "creatorTokenAccount",
        "isMut": true,
        "isSigner": false
      },
      {
        "name": "tokenProgram",
        "isMut": false,
        "isSigner": false
      }
    ],
    "args": []
  }
];
  accounts: [
  {
    "name": "poolAccount",
    "discriminator": [112, 111, 111, 108, 65, 99, 99, 116],
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "tokenMint",
          "type": "publicKey"
        },
        {
          "name": "poolTokenAccount",
          "type": "publicKey"
        },
        {
          "name": "totalTokensForSale",
          "type": "u64"
        },
        {
          "name": "tokensSold",
          "type": "u64"
        },
        {
          "name": "discountRateBasisPoints",
          "type": "u16"
        },
        {
          "name": "durationSeconds",
          "type": "u64"
        },
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "isActive",
          "type": "bool"
        },
        {
          "name": "platformFeeBasisPoints",
          "type": "u16"
        },
        {
          "name": "treasury",
          "type": "publicKey"
        },
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "buyers",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    }
  },
  {
    "name": "buyerInfo",
    "discriminator": [98, 117, 121, 101, 114, 73, 110, 102],
    "type": {
      "kind": "struct",
      "fields": [
        {
          "name": "buyer",
          "type": "publicKey"
        },
        {
          "name": "pool",
          "type": "publicKey"
        },
        {
          "name": "tokensPurchased",
          "type": "u64"
        },
        {
          "name": "totalPayment",
          "type": "u64"
        },
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  }
];
  types: undefined;
  errors: [
  {
    "code": 6000,
    "name": "Unauthorized",
    "msg": "Unauthorized access"
  },
  {
    "code": 6001,
    "name": "PoolStillActive",
    "msg": "Pool is still active"
  },
  {
    "code": 6002,
    "name": "NoTokensToWithdraw",
    "msg": "No tokens available for withdrawal"
  },
  {
    "code": 6003,
    "name": "InsufficientFee",
    "msg": "Insufficient fee provided"
  },
  {
    "code": 6004,
    "name": "TokenTransferFailed",
    "msg": "Token transfer failed"
  },
  {
    "code": 6005,
    "name": "InvalidDiscountRate",
    "msg": "Invalid discount rate (must be between 0-10000 basis points)"
  },
  {
    "code": 6006,
    "name": "PoolAlreadyInitialized",
    "msg": "Pool already initialized"
  },
  {
    "code": 6007,
    "name": "ZeroTokenAmount",
    "msg": "Token amount must be greater than zero"
  },
  {
    "code": 6008,
    "name": "InvalidDuration",
    "msg": "Duration must be greater than zero"
  },
  {
    "code": 6009,
    "name": "PoolInactive",
    "msg": "Pool is not active"
  },
  {
    "code": 6010,
    "name": "PoolEnded",
    "msg": "Pool has ended"
  },
  {
    "code": 6011,
    "name": "ExceedsMaxTokens",
    "msg": "Exceeds maximum token amount"
  },
  {
    "code": 6012,
    "name": "InsufficientPayment",
    "msg": "Insufficient payment"
  },
  {
    "code": 6013,
    "name": "InvalidTreasury",
    "msg": "Invalid treasury account"
  }
];
  metadata: {
    address: "FL1ctrAL111111111111111111111111111111111",
    name: "fluctra_launch",
    version: "0.1.0",
    spec: "0.1.0"
  };
}

export type FluctraLaunchProgram = Program<FluctraLaunch>;
