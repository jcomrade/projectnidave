import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Home from '../pages/Home.jsx';
import Playlist from '../pages/Playlist.jsx';
import Share from '../pages/Share.jsx'
function RouterComponent() {
    return (
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/share/:playlistId" element={<Share />} />
        </Routes>
    );
};

export default RouterComponent;