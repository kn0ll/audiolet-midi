import { AudioletGroup, PassThroughNode } from 'audiolet/core';
import { MidiInput, MidiOutput } from '.';

/**
 * A MidiGroup is almost identical to an AudioletGroup, except it
 * let's you define which input and output index represent MidiInputs
 * and MidIOutputs. It additionally provides a `midi` method which
 * maps midi messages to instance methods. `.midi(144, 44, 255)` for instance,
 * will trigger .noteOn(44, 255);.
 *
 * The MidiInput, MidiOutput, and MidiGroup nodes all behave the same as Audiolet
 * objects for routing purposes- but `MidiOutput` has a unique method; `send`.
 * `send` will send a midi message to the node that output is connected to.
 */
class MidiGroup extends AudioletGroup {

  /*
   * Constructor
   *
   * @param {Audiolet} audiolet The audiolet object.
   * @param {Number} numberOfInputs The number of inputs.
   * @param {Number} numberOfOutputs The number of outputs.
   * @param {Number} midiIn The input index to use for midi in.
   * @param {Number} midiOut The output index to use for midi out.
   */
  constructor(audiolet, numberOfInputs, numberOfOutputs, midiIn, midiOut) {
    super(audiolet, 0, 0);
    let inputs = this.inputs;
    let outputs = this.outputs;

    for (let i = 0; i < numberOfInputs; i++) {
      if (i == midiIn) {
        inputs.push(new MidiInput(this, 1, 1));
      } else {
        inputs.push(new PassThroughNode(this.audiolet, 1, 1));
      }
    }

    for (let i = 0; i < numberOfOutputs; i++) {
      if (i == midiOut) {
        outputs.push(new MidiOutput(this, 1, 1));
       } else {
        outputs.push(new PassThroughNode(this.audiolet, 1, 1));
      }
    }

    this.commands = {
      144: 'noteOn',
      128: 'noteOff'
    };

    if (midiIn) {
      this.midiIn = this.inputs[midiIn];
    }

    if (midiOut) {
      this.midiOut = this.outputs[midiOut];
    }
  }

  midi(command, key, vel) {
    let method = this[this.commands[command]].bind(this);
    method(key, vel);
  }

  noteOn(key, vel) {
    this.midiOut && this.midiOut.send(144, key, vel);
  }

  noteOff(key, vel) {
    this.midiOut && this.midiOut.send(128, key, vel);
  }

}

export default { MidiGroup };
