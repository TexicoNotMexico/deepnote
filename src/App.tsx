import { Button } from "@mui/material";
import * as Tone from "tone";

function startDeepNote() {
    const osc = new Tone.Oscillator().toDestination();
    osc.frequency.value = "C5";
    osc.frequency.rampTo("C1", 5);
    osc.start().stop("+8");
}

export default function App() {
    return (
        <Button
            variant="contained"
            onClick={() => {
                startDeepNote();
            }}
        >
            Play Deep Note
        </Button>
    );
}
