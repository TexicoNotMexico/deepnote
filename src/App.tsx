import { useEffect, useState } from "react";
import { initializeTonejs, startDeepNote } from "./DeepNote";

function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    useEffect(() => {
        setIsFirst(true);
    }, []);
    return (
        <button
            onClick={async () => {
                if (!isPlaying) {
                    if (isFirst) {
                        initializeTonejs(setIsPlaying);
                        setIsFirst(false);
                    }
                    setIsPlaying(true);
                    startDeepNote();
                }
            }}
            disabled={isPlaying}
        >
            {isPlaying ? "Playing..." : "Play Deep Note"}
        </button>
    );
}

export default App;
