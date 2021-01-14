import gql from 'graphql-tag';
// import the gql tagged template literal functionality to create a GraphQL mutation called login that accepts email and password variables
// return user data and token
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;
export const SAVE_MOVIE = gql`
  mutation saveMovie($movieData: movieInput!) {
    saveMovie(movieData: $movieData) {
      _id
      username
      email
      movieCount
      savedMovies{
        movieId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
export const REMOVE_MOVIE = gql`
  mutation removeMovie($movieId: ID!) {
    removeMovie(movieId: $movieId) {
      _id
      username
      email
      movieCount
      savedMovies{
        movieId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
