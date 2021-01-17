import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { REMOVE_MOVIE } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { removeMovieId } from '../utils/localStorage';

const SavedMovies = () => {

  const { loading, data } = useQuery(GET_ME);

  const [removeMovie, { error }] = useMutation(REMOVE_MOVIE);

  const userData = data?.me || {}


  // create function that accepts the movie's mongo _id value as param and deletes the movie from the database
  const handleDeleteMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //movieId passed in handledeletemovie
      const response = await removeMovie({variables:{movieId}});

      removeMovieId(movieId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing nomination list!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedMovies?.length
            ? `Viewing ${userData.savedMovies.length} saved ${userData.savedMovies.length === 1 ? 'movie' : 'movies'}:`
            : 'You have not nominated any movies! Return to "Search for Movies" in order to make a nomination.'}
        </h2>
        <CardColumns>
          {userData.savedMovies?.map((movie) => {
            return (
              <Card key={movie.movieId} border='dark'>
                {movie.image ? <Card.Img src={movie.image} alt={`The cover for ${movie.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <p className='small'>Year: {movie.year}</p>
                  <Card.Text>{movie.description}</Card.Text>
                  <Button className='btn-block btn-warning' onClick={() => handleDeleteMovie(movie.movieId)}>
                    Remove this nomination!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedMovies;
