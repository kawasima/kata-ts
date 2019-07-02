import Frame from "../Frame";
import FrameBase from "./FrameBase";
import Roll from "../Roll";
import Sequence, { sequenceOf, emptySequence } from 'sequency';
import StrikeRoll from "../roll/StrikeRoll";
import SpareRoll from "../roll/SpareRoll";

function nextFrameRollStream(frame : Frame | void) : Sequence<Roll> {
    if (frame instanceof FrameBase) {
        return frame.rollStream()
    } else {
        return emptySequence();
    }
}

export default class TripleRollsFrame extends FrameBase {
    first : Roll;
    second : Roll;
    third : Roll;

    constructor(first : Roll, second : Roll, third : Roll) {
        super();
        this.first = first;
        this.second = second;
        this.third = third;
    }

    rollStream() : Sequence<Roll> {
        return sequenceOf(this.first, this.second, this.third)
            .merge(nextFrameRollStream(this.getNextFrame()), v => v);
    }

    getScore() : number {
        if (this.first instanceof StrikeRoll) {
            return 10 + this.second.getNumOfKnockedOutPins() + this.third.getNumOfKnockedOutPins();
        } else if (this.second instanceof SpareRoll) {
            return 10 + this.third.getNumOfKnockedOutPins();
        } else {
            throw Error("First roll must be 'strike' or second roll must be 'spare'");
        }
    }

    toFormattedString() : string {
        return this.first.getPrintableChars() + " " + this.second.getPrintableChars() + " " + this.third.getPrintableChars();
    }
}