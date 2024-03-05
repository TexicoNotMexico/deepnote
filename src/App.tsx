import { Button } from "@mui/material";
import { useState } from "react";
import * as Tone from "tone";

export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const startDeepNote = () => {
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
        }, "7:1");
        Tone.Transport.start("+0", "0:0");

        synths.forEach((synth, index) => {
            if ((index - 1) % 3 === 0) {
                synth.detune.value = 3;
            } else if ((index - 2) % 3 === 0) {
                synth.detune.value = -3;
            }
            synth.set({
                envelope: {
                    attack: 0.15,
                    decay: 0.0,
                    sustain: 1,
                    release: 1,
                },
            });
            Tone.Transport.schedule(() => {
                synth.triggerAttack(300, "0:0", 1);
                synth.frequency.setValueAtTime(Math.random() * (400 - 200) + 200, "0:0");
                synth.frequency.exponentialRampToValueAtTime(Math.random() * (400 - 200) + 200, "0:2");
                synth.frequency.exponentialRampToValueAtTime(Math.random() * (400 - 200) + 200, "1:0");
                synth.frequency.exponentialRampToValueAtTime(Math.random() * (400 - 200) + 200, "1:2");
                synth.frequency.exponentialRampToValueAtTime(Math.random() * (400 - 200) + 200, "2:0");
                synth.frequency.exponentialRampToValueAtTime(chord[index], "3:1");
                synth.volume.setValueAtTime(-48, "0:0");
                synth.volume.rampTo(-23, "3:0", "0:0");
                synth.triggerRelease("7:1");
            }, "0:0");
        });
    };
    return (
        <Button
            variant="outlined"
            onClick={async () => {
                if (!isPlaying) {
                    try {
                        await Tone.start();
                        setIsPlaying(true);
                        startDeepNote();
                    } catch (error) {
                        console.error(error);
                    }
                }
            }}
            disabled={isPlaying}
        >
            {isPlaying ? "Playing..." : "Play Deep Note"}
        </Button>
    );
}
