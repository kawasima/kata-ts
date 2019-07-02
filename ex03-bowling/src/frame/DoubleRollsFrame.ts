import Frame from "../Frame";
import FrameBase from "./FrameBase";
import Roll from "../Roll";
import Sequence, { sequenceOf, emptySequence } from 'sequency';

function nextFrameRollStream(frame : Frame | void) : Sequence<Roll> {
    if (frame instanceof FrameBase) {
        return frame.rollStream()
    } else {
        return emptySequence();
    }
}

export default class DoubleRollsFrame extends FrameBase {
    first : Roll;
    second : Roll;

    constructor(first : Roll, second : Roll) {
        super();
        this.first = first;
        this.second = second;
    }

    rollStream() : Sequence<Roll> {
        return sequenceOf(this.first, this.second)
            .merge(nextFrameRollStream(this.getNextFrame()), v => v);
    }

    getScore() : number {
        const knockedPins = this.first.getNumOfKnockedOutPins() + this.second.getNumOfKnockedOutPins(); 
        const nextFrame = this.getNextFrame();
        if (knockedPins === 10) {
            if (nextFrame instanceof FrameBase) {
                return 10 + nextFrame
                    .rollStream()
                    .take(1)
                    .map(roll => roll.getNumOfKnockedOutPins())
                    .sum();
            } else {
                throw Error('ボーリングのルールがおかしい');
            }
        } else {
            return knockedPins;
        }
        
    }

    toFormattedString() : string {
        return this.first.getPrintableChars() + " " + this.second.getPrintableChars();
    }
}