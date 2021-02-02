import {ApolloServer} from "apollo-server-micro";
import {makeExecutableSchema} from "graphql-tools";
import Cors from 'micro-cors';

import {typeDefs} from "../../utils/typeDefs";
import {resolvers} from "../../utils/resolvers";

const schema = makeExecutableSchema({typeDefs, resolvers})
const cors = Cors();

export const config = {
  api: {
    bodyParser: false,
  }
};

const handler = new ApolloServer({
  schema: schema,
}).createHandler({
  path: '/api/graphql',
});

export default cors((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  return handler(req, res);
});