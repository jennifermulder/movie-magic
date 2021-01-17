// store all GraphQL query requests 

import gql from 'graphql-tag';
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      movieCount
      savedMovies {
        movieId
        year
        description
        title
        image
        link
      }
    }
  }
`;