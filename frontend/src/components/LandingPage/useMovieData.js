import { useState, useEffect, useCallback, useMemo } from 'react';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

/**
 * Custom hook to manage movie genres, movie details, and modal state.
 */
export const useMovieData = () => {
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Memoize API options to prevent unnecessary re-creation
  const apiOptions = useMemo(() => ({
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  }), []);

  // Fetch all movie genres
  const fetchGenre = useCallback(async () => {
    try {
      const res = await fetch(
        'https://api.themoviedb.org/3/genre/movie/list?language=en',
        apiOptions
      );
      const jsonRes = await res.json();
      setGenres(jsonRes.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }, [apiOptions]);

  useEffect(() => {
    fetchGenre();
  }, [fetchGenre]);

  // Function to truncate the movie title
  const truncateTitle = (title, maxLength = 13) => {
    if (!title) return '';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Handler for opening the movie detail modal
  const handleMovieClick = useCallback(async (movie) => {
    try {
      // Fetch full movie details including runtime, genres (if not already included) etc.
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
        apiOptions
      );
      const movieDetails = await res.json();

      setSelectedMovie(movieDetails);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }, [apiOptions]);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedMovie(null); // Clear selected movie on close
  }, []);

  return {
    genres,
    showModal,
    selectedMovie,
    handleMovieClick,
    closeModal,
    truncateTitle,
    fetchGenre,
  };
};
