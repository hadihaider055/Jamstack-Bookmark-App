const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query;

const adminClient = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
});

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]
  }

  type Mutation {
    createBookmark(title: String!, url: String!, description: String!): Bookmark
    deleteBookmark(id: ID!): Bookmark
    editBookmark(
      id: ID!
      title: String
      url: String!
      description: String
    ): Bookmark
  }

  type Bookmark {
    id: ID!
    title: String!
    description: String!
    url: String!
  }
`;

const resolvers = {
  Query: {
    bookmarks: async (root, args, context) => {
      try {
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("bookmark"))),
            q.Lambda((x) => q.Get(x))
          )
        );
        return result.data.map((item) => {
          return {
            id: item.ref.id,
            title: item.data.title,
            description: item.data.description,
            url: item.data.url,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    createBookmark: async (_, { title, description, url }) => {
      try {
        const result = await adminClient.query(
          q.Create(q.Collection("bookmark"), {
            data: {
              title: title,
              description: description,
              url: url,
            },
          })
        );
        return result.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    deleteBookmark: async (_, { id }) => {
      try {
        const result = await adminClient.query(
          q.Delete(q.Ref(q.Collection("bookmark"), id))
        );
        return result.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    editBookmark: async (_, { id, title, description, url }) => {
      try {
        const result = await adminClient.query(
          q.Update(q.Ref(q.Collection("bookmark"), id), {
            data: {
              title: title,
              description: description,
              url: url,
            },
          })
        );
        return result.data.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const apolloHandler = server.createHandler();
exports.handler = (event, context, ...args) => {
  return apolloHandler(
    {
      ...event,
      requestContext: context,
    },
    context,
    ...args
  );
};
