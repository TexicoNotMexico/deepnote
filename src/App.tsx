import { useEffect, useState } from "react";
import * as Tone from "tone";
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
                    await Tone.start().then(() => {
                        Tone.context.resume().then(() => {
                            if (Tone.context.state === "running") {
                                if (isFirst) {
                                    initializeTonejs(setIsPlaying);
                                    setIsFirst(false);
                                }
                                setIsPlaying(true);
                                startDeepNote();
                            }
                        });
                    });
                }
            }}
            disabled={isPlaying}
        >
            {isPlaying ? "Playing..." : "Play Deep Note"}
        </button>
    );
}

export default App;
