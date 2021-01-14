// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
// define a query = type Query {}
// Reaction type nested in Thought
//! = data must exist
// mutation - will return a user object, either user who logged in or signed up
const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  movieCount: Int
  savedMovies: [Movie]
}

type Movie {
  movieId: ID
  authors: [String]
  description: String
  title: String
  image: String
  link: String
}

type Query {
  me: User
}

type Auth {
  token: ID!
  user: User
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveMovie(movieData: movieInput!): User
  removeMovie(movieId: ID!): User
}

input movieInput {
  authors: [String]
  description: String!
  movieId: String
  image: String 
  link: String
  title: String!
}
`;

// export the typeDefs
module.exports = typeDefs;