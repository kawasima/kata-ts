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

export default class SingleRollFrame extends FrameBase {
    roll : Roll;

    constructor(roll : Roll) {
        super();
        this.roll = roll;
    }

    rollStream() : Sequence<Roll> {
        return sequenceOf(this.roll)
            .merge(nextFrameRollStream(this.getNextFrame()), v => v);
    }

    getScore() : number {
        const nextFrame = this.getNextFrame();
        if (nextFrame instanceof FrameBase) {
            return 10 + nextFrame
                .rollStream()
                .take(2)
                .map(roll => roll.getNumOfKnockedOutPins())
                .sum();
        } else {
            throw Error('ボーリングのルールがおかしい');
        }
        
    }

    toFormattedString() : string {
        return this.roll.getPrintableChars();
    }
}