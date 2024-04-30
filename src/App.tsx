import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import GameField from "./views/Game";
import Home from "./views/Home";
import Highscore from "./views/Highscore";

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
                <Route index path="/score" element={<Highscore />} />
            </Routes>
        </Router>
    );
};

export default App;
