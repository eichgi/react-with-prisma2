const createFieldResolver = (modelName, parName) => ({
  [parName]: async ({id}, args, {prisma}) => {
    const modelResponse = await prisma[modelName].findUnique({
      where: {id},
      include: {[parName]: true},
    });

    console.log(modelResponse);
    return modelResponse[parName];
  }
});

export const resolvers = {
  Feed: {
    // author: (parent, args, {prisma}) => {
    //   const {authorId} = parent;
    //   return prisma.user.findUnique({where: {id: authorId}});
    // },
    ...createFieldResolver('feed', 'author'),
    ...createFieldResolver('feed', 'tags'),
    ...createFieldResolver('feed', 'bundles'),
  },
  Bundle: {
    ...createFieldResolver('bundle', 'author'),
    ...createFieldResolver('bundle', 'tags'),
    ...createFieldResolver('bundle', 'feeds'),
  },
  BundleTag: {
    ...createFieldResolver('bundleTag', 'bundles'),
  },
  FeedTag: {
    ...createFieldResolver('feedTag', 'feeds'),
  },
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
    },
    bundle: (parent, {data: {id}}, {prisma}) => prisma.bundle.findUnique({where: {id}}),
    bundles: (parent, args, {prisma}) => prisma.bundle.findMany(),
  },
  Mutation: {
    createFeed: async (parent, {data}, {prisma, user}) => {
      const author = {author: {connect: {id: user.id}}};
      const result = await prisma.feed.create({
        data: {...data, ...author},
      });
      //console.log(result);
      return result;
    },
    createBundle: async (parent, {data}, {prisma, user}) => {
      const author = {author: {connect: {id: user.id}}};
      const result = await prisma.bundle.create({
        data: {...data, ...author},
      });

      return result;
    },
  }
};