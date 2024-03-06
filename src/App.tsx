import { Button } from "@mui/material";
import { useState } from "react";
import * as Tone from "tone";

export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    const startDeepNote = () => {
        const notes = [
            ["F#6", 1],
            ["F#6", 1],
            ["F#6", 1],
            ["D6", 0.9],
            ["D6", 0.9],
            ["D6", 0.9],
            ["A5", 0.8],
            ["A5", 0.8],
            ["A5", 0.8],
            ["D5", 0.5],
            ["D5", 0.5],
            ["D5", 0.5],
            ["A4", 0.5],
            ["A4", 0.5],
            ["A4", 0.5],
            ["D4", 0.5],
            ["D4", 0.5],
            ["D4", 0.5],
            ["A3", 0.6],
            ["A3", 0.6],
            ["A3", 0.6],
            ["D3", 0.7],
            ["D3", 0.7],
            ["D3", 0.7],
            ["A2", 0.8],
            ["A2", 0.8],
            ["A2", 0.8],
            ["D2", 1.8],
            ["D2", 1.8],
            ["D2", 1.8],
            ["D1", 2.5],
            ["D1", 2.5],
        ];

        const reverb = new Tone.Reverb({
            wet: 1,
            decay: 3,
            preDelay: 0.01,
        }).toDestination();
        const comp = new Tone.Compressor(-16, 10).connect(reverb);

        const synths = [];
        const panners = [];
        for (let i = 0; i < 32; i++) {
            panners.push(
                new Tone.Panner3D({
                    panningModel: "HRTF",
                    positionX: Math.random() * 5 - 2.5,
                    positionY: Math.random() * 5 - 2.5,
                    positionZ: Math.random() * 5 - 2.5,
                }).connect(comp)
            );
            synths.push(
                new Tone.Synth({
                    oscillator: {
                        type: "pulse", // TODO: make this property selectable through the Select UI
                        // * IMO "pulse" is the best in waveform for now
                    },
                }).connect(panners[i])
            );
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
                    attack: 1,
                    decay: 0,
                    sustain: 1,
                    release: 1,
                },
            });
            Tone.Transport.schedule(() => {
                synth.triggerAttack(300, "0:0", Number(notes[index][1]));
                synth.frequency.setValueAtTime(Math.random() * (400 - 200) + 200, "0:0");
                synth.frequency.setTargetAtTime(Math.random() * (400 - 200) + 200, "0:2", 10);
                synth.frequency.setTargetAtTime(Math.random() * (400 - 200) + 200, "1:0", 10);
                synth.frequency.setTargetAtTime(Math.random() * (400 - 200) + 200, "1:2", 10);
                synth.frequency.exponentialRampToValueAtTime(Math.random() * (400 - 200) + 200, "2:0");
                synth.frequency.exponentialRampToValueAtTime(notes[index][0], "3:1");
                synth.triggerRelease("7:1");

                synth.volume.setValueAtTime(-50, "0:0");
                synth.volume.rampTo(-10, "1:3", "1:0");
            }, "0:0");
        });

        panners.forEach((panner) => {
            Tone.Transport.schedule(() => {
                panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, "0:2");
                panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, "1:0");
                panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, "1:2");
                panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, "2:0");
                panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, "0:2");
                panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, "1:0");
                panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, "1:2");
                panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, "2:0");
                panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, "0:2");
                panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, "1:0");
                panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, "1:2");
                panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, "2:0");

                panner.positionX.linearRampToValueAtTime(Math.random() * 0.1 - 0.05, "3:1");
                panner.positionY.linearRampToValueAtTime(Math.random() * 0.1 - 0.05, "3:1");
                panner.positionZ.linearRampToValueAtTime(Math.random() * 0.1 - 0.05, "3:1");
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
