import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import MovieModal from "./MovieModal";
import { useMovieData } from "./useMovieData";
import ThemeToggle from "./ThemeToggle";


const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function LandingPage() {
  const history = useHistory();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
    const fetchData = async () => {
      try {
        let url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`;

        if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            searchTerm
          )}&include_adult=false&language=en-US&page=${page}`;
        }

        const res = await fetch(url, apiOptions);
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setData(null);
      }
    };

    fetchData();
  }, [page, searchTerm, apiOptions]);

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

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const titleText = searchTerm
    ? `Search Results for "${searchTerm}"`
    : "Trending Movies";

  const hasResults = data && Array.isArray(data.results);
  const isSearching = !!searchTerm;

  // pick hero movie
  const heroMovie =
    hasResults && !isSearching && data.results.length > 0
      ? data.results[0]
      : null;

  return (
    <div className="landing-page">
      {/* Top navigation: genres + theme toggle */}
      <nav className="genre-navigation">
        <div className="nav-inner">
          <ul className="genre-list" role="list">
            {genres.map((genre) => (
              <li key={genre.id}>
                <button
                  className="genre-button"
                  onClick={() => history.push(`/genre/${genre.id}`)}
                >
                  {genre.name}
                </button>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      <div className="main-content-area">
        {/* Search Bar */}
        <div className="search-bar-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              aria-label="Search movies"
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍 <span>Search</span>
            </button>
          </form>
        </div>

        {/* Header */}
        <header className="page-header fade-in">
          <i
            className="fas fa-home home-icon"
            onClick={() => history.push("/")}
            role="button"
            aria-label="Go to Home"
          />
          <h1 className="page-title">{titleText}</h1>
          <i
            className="fas fa-home home-icon"
            onClick={() => history.push("/")}
            role="button"
            aria-label="Go to Home"
          />
        </header>

        {/* LOADING STATE WITH SKELETONS */}
        {!hasResults && (
          <>
            <div className="skeleton-hero" />
            <div className="row-section">
              <div className="skeleton-row">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="skeleton-card">
                    <div className="skeleton-poster" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* MAIN CONTENT WHEN DATA AVAILABLE */}
        {hasResults && (
          <>
            {/* HERO (TRENDING ONLY) */}
            {heroMovie && (
              <section className="hero-section fade-in">
                <div
                  className="hero-backdrop"
                  style={{
                    backgroundImage: heroMovie.backdrop_path
                      ? `url(https://image.tmdb.org/t/p/w1280/${heroMovie.backdrop_path})`
                      : heroMovie.poster_path
                      ? `url(https://image.tmdb.org/t/p/w780/${heroMovie.poster_path})`
                      : "none",
                  }}
                />
                <div className="hero-overlay">
                  <div className="hero-poster">
                    <img
                      src={
                        heroMovie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${heroMovie.poster_path}`
                          : "/placeholder-image.jpg"
                      }
                      alt={`${heroMovie.title} poster`}
                    />
                  </div>
                  <div className="hero-content">
                    <h2 className="hero-title">
                      {heroMovie.title || "Featured Movie"}
                    </h2>
                    <div className="hero-meta">
                      <span>
                        {heroMovie.release_date
                          ? heroMovie.release_date.substring(0, 4)
                          : "N/A"}
                      </span>
                      {heroMovie.vote_average && (
                        <span>
                          ⭐ {heroMovie.vote_average.toFixed(1)} / 10
                        </span>
                      )}
                      {heroMovie.original_language && (
                        <span>
                          {heroMovie.original_language.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="hero-overview">
                      {heroMovie.overview ||
                        "No overview available for this title."}
                    </p>
                    <div className="hero-buttons">
                      <button
                        type="button"
                        className="hero-btn-primary"
                        onClick={() => handleMovieClick(heroMovie)}
                      >
                        ▶ Play
                      </button>
                      <button
                        type="button"
                        className="hero-btn-secondary"
                        onClick={() => handleMovieClick(heroMovie)}
                      >
                        More Info
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* WHEN SEARCHING: GRID ONLY */}
            {isSearching && (
              <>
                {data.results.length === 0 && (
                  <p className="no-results-message">
                    No movies found for your search.
                  </p>
                )}

                {data.results.length > 0 && (
                  <ul className="movie-grid" role="list">
                    {data.results.map((movie) => (
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
                          <h3
                            className="movie-title"
                            title={movie.title}
                          >
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
                )}
              </>
            )}

            {/* WHEN NOT SEARCHING: HORIZONTAL ROW FOR TRENDING */}
            {!isSearching && (
              <section className="row-section fade-in">
                <h2 className="row-title">Trending Today</h2>
                <div className="movie-row">
                  {data.results.map((movie, idx) => (
                    <div
                      key={movie.id}
                      className="movie-card-horizontal"
                      onClick={() => handleMovieClick(movie)}
                      role="button"
                      tabIndex="0"
                      aria-label={`View details for ${movie.title}`}
                      style={{ animationDelay: `${idx * 0.02}s` }}
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
                        <h3
                          className="movie-title"
                          title={movie.title}
                        >
                          {truncateTitle(movie.title, 18)}
                        </h3>
                        <p className="movie-release-date">
                          {movie.release_date
                            ? movie.release_date.substring(0, 4)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pagination */}
            {data.total_pages > 1 && (
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
                  Page {page} of {data.total_pages}
                </span>
                <button
                  className="pagination-button"
                  onClick={handleNextPage}
                  disabled={page >= data.total_pages}
                  aria-disabled={page >= data.total_pages}
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedMovie && (
        <MovieModal movie={selectedMovie} closeModal={closeModal} />
      )}
    </div>
  );
}

export default LandingPage;
