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
      console.log(items);

      const newArr = Object.values(items);
      // const newArr = Array.from(items);
      console.log(newArr);

      

           //loop over the object
      // for (const entry of Object.entries(items)) {
      //   const keyValue = `${entry[0]}: "${entry[1]}"`
      //   console.log(keyValue);
      // }
      //push to the array
      

      // const movieData = Object.entries(items).map((movie) => ({  
      const movieData = newArr.map((movie) => ({  
        movieId: newArr[0],
        title: newArr[0] || 'Titanic',
        year: newArr[1] || '1997',
        description: newArr[9] || 'Plot',
        image: newArr[13] || '',
      }));
      console.log(movieData);


      
      // const movieId= items.id;
      // const title= items.Title || 'Titanic';
      // const year= items.Year || '1997';
      // const description= items.Plot || 'Plot';
      // const image= items.Poster || '';

      // console.log(movieId);
      // console.log(title);
      // console.log(year);
      // console.log(description);
      // console.log(image);

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
            ? `Viewing ${searchedMovies.length} results:`
            : 'Search for a movie above to see results'}
        </h2>
        <CardColumns>
        {searchedMovies.map((movieData) => {
            return (
              <Card key={movieData.movieId} border='dark'>
                {movieData.image ? (
                  <Card.Img src={movieData.image} alt={`The cover for ${movieData.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{movieData.title}</Card.Title>
                  <p className='small'>Year: {movieData.year}</p>
                  <Card.Text>{movieData.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movieData.movieId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMovie(movieData.movieId)}>
                      {savedMovieIds?.some((savedMovieId) => savedMovieId === movieData.movieId)
                        ? 'This movie has already been saved!'
                        : 'Save this movie!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
        {/* <CardColumns>
          {searchedMovies.map((movie) => {
            return (
              <Card key={movie.movieId} border='dark'>
                {movie.image ? (
                  <Card.Img key={movie.Poster} src={movie.image} alt={`The cover for ${movie.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title key={movie.Title}>{movie.title}</Card.Title>
                  <p key={movie.Year} className='small'>Year: {movie.year}</p>
                  <Card.Text key={movie.Plot} >{movie.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveMovie(movie.movieId)}>
                      {savedMovieIds?.some((savedMovieId) => savedMovieId === movie.movieId)
                        ? 'This movie has already been saved!'
                        : 'Save this movie!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns> */}
      </Container>
    </>
  );
};

export default SearchMovies;
