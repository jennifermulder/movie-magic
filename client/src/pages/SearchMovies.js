import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';
import { searchOmdbMovies } from '../utils/API';
import { saveMovieIds, getSavedMovieIds } from '../utils/localStorage';
import { SAVE_MOVIE } from '../utils/mutations';

const SearchMovies = () => {
  // create state for holding returned OMDB api data
  const [searchedMovies, setSearchedMovies] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  useEffect(() => {
    return () => saveMovieIds(savedMovieIds);
  });

  // create method to search for movies and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchOmdbMovies(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }
      
      // const items = await response.json();
      const items = await response.json();
    
      //create a new array in order to map values
      const newArr = Object.values(items);
        
      const movieData = [{  
        movieId: newArr[0],
        title: newArr[0],
        year: newArr[1],
        description: newArr[9],
        image: newArr[13] || '',
      }];

      setSearchedMovies(movieData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a movie to our database
  const handleSaveMovie = async (movieId) => {
    // find the movie in `searchedmovies` state by the matching id
    const movieToSave = searchedMovies.find((movie) => movie.movieId === movieId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveMovie({ variables: { movieData: { ...movieToSave } } });
      // if movie successfully saves to user's account, save movie id to state
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Search for Movies!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='ie: Titanic'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='primary' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedMovies.length
            ? `Viewing ${searchedMovies.length} result:`
            : 'Search for a movie in the search bar above to see results'}
        </h2>
        <CardColumns>
        {searchedMovies.map((movie) => {
            return (
              <Card key={movie.movieId} border='dark'>
                {movie.image ? (
                  <Card.Img src={movie.image} alt={`The cover for ${movie.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <p className='small'>Year: {movie.year}</p>
                  <Card.Text>{movie.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMovie(movie.movieId)}>
                      {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)
                        ? 'This movie has already been nominated!'
                        : 'Nominate this movie!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SearchMovies;
