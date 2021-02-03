export const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      //throw Error('holly shxt!');
      return 'hiho';
    },
    feed: (parent, {data: {id}}, {prisma}) => {
      return prisma.feed.findUnique({
        where: {id}
      });
    },
    feeds: (parent, args, {prisma}) => {
      return prisma.feed.findMany();
    }
  },
  Mutation: {
    createFeed: async (parent, {data}, {prisma, user}) => {
      const result = await prisma.feed.create({
        data: {...data},
      });

      return result;
    },
  }
};