import { useEffect, useState } from "react";
import "./DisplayGenre.css";
import { useHistory, useParams } from 'react-router-dom'
import MovieModal from "./MovieModal";

const apiKey = process.env.REACT_APP_TMDB_API_KEY;


function DisplayGenreMovie() {
  const { genreId } = useParams();
  const [filteredData, setFilteredData] = useState('');
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Fetch movie genres and data
  useEffect(() => {
    

    const filterFetchMovieByGenre = async () => { 
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
          }
        };
  
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`, options);
        const jsonData = await res.json();
        setFilteredData(jsonData);
      } catch (error) {
        console.log(error);
      }
    }
    
    
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
      
      fetchGenre()
      filterFetchMovieByGenre();
    }, [page, filteredData]);
    
    //handle pages 
    const handleNextPage = () => { 
      setPage(page + 1)
      window.scrollTo(0, 0)
    }
    
    const handlePreviousPage = () => { 
      if(page > 1){ 
        setPage(page - 1)
        window.scrollTo(0, 0)
      }
    }
    
    
    // truncate the movie title
    const truncateTitle = (title, maxLength) => {
      if (title.length <= maxLength) {
        return title;
      }
      return title.substr(0, maxLength) + '...';
    };  
    
    const convertTitle = (id) => { 
      for(let i = 0; i < genres.length; i++) { 
        if(genres[i].id == id){ 
          return genres[i].name
        }
      }
    }


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
    
    return (
      <div className="main-container">

    <div >
      <ul className="genre-list">
       {genres.map(genre => (
         <button onClick={() => history.push(`/genre/${genre.id}`)}>{genre.name}</button>
       ))}
     </ul>
    </div>

    

      {filteredData ? (
        <div className="landingpage-container">
          <div className="tohome">
        <i className="fas fa-home" onClick={() => history.push('/')}></i>
            <h1 className="landingpage-title">{convertTitle(genreId)} Movies</h1>
        <i className="fas fa-home"onClick={() => history.push('/')} ></i>
        </div>
          <ul className="landingpage-cardul">
            {filteredData?.results?.map((movie) => (
              <div key={movie.id} className="landingpage-moviecard" onClick={() => handleMovieClick(movie)}>
                <div className="landingpage-movieinfo">
                <img className="landingpage-movieimage" alt="movie" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                  <li className="landingpage-movietitle" title={movie.title}>
                    {truncateTitle(movie.title, 13)}
                  </li>
                  <li>{movie.release_date}</li>
                </div>
              </div>
            ))}
          </ul>
          <div className="landingpage-buttons">
            <button className="landingpage-button" onClick={handlePreviousPage}>Previous</button>
            <button className="landingpage-button" onClick={handleNextPage}>Next</button>
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
    </div>
  );
}



export default DisplayGenreMovie;
