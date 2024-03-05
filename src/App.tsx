import { Button } from "@mui/material";
import { useState } from "react";
import * as Tone from "tone";

export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const startDeepNote = () => {
        setIsPlaying(true);
        const chord = [
            "F#6",
            "F#6",
            "F#6",
            "D6",
            "D6",
            "D6",
            "A5",
            "A5",
            "A5",
            "D5",
            "D5",
            "D5",
            "A4",
            "A4",
            "A4",
            "D4",
            "D4",
            "D4",
            "A3",
            "A3",
            "A3",
            "D3",
            "D3",
            "D3",
            "A2",
            "A2",
            "A2",
            "D2",
            "D2",
            "D2",
            "D1",
            "D1",
        ];
        const synths = [];
        for (let i = 0; i < 32; i++) {
            synths.push(new Tone.Synth().toDestination());
        }
        Tone.Transport.bpm.value = 60;
        Tone.Transport.schedule(() => {
            setIsPlaying(false);
        }, "8:0");
        synths.forEach((synth, index) => {
            synth.triggerAttack(300, "0:3", 0.05);
            synth.frequency.setValueAtTime(Math.random() * (400 - 200) + 200, "0:3");
            synth.frequency.setRampPoint("2:3");
            synth.frequency.exponentialRampToValueAtTime(chord[index], "4:0");
            synth.triggerRelease("8:0");
        });
    };
    return (
        <Button
            variant="contained"
            onClick={async () => {
                if (!isPlaying) {
                    try {
                        await Tone.start();
                        startDeepNote();
                    } catch (error) {
                        console.error(error);
                    }
                }
            }}
        >
            Play Deep Note
        </Button>
    );
}
