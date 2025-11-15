import React, { useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import MovieModal from "./MovieModal";
import { useMovieData } from "./useMovieData";
import ThemeToggle from "./ThemeToggle";

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function DisplayGenreMovie() {
  const { genreId } = useParams();
  const [filteredData, setFilteredData] = useState(null);
  const history = useHistory();
  const [page, setPage] = useState(1);

  const {
    genres,
    showModal,
    selectedMovie,
    handleMovieClick,
    closeModal,
    truncateTitle,
  } = useMovieData();

  const apiOptions = useMemo(
    () => ({
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }),
    []
  );

  useEffect(() => {
    const filterFetchMovieByGenre = async () => {
      try {
        const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`;
        const res = await fetch(url, apiOptions);
        const jsonData = await res.json();
        setFilteredData(jsonData);
      } catch (error) {
        console.error("Error fetching genre movies:", error);
        setFilteredData(null);
      }
    };

    filterFetchMovieByGenre();
  }, [page, genreId, apiOptions]);

  const genreName = useMemo(() => {
    const genre = genres.find((g) => String(g.id) === genreId);
    return genre ? genre.name : "Genre";
  }, [genres, genreId]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const hasResults =
    filteredData && Array.isArray(filteredData.results);

  return (
    <div className="genre-page">
      {/* Top navigation with theme toggle */}
      <nav className="genre-navigation">
        <div className="nav-inner">
          <ul className="genre-list" role="list">
            {genres.map((genre) => (
              <li key={genre.id}>
                <button
                  className={`genre-button ${
                    String(genre.id) === genreId ? "active" : ""
                  }`}
                  onClick={() => {
                    history.push(`/genre/${genre.id}`);
                    setPage(1);
                    setFilteredData(null);
                  }}
                >
                  {genre.name}
                </button>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      {hasResults ? (
        <div className="main-content-area">
          {/* Header */}
          <header className="page-header fade-in">
            <i
              className="fas fa-home home-icon"
              onClick={() => history.push("/")}
              role="button"
              aria-label="Go to Home"
            />
            <h1 className="page-title">{genreName} Movies</h1>
            <i
              className="fas fa-home home-icon"
              onClick={() => history.push("/")}
              role="button"
              aria-label="Go to Home"
            />
          </header>

          {/* Movie Grid */}
          <ul className="movie-grid" role="list">
            {filteredData.results.map((movie) => (
              <li
                key={movie.id}
                className="movie-card fade-in"
                onClick={() => handleMovieClick(movie)}
                role="button"
                tabIndex="0"
                aria-label={`View details for ${movie.title}`}
              >
                <img
                  className="movie-poster"
                  alt={`${movie.title} poster`}
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                      : "/placeholder-image.jpg"
                  }
                  loading="lazy"
                />
                <div className="movie-info-container">
                  <h3 className="movie-title" title={movie.title}>
                    {truncateTitle(movie.title, 18)}
                  </h3>
                  <p className="movie-release-date">
                    {movie.release_date
                      ? movie.release_date.substring(0, 4)
                      : "N/A"}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {filteredData.total_pages > 1 && (
            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={page === 1}
                aria-disabled={page === 1}
              >
                &larr; Previous
              </button>
              <span className="page-indicator">
                Page {page} of {filteredData.total_pages}
              </span>
              <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={page >= filteredData.total_pages}
                aria-disabled={page >= filteredData.total_pages}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="main-content-area">
          <header className="page-header fade-in">
            <i
              className="fas fa-home home-icon"
              onClick={() => history.push("/")}
              role="button"
              aria-label="Go to Home"
            />
            <h1 className="page-title">{genreName} Movies</h1>
            <i
              className="fas fa-home home-icon"
              onClick={() => history.push("/")}
              role="button"
              aria-label="Go to Home"
            />
          </header>

          {/* Skeleton while loading */}
          <div className="skeleton-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="skeleton-card">
                <div className="skeleton-poster" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedMovie && (
        <MovieModal movie={selectedMovie} closeModal={closeModal} />
      )}
    </div>
  );
}

export default DisplayGenreMovie;
