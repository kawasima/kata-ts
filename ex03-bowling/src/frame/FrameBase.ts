import Frame from "../Frame";
import Roll from "../Roll";
import Sequence from "sequency";

export default abstract class FrameBase implements Frame {
    nextFrame : Frame;

    setNextFrame(frame : Frame) {
        this.nextFrame = frame;
    }

    getNextFrame() : Frame | void {
        if (this.nextFrame) {
            return this.nextFrame;
        } 
    }

    abstract rollStream() : Sequence<Roll>;
    abstract getScore() : number;
    abstract toFormattedString() : string;
}