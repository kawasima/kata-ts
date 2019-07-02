import { Frame } from "./Frame";

export class Line {
    frames: Array<Frame>;

    constructor(frames : Array<Frame>) {
        this.frames = frames;
    }

    getScore() : number {
        return this.frames
            .map(f => f.getScore())
            .reduce((sum, score) => sum + score, 0);
    }

    print(c : Console) : void {
        c.log(
            this.frames
                .map(frame => frame.toFormattedString())
                .join(" ")
        );
    }
}