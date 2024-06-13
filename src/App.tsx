import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import GameField, { assignGameDefaults } from "./views/Game";
import Home from "./views/Home";
import Highscore from "./views/EnterScore";
import ShowScores from "./views/ShowScores";
import Settings from "./views/Settings";
import Cookies from 'js-cookie';


const App = () => {
    const [settings] = useState({
        speedOption: 'fast',
        pointOption: 10
    });

    useEffect(() => {
        const settings = Cookies.get('settings');
        if (settings) {
            assignGameDefaults(JSON.parse(settings));
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game" element={<GameField settings={settings} />} />
                <Route path="/enter-score" element={<Highscore />} />
                <Route path="/scores" element={<ShowScores />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </Router>
    );
};

export default App;
