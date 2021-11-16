import { PrismaClient } from '.prisma/client';
import { ApolloServer, AuthenticationError, gql } from 'apollo-server';
import isTokenValid from './validate';
import typeDefs from './schema';
import resolvers from './resolvers';
import WalletController from './wallets';

const prisma = new PrismaClient();
const walletController = new WalletController();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const { error, decoded } = await isTokenValid(token);
    if (error) {
      throw new AuthenticationError(error.toString());
    }
    if (!decoded || !decoded.sub) {
      throw new AuthenticationError("Auth token not valid");
    }

    const user = await prisma.user.upsert({
      where: {
        authId: decoded.sub
      },
      update: {
        // email: decoded.email,
        // name: decoded.name
      },
      create: {
        authId: decoded.sub,
        email: decoded.email,
        name: decoded.name
      }
    });

    return {
      user,
      walletController,
      prisma
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

process.on('SIGINT', async () => {
  console.log('Saving wallet...');
  await walletController.save();
  console.log('Wallet saved!');
});
