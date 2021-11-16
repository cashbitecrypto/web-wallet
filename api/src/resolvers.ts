import { PrismaClient, User } from ".prisma/client";
import { info } from "console";
import WalletController from "./wallets";

interface ResolverContext {
  user: User,
  walletController: WalletController,
  prisma: PrismaClient
}

export default {
  Mutation: {
    async createWallet(root: any, { name }: { name: string }, context: ResolverContext) {
      const address = await context.walletController.createWallet();
      const wallet = await context.prisma.wallet.create({
        data: {
          name,
          address,
          userId: context.user.id
        }
      });
      return wallet;
    }
  },
  Query: {
    async allWallets(root: any, args: any, context: ResolverContext) {
      const wallets = await context.prisma.wallet.findMany({
        where: {
          userId: context.user.id
        }
      });

      return wallets;
    },
    async wallet(root: any, { id }: { id: string }, context: ResolverContext) {
      const wallet = await context.prisma.wallet.findFirst({
        where: {
          userId: context.user.id,
          id
        }
      });
      if (wallet === null) {
        return null;
      }

      const w = await context.walletController.getWallet();
      const txs = (await w.getTransactions(undefined, undefined, undefined, wallet.address)).map((tx) => ({
        ...tx,
        fee: tx.fee / 1000000,
        amount: tx.totalAmount() / 1000000
      }));
      const [unlockedBalance, lockedBalance] = await w.getBalance([wallet.address]);
      const data = {
        ...wallet,
        unlockedBalance: unlockedBalance / 1000000,
        lockedBalance: lockedBalance / 1000000,
        transactions: txs
      };

      console.log("Private spend", (await w.getSpendKeys(wallet.address))[1]);
      console.log("Private view", w.getPrivateViewKey());
      return data;
    },
    async info(root: any, args: any, context: ResolverContext) {
      return context.walletController.info();
    }
  }
};
