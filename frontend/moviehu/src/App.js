import { Switch, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";


function App() {

  
  
  return (
    <>

    <Switch>

      <Route exact path={'/'}>
        <LandingPage />
      </Route>

    </Switch>
    
    </>
  );
}

export default App;
