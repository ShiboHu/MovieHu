import { useEffect, useState } from "react";
import './LandingPage.css'
import DisplayGenre from './Genres'

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
console.log(apiKey)


function LandingPage(){ 
  const [data, setData] = useState('');
  const [page, setPage] = useState(1);
  
  //grabing trending movies
  useEffect(() => { 
    
    const fetchData = async () => { 
      
      try {
                
            const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`
            }
          };
          
          const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`, options)
          const jsonData = await res.json()
          setData(jsonData);
        } catch (error) {
            console.log(error)
        }
        }

        
        fetchData();
      },[page])
      




    
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


     return (
        <>
                  <DisplayGenre />
          {data ? (
              <div className="landingpage-container">
                <h1 className="landingpage-title">Trending Movies</h1>
              <ul className="landingpage-cardul">
                {data?.results?.map((movie) => (
                  <div key={movie.id} className="landingpage-moviecard">
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
        </>
      );
}


export default LandingPage;
