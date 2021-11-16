import { gql } from "apollo-server";

export default gql`
  type BriefWallet {
    id: String!
    name: String!
    address: String!
  }

  type Wallet {
    id: String!
    name: String!
    address: String!
    lockedBalance: Float!
    unlockedBalance: Float!
    transactions: [Transaction!]!
  }

  type Transaction {
    blockHeight: Int!
    isCoinbaseTransaction: Boolean!
    fee: Float!
    paymentId: String
    unlockTime: Int!
    hash: String!
    timestamp: Int!
    amount: Float!
  }

  type Info {
    walletHeight: Int!
    daemonHeight: Int!
    networkHeight: Int!
  }

  type Query {
    allWallets: [BriefWallet!]!
    wallet(id: String): Wallet
    info: Info!
  }

  type Mutation {
    createWallet(name: String!): Wallet!
  }
`;
