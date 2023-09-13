import { useState, useEffect, createContext } from "react";
import MyNavbar from "./MyNavbar";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SiteRouters from "./SiteRouters";
import axios from 'axios';
export const AppContext = createContext(null);


function App() {
  const [noteData, setNoteData] = useState(null);
  const url = 'http://127.0.0.1:8000/api/'
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${url}note/`);
        const noteData = response.data; 
        setNoteData(noteData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);


  return (<>
  <AppContext.Provider value={{ noteData, url }}>
    <MyNavbar/>
    <SiteRouters />
  </AppContext.Provider>
    </>
  );
}

export default App;
