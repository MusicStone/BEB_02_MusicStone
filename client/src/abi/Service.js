const service_abi = [
  {
    constant: false,
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawalDeposit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_account",
        type: "address",
      },
    ],
    name: "getArtistSfts",
    outputs: [
      {
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_token",
        type: "address",
      },
    ],
    name: "setToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawalDistribution",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "sellToken",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_address",
        type: "address",
      },
      {
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "getUserMarketOpenedBalances",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_account",
        type: "address",
      },
      {
        name: "_token_id",
        type: "uint256",
      },
    ],
    name: "getUserSFTs",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "mstoken",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "withdraw",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "depositMSToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_seller",
        type: "address",
      },
    ],
    name: "getItemsBySeller",
    outputs: [
      {
        components: [
          {
            name: "itemId",
            type: "uint256",
          },
          {
            name: "tokenId",
            type: "uint256",
          },
          {
            name: "seller",
            type: "address",
          },
          {
            name: "unit_price",
            type: "uint256",
          },
          {
            name: "total_amount",
            type: "uint256",
          },
          {
            name: "remaining_amount",
            type: "uint256",
          },
          {
            name: "isOpened",
            type: "bool",
          },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "mssft",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "cancelItem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "marketItemId",
        type: "uint256",
      },
    ],
    name: "getMarketItemById",
    outputs: [
      {
        components: [
          {
            name: "itemId",
            type: "uint256",
          },
          {
            name: "tokenId",
            type: "uint256",
          },
          {
            name: "seller",
            type: "address",
          },
          {
            name: "unit_price",
            type: "uint256",
          },
          {
            name: "total_amount",
            type: "uint256",
          },
          {
            name: "remaining_amount",
            type: "uint256",
          },
          {
            name: "isOpened",
            type: "bool",
          },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_account",
        type: "address[]",
      },
    ],
    name: "getUsersAllSFTs",
    outputs: [
      {
        components: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "balance",
            type: "uint256",
          },
          {
            name: "totalSupply",
            type: "uint256",
          },
        ],
        name: "",
        type: "tuple[][]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_id",
        type: "uint256",
      },
    ],
    name: "totalSFTSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getAllowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "addMinter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceMinter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "uint256[]",
      },
      {
        name: "",
        type: "uint256[]",
      },
      {
        name: "",
        type: "bytes",
      },
    ],
    name: "onKIP37BatchReceived",
    outputs: [
      {
        name: "",
        type: "bytes4",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getUnsoldItems",
    outputs: [
      {
        components: [
          {
            name: "itemId",
            type: "uint256",
          },
          {
            name: "tokenId",
            type: "uint256",
          },
          {
            name: "seller",
            type: "address",
          },
          {
            name: "unit_price",
            type: "uint256",
          },
          {
            name: "total_amount",
            type: "uint256",
          },
          {
            name: "remaining_amount",
            type: "uint256",
          },
          {
            name: "isOpened",
            type: "bool",
          },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "buyToken",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_address",
        type: "address",
      },
    ],
    name: "getUserDistribution",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "account",
        type: "address",
      },
    ],
    name: "isMinter",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mintSFT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_address",
        type: "address[]",
      },
      {
        name: "_deduct_token",
        type: "uint256[]",
      },
    ],
    name: "deduction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_sft_token",
        type: "uint256[]",
      },
      {
        name: "_distribute_amount",
        type: "uint256[]",
      },
    ],
    name: "distribution",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_address",
        type: "address",
      },
    ],
    name: "getUserDeposit",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_account",
        type: "address",
      },
    ],
    name: "getUserAllSFTs",
    outputs: [
      {
        components: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "balance",
            type: "uint256",
          },
          {
            name: "totalSupply",
            type: "uint256",
          },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_token",
        type: "address",
      },
    ],
    name: "setSFT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getTokenRatio",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "itemId",
        type: "uint256",
      },
      {
        name: "buy_amount",
        type: "uint256",
      },
    ],
    name: "purchaseItem",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_address",
        type: "address",
      },
      {
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "getUserCanSellBalances",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_newTokenRatio",
        type: "uint256",
      },
    ],
    name: "setTokenRatio",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_id",
        type: "uint256",
      },
    ],
    name: "getSftCreator",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "uint256",
      },
      {
        name: "",
        type: "uint256",
      },
      {
        name: "",
        type: "bytes",
      },
    ],
    name: "onKIP37Received",
    outputs: [
      {
        name: "",
        type: "bytes4",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "unit_price",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "addItemToMarket",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: true,
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        name: "unit_price",
        type: "uint256",
      },
      {
        indexed: false,
        name: "total_amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "remaining_amount",
        type: "uint256",
      },
    ],
    name: "MarketItemCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: true,
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        name: "unit_price",
        type: "uint256",
      },
      {
        indexed: false,
        name: "total_amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "buy_amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "remaining_amount",
        type: "uint256",
      },
    ],
    name: "MarketItemSelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: true,
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        name: "unit_price",
        type: "uint256",
      },
      {
        indexed: false,
        name: "total_amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "remaining_amount",
        type: "uint256",
      },
    ],
    name: "MarketItemCancel",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BuyToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SellToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "artist",
        type: "address",
      },
      {
        indexed: false,
        name: "token_id",
        type: "uint256",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
    ],
    name: "SFTMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DepositMSToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithDrawalDepositMSToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithDrawalDistributionMSToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address",
      },
    ],
    name: "MinterAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address",
      },
    ],
    name: "MinterRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
];
module.exports = service_abi;
