import './MovieModal.css'


function MovieModal({ movie, closeModal }) {

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
    }
    return (
      <div className="modal" onClick={handleOverlayClick}> 
        <div className="modal-content">
          <div className="modal-header">
            <button onClick={closeModal} className="close-button">
              <span>&times;</span>
            </button>
          </div>
            <h2>{movie.title}</h2>
          <div className="modal-body">
            <div className="movie-details">
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <p className="movie-rating">
                  Rating: {movie.vote_average} / 10
                </p>
                <p className="movie-overview">{movie.overview}</p>
                <p>Released Date: {movie.release_date}</p>
                <p>Language: {movie.original_language}</p>
              </div>
            </div>
            {/* Add any additional movie details you want to display */}
          </div>
        </div>
      </div>
    );
  }
  

  export default MovieModal;
