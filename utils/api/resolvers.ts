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
    ...createFieldResolver('feed', 'likes'),
  },
  Bundle: {
    ...createFieldResolver('bundle', 'author'),
    ...createFieldResolver('bundle', 'tags'),
    ...createFieldResolver('bundle', 'feeds'),
    ...createFieldResolver('bundle', 'likes'),
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
    findFeedTags: (parent, {data}, {prisma}) => {
      return prisma.feedTag.findMany({
        where: {name: {contains: data.search}}
      })
    },
    findBundleTags: (parent, {data}, {prisma}) => {
      return prisma.bundleTag.findMany({
        where: {name: {contains: data.search}},
      });
    },
    findFeeds: (parent, {data}, {prisma}) => {
      return prisma.feed.findMany({
        where: {name: {contains: data.search}},
      });
    },
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
    likeBundle: async (parent, {data}, {prisma, user}) => {
      const {bundleId, likeState} = data;

      const connectState = likeState ? 'connect' : 'disconnect';
      return prisma.bundle.update({
        where: {id: bundleId},
        data: {likes: {[connectState]: {id: user.id}}},
      })
    },
    likeFeed: async (parent, {data}, {prisma, user}) => {
      const {feedId, likeState} = data;

      const connectState = likeState ? 'connect' : 'disconnect';
      return prisma.feed.update({
        where: {id: feedId},
        data: {likes: {[connectState]: {id: user.id}}},
      });
    },
  }
};