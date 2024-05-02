import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import GameField from "./views/Game";
import Home from "./views/Home";
import Highscore from "./views/EnterScore";
import ShowScores from "./views/ShowScores";

const App = () => {
    const [settings] = useState({
        speedOption: 'fast',
        pointOption: 10
    });

    return (
        <Router>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route index path="/game" element={<GameField settings={settings} />} />
                <Route index path="/enter-score" element={<Highscore />} />
                <Route index path="/scores" element={<ShowScores />} />
            </Routes>
        </Router>
    );
};

export default App;
