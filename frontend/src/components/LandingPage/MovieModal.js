import React from "react";

/**
 * MovieModal
 * Shows detailed info for a selected movie.
 */
function MovieModal({ movie, closeModal }) {
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const getGenreNames = (genresArray) =>
    genresArray?.map((g) => g.name).join(", ") || "N/A";

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-modal-title"
    >
      <div className="modal-content" role="document">
        <header className="modal-header">
          <h2 id="movie-modal-title" className="modal-title">
            {movie.title}
          </h2>
          <button
            onClick={closeModal}
            className="close-button"
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>

        <section className="modal-body">
          <div className="movie-details-layout">
            <img
              className="movie-poster-large"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : "/placeholder-image.jpg"
              }
              alt={`${movie.title} poster`}
            />

            <div className="movie-info-block">
              <p className="movie-rating-full">
                <span>⭐ Rating:</span>
                <span>
                  {movie.vote_average
                    ? `${movie.vote_average.toFixed(1)} / 10`
                    : "N/A"}
                </span>
                {movie.vote_count ? (
                  <span>({movie.vote_count} votes)</span>
                ) : null}
              </p>

              <h3 className="overview-heading">Overview</h3>
              <p className="movie-overview">
                {movie.overview || "No overview available."}
              </p>

              <div className="additional-info">
                <p>
                  🗓 <strong>Released:</strong>{" "}
                  {movie.release_date || "N/A"}
                </p>
                <p>
                  🗣 <strong>Language:</strong>{" "}
                  {movie.original_language
                    ? movie.original_language.toUpperCase()
                    : "N/A"}
                </p>
                <p>
                  ⏱ <strong>Runtime:</strong>{" "}
                  {movie.runtime ? `${movie.runtime} mins` : "N/A"}
                </p>
                <p>
                  🎭 <strong>Genres:</strong>{" "}
                  {getGenreNames(movie.genres)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MovieModal;
