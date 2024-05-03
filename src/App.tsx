import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import GameField, { assignGameDefaults } from "./views/Game";
import Home from "./views/Home";
import Highscore from "./views/EnterScore";
import ShowScores from "./views/ShowScores";
import Settings from "./views/Settings";

const App = () => {
    const [settings] = useState({
        speedOption: 'fast',
        pointOption: 10
    });

    useEffect(() => {
        const defaults = localStorage.getItem('settings');
        if (defaults) {
            assignGameDefaults(JSON.parse(defaults));
        }
    }, []);
    
    return (
        <Router>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route index path="/game" element={<GameField settings={settings} />} />
                <Route index path="/enter-score" element={<Highscore />} />
                <Route index path="/scores" element={<ShowScores />} />
                <Route index path="/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
};

export default App;
