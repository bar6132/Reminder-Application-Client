import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Schedule from './Schedule';
import Home from './Home';
import AddNote from './AddNote';



function SiteRouters() {
    return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Schedule" element={<Schedule/>} />
        <Route path="/AddNote" element={<AddNote/>} />
      </Routes>

        );
}

export default SiteRouters;