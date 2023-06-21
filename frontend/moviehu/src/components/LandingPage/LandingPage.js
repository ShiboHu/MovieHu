import { useEffect, useState } from "react";
import './LandingPage.css'


function LandingPage(){ 
    const [data, setData] = useState('');
    const [page, setPage] = useState(1)

    useEffect(() => { 

        const fetchData = async () => { 
        
        try {

        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2OWI4ZDY0OTMyNzBhNGJmMDc1YjM3YTlmNmFlNzA4NiIsInN1YiI6IjY0OTMxOTlkNzA2ZTU2MDBlM2VlZDdiYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BQqj1GO3lCcsUPIMCZ2ACl-JcyURQ6K_-37TY9ydwhM'
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
    }

    const handlePreviousPage = () => { 
        if(page > 1){ 
            setPage(page - 1)
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
          <h1 className="landingpage-title">Trending</h1>
          {data ? (
            <div className="landingpage-container">
              <ul className="landingpage-cardul">
                {data.results.map((movie) => (
                  <div key={movie.id} className="landingpage-moviecard">
                    <img className="landingpage-movieimage" alt="movie" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                    <div className="landingpage-movieinfo">
                      <li className="landingpage-movietitle" title={movie.title}>
                        {truncateTitle(movie.title, 10)}
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
