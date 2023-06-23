import { Switch, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import DisplayGenreMovie from "./components/LandingPage/Genres";


function App() {

  
  
  return (
    <>

    <Switch>

    

      <Route exact path={'/'}>
        <LandingPage />
      </Route>

      <Route path={`/genre/:genreId`}> 
        <DisplayGenreMovie />
      </Route>
      

    </Switch>
    
    </>
  );
}

export default App;
