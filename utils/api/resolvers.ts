

export const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      //throw Error('holly shit!');
      return 'hiho';
    }
  }
};