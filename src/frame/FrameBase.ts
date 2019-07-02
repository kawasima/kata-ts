import { Frame } from "../frame";

export abstract class FrameBase implements Frame {
    nextFrame : Frame;

    setNextFrame(frame : Frame) {
        this.nextFrame = frame;
    }

    getNextFrame() : Frame | void {
        if (this.nextFrame) {
            return this.nextFrame;
        } 
    }

    abstract getScore() : number;
    abstract toFormattedString() : string;
}