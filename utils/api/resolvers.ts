import {context} from "./context";
import {verifyOwnership} from "./verifyOwnership";

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
  SavedArticle: {
    ...createFieldResolver('savedArticle', 'author'),
    ...createFieldResolver('savedArticle', 'feed'),
  },
  User: {
    ...createFieldResolver('user', 'bundles'),
    ...createFieldResolver('user', 'feeds'),
    ...createFieldResolver('user', 'feedLikes'),
    ...createFieldResolver('user', 'bundleLikes'),
  },
  Query: {
    hello: (parent, args, context) => {
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
    savedArticle: async (parent, {data: {url}}, {prisma, user: {id: authorId}}: context) => {
      const savedArticles = await prisma.savedArticle.findMany({
        where: {url, authorId},
      });

      return savedArticles[0];
    },
    savedArticles: async (parent, args, { prisma, user: { id: authorId } }: context) => {
      return prisma.savedArticle.findMany({
        where: {authorId: authorId || null},
      });
    },
    me: async (parent, {data}, {prisma, user: {id}}: context) => {
      return prisma.user.findUnique({
        where: {id},
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
    updateFeed: async (parent, {data: {id, ...feedUpdate}}, {prisma, user}) => {
      const feed = await prisma.feed.findUnique({
        where: {id},
        include: {author: true},
      });

      await verifyOwnership(feed, user);

      return await prisma.feed.update({
        where: {id},
        data: {...feedUpdate},
      });
    },
    updateBundle: async (parent, {data: {id, ...bundleUpdate}}, {prisma, user}) => {

      const bundle = await prisma.bundle.findUnique({
        where: {id},
        include: {author: true},
      });

      await verifyOwnership(bundle, user);

      return await prisma.bundle.update({
        where: {id},
        data: {...bundleUpdate},
      });
    },
    createSavedArticle: async (parent, {data}, {prisma, user}) => {
      const author = {author: {connect: {id: user.id}}};

      return prisma.savedArticle.create({
        data: {
          ...data,
          ...author,
        },
      });
    },
  }
};