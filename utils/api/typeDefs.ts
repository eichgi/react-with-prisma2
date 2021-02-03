import {gql} from "apollo-server-core";

export const typeDefs = gql`

    type User {
      id: String
      auth0: String
      nickname: String
      picture: String
      bundles: [Bundle]
      feeds: [Feed]
    }
    
    type Feed {
      id: String
      name: String
      url: String
      author: User
    }
    
    type Bundle {
      id: String
      name: String
      description: String
      author: User
    }
    
    input FeedInput {
      id: String
    }
    
    input BundleInput {
      id: String
    }
    
    input FeedCreateInput {
      id: String
      url: String
      name: String
    }
    
    input BundleCreateInput {
      id: String
      name: String
      description: String
    }

    type Query {
      hello: String
      feed(data: FeedInput): Feed
      bundle(data: BundleInput): Bundle
      feeds: [Feed]
      bundles: [Bundle]
    }
    
    type Mutation {
      createFeed(data: FeedCreateInput): Feed
      createBundle(data: BundleCreateInput): Bundle
    }
`;