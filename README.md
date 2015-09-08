# audiolet-midi

audiolet-midi provides MIDI control support to Audiolet. like an AudioletGroup, a MidiGroup can have *n* audio inputs and *n* audio outputs. however, it also provides an additional optional MIDI input and MIDI output.

it exposes a `midi` method on your AudioletGroup, which maps MIDI command channels to instance methods. for instance, `group.midi(144, 70, 1);` will by proxy call `group.noteOn(70, 1)`, and `group.midi(128, 70, 1);` will call `group.noteOff(70, 1)`.

# use

## minimum viable example

this creates a MidiGroup with 1 audio output, 1 MIDI input, and 1 midi output. it does not produce any noise, and simply forwards all messages on midiIn to midiOut (the default behavior).

```
import { Audiolet } from 'audiolet/core';
import { MidiGroup } from 'audiolet-midi';

class Instrument extends MidiGroup {

  constructor(audiolet) {
    // 1 audio output, 1 MIDI input, 1 MIDI output
    super(audiolet, 1, 2, 0, 1);
  }

}

let audiolet = new Audiolet;
let instrument = new Instrument(audiolet);

instrument.connect(audiolet.output);
```

## less contrived example

this creates a MidiGroup with 1 audio output, and 1 MIDI input. it responds to `midi(144, x, x);` by overriding the default `noteOn` method on the MidIGroup.

```
import { Audiolet } from 'audiolet/core';
import { Sine } from 'audiolet/dsp';
import { MidiGroup } from 'audiolet-midi';

class Instrument extends MidiGroup {

  constructor(audiolet) {
    // 1 audio output, 1 MIDI input
    super(audiolet, 1, 1, 0, null);
    this.voices = {};
  }

  noteOn(key, velocity) {
    // a little help from http://subsynth.sourceforge.net/midinote2freq.html
    let frequency = (440 / 32) * Math.pow(2, ((key - 9) / 12));
    let audiolet = this.audiolet;
    let voice = new Sine(audiolet, frequency);
    let voices = this.voices;

    voice.connect(this.outputs[0]);
    voices[key] = voice;
  }

  noteOff(key, velocity) {
    let voices = this.voices;

    voices[key].remove();
  }

}

let audiolet = new Audiolet;
let instrument = new Instrument(audiolet);

instrument.connect(audiolet.output);

// start by sending a noteOn message
instrument.midi(144, 70, 1);

// turn the noteOff in a second
setTimeout(() => {
  instrument.midi(128, 70, 1);
}, 1000);
```
