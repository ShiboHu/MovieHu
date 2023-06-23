import { useEffect, useState } from "react";
import "./LandingPage.css";
import { useHistory } from "react-router-dom";
import MovieModal from "./MovieModal";

const apiKey = process.env.REACT_APP_TMDB_API_KEY;

function LandingPage() {
  const history = useHistory();
  const [data, setData] = useState("");
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    //fetch movie data
    const fetchData = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        };

        let url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`;

        // Append search query if searchTerm is not empty
        if (searchTerm) {
          url = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=${page}`
          ;
        }

        const res = await fetch(url, options);
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        console.log(error);
      }
    };

    //fetch all movie genre
    const fetchGenre = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        };

        const res = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?language=en",
          options
        );
        const jsonRes = await res.json();
        setGenres(jsonRes.genres);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGenre();
    fetchData();
  }, [page, searchTerm]);

  //handle pages
  const handleNextPage = () => {
    setPage(page + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  // truncate the movie title
  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) {
      return title;
    }
    return title.substr(0, maxLength) + "...";
  };




  //handle movie click
  const handleMovieClick = async (movie) => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      };

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
        options
      );
      const movieDetails = await res.json();

      setSelectedMovie(movieDetails);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <div>
        <ul className="genre-list">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => history.push(`/genre/${genre.id}`)}
            >
              {genre.name}
            </button>
          ))}
        </ul>
      </div>



      {data ? (
        <div className="landingpage-container">
              
       
      <div className="search-bar">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="tohome">
          <i className="fas fa-home" onClick={() => history.push('/')}></i>
          <h1 className="landingpage-title">Trending Movies</h1>
          <i className="fas fa-home" onClick={() => history.push('/')}></i>
          </div>
          <ul className="landingpage-cardul">
            {data?.results?.map((movie) => (
              <div
                key={movie.id}
                className="landingpage-moviecard"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="landingpage-movieinfo">
                  <img
                    className="landingpage-movieimage"
                    alt="movie"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  />
                  <li className="landingpage-movietitle" title={movie.title}>
                    {truncateTitle(movie.title, 13)}
                  </li>
                  <li>{movie.release_date}</li>
                </div>
              </div>
            ))}
          </ul>
          <div className="landingpage-buttons">
            <button className="landingpage-button" onClick={handlePreviousPage}>
              Previous
            </button>
            <button className="landingpage-button" onClick={handleNextPage}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {showModal && (
        <MovieModal
          movie={selectedMovie}
          closeModal={closeModal}
        />
      )}
    </>
  );
}



export default LandingPage;
