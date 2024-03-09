import * as Tone from "tone";

let reverb: Tone.Reverb;
let comp: Tone.Compressor;
let synths: Tone.Synth[] = [];
let panners: Tone.Panner3D[] = [];
let deepNoteChord: (string | number)[][];
let whenFinishedCallback: (param: boolean) => void;

export const initializeTonejs = (
    whenFinished: (param: boolean) => void,
    notes: (string | number)[][] = [
        ["F#6", 1 / 2.5],
        ["F#6", 1 / 2.5],
        ["F#6", 1 / 2.5],
        ["D6", 0.9 / 2.5],
        ["D6", 0.9 / 2.5],
        ["D6", 0.9 / 2.5],
        ["A5", 0.8 / 2.5],
        ["A5", 0.8 / 2.5],
        ["A5", 0.8 / 2.5],
        ["D5", 0.5 / 2.5],
        ["D5", 0.5 / 2.5],
        ["D5", 0.5 / 2.5],
        ["A4", 0.5 / 2.5],
        ["A4", 0.5 / 2.5],
        ["A4", 0.5 / 2.5],
        ["D4", 0.5 / 2.5],
        ["D4", 0.5 / 2.5],
        ["D4", 0.5 / 2.5],
        ["A3", 0.6 / 2.5],
        ["A3", 0.6 / 2.5],
        ["A3", 0.6 / 2.5],
        ["D3", 0.7 / 2.5],
        ["D3", 0.7 / 2.5],
        ["D3", 0.7 / 2.5],
        ["A2", 0.8 / 2.5],
        ["A2", 0.8 / 2.5],
        ["A2", 0.8 / 2.5],
        ["D2", 1.8 / 2.5],
        ["D2", 1.8 / 2.5],
        ["D2", 1.8 / 2.5],
        ["D1", 2.5 / 2.5],
        ["D1", 2.5 / 2.5],
    ]
): void => {
    deepNoteChord = notes;
    whenFinishedCallback = whenFinished;

    reverb = new Tone.Reverb({
        // TODO: make these customizable
        wet: 1,
        decay: 3,
        preDelay: 0.01,
    }).toDestination();
    comp = new Tone.Compressor(-16, 10).connect(reverb); // TODO: make this customizable

    for (let i = 0; i < 32; i++) {
        panners.push(
            new Tone.Panner3D({
                panningModel: "HRTF",
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

    Tone.Transport.bpm.value = 60; // TODO: make this customizable

    synths.forEach((synth, index) => {
        if ((index - 1) % 3 === 0) {
            // TODO: make these customizable
            synth.detune.value = 3;
        } else if ((index - 2) % 3 === 0) {
            synth.detune.value = -3;
        }
        synth.set({
            envelope: {
                attack: 1, // TODO: make this customizable
                decay: 0,
                sustain: 1,
                release: 1,
            },
        });

        // TODO: make these frequencies customizable
        // BUG: it doesnt ramp
        Tone.Transport.schedule((time) => {
            synth.triggerAttack(300, time, Number(deepNoteChord[index][1]));
        }, "0:0");
        Tone.Transport.schedule((time) => {
            synth.frequency.setValueAtTime(Math.random() * 200 + 200, time);
        }, "0:0");
        Tone.Transport.schedule((time) => {
            synth.frequency.exponentialRampToValueAtTime(Math.random() * 200 + 200, time);
        }, "0:3");
        Tone.Transport.schedule((time) => {
            synth.frequency.exponentialRampToValueAtTime(Math.random() * 200 + 200, time);
        }, "1:2");
        Tone.Transport.schedule((time) => {
            synth.frequency.exponentialRampToValueAtTime(Math.random() * 200 + 200, time);
        }, "2:0");
        Tone.Transport.schedule((time) => {
            synth.frequency.exponentialRampToValueAtTime(deepNoteChord[index][0], time);
        }, "3:1");
        Tone.Transport.schedule((time) => {
            synth.triggerRelease(time);
        }, "7:1");

        Tone.Transport.schedule((time) => {
            synth.volume.setValueAtTime(-40, time);
        }, "0:0");
        Tone.Transport.schedule((time) => {
            synth.volume.rampTo(-10, "1:3", time);
        }, "1:2");
    });

    panners.forEach((panner) => {
        // TODO: make these randomnesses customizable
        // BUG: it doesnt ramp
        Tone.Transport.schedule((time) => {
            panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "0:2");
        Tone.Transport.schedule((time) => {
            panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "1:0");
        Tone.Transport.schedule((time) => {
            panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "1:2");
        Tone.Transport.schedule((time) => {
            panner.positionX.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "2:0");
        Tone.Transport.schedule((time) => {
            panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "0:2");
        Tone.Transport.schedule((time) => {
            panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "1:0");
        Tone.Transport.schedule((time) => {
            panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "1:2");
        Tone.Transport.schedule((time) => {
            panner.positionY.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "2:0");
        Tone.Transport.schedule((time) => {
            panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "0:2");
        Tone.Transport.schedule((time) => {
            panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "1:0");
        Tone.Transport.schedule((time) => {
            panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "1:2");
        Tone.Transport.schedule((time) => {
            panner.positionZ.linearRampToValueAtTime(Math.random() * 5 - 2.5, time);
        }, "2:0");

        Tone.Transport.schedule((time) => {
            panner.positionX.linearRampToValueAtTime(Math.random() * 0.1 - 0.05, time);
        }, "3:1");
        Tone.Transport.schedule((time) => {
            panner.positionY.linearRampToValueAtTime(Math.random() * 0.1 - 0.05, time);
        }, "3:1");
        Tone.Transport.schedule((time) => {
            panner.positionZ.linearRampToValueAtTime(Math.random() * 0.1 - 0.05, time);
        }, "3:1");
    });

    Tone.Transport.schedule(() => {
        whenFinishedCallback(false);
    }, "7:2");
};

export const startDeepNote = () => {
    // BUG: for some reason this only plays once

    if (Tone.Transport.state === "started") {
        Tone.Transport.stop("+0");
    }

    Tone.Transport.start("+0.5");
};
