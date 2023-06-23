import { useEffect, useState } from "react";
import "./DisplayGenre.css";

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
console.log(apiKey)


function DisplayGenre() {
  const [genres, setGenres] = useState([]);
  
  

  useEffect(() => {
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
  }, []);

  return (
    <div className="genre-container">
      <h2 className="genre-title">Movie Genres</h2>
      <ul className="genre-list">
        {genres.map((genre) => (
          <li key={genre.id} className="genre-item">
            {genre.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayGenre;
