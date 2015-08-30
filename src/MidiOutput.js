import { AudioletOutput } from 'audiolet/core';
import { MidiInput} from '.';

/**
 * Class representing a midi output of a MidiGroup
 */
class MidiOutput extends AudioletOutput {

  connect(input) {
    let midiInput;

    for (let i = 0; i < input.inputs.length; i++) {
      if (input.inputs[i] instanceof MidiInput) {
        midiInput = input.inputs[i];
      }
    }

    this.connectedTo = midiInput;
  }

  send(channel, key, vel) {
    this.connectedTo.node.midi(channel, key, vel);
  }

}

export default { MidiOutput };
