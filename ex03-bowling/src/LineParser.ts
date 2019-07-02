import Line from "./Line";
import Frame from "./Frame";
import Roll from "./Roll";
import StrikeRoll from "./roll/StrikeRoll";
import SpareRoll from "./roll/SpareRoll";
import NumberedRoll from "./roll/NumberedRoll";
import SingleRollFrame from "./frame/SingleRollFrame";
import DoubleRollsFrame from "./frame/DoubleRollsFrame";
import TripleRollsFrame from "./frame/TripleRollsFrame";

export default class LineParser {
    private parseRoll(pins : string, remain: number) : Roll {
        if (pins.toUpperCase() === "X") {
            return new StrikeRoll();
        } else if (pins === "/") {
            return new SpareRoll(10 - remain);
        } else if (pins === "-") {
            return new NumberedRoll(0);
        } else if (pins.match(/\d+/)) {
            return new NumberedRoll(parseInt(pins));
        } else {
            throw Error(`"Wrong roll ${pins}"`);
        }
    }

    readFromString(line: string) : Line {
        const rollQueue = line.split(/\s+/);
        const frames = new Array<Frame>();
        while(rollQueue.length > 0) {
            const pins = rollQueue.shift();
            const first = this.parseRoll(pins, 0);
            let frame;
            if (first instanceof StrikeRoll) {
                frame = new SingleRollFrame(first);
            } else {
                const second = this.parseRoll(rollQueue.shift(), first.getNumOfKnockedOutPins());
                frame = new DoubleRollsFrame(first, second);
            }
            if (frames.length > 0) {
                frames[frames.length - 1].setNextFrame(frame);
            }
            frames.push(frame);
            if (frames.length === 9) break;
        }

        if (rollQueue.length === 3) {
            const first = this.parseRoll(rollQueue.shift(), 0);
            const frame = new TripleRollsFrame(
                first,
                this.parseRoll(rollQueue.shift(), first.getNumOfKnockedOutPins()),
                this.parseRoll(rollQueue.shift(), 0)
            );
            frames[frames.length - 1].setNextFrame(frame);
            frames.push(frame);
        } else if (rollQueue.length === 2) {
            const first = this.parseRoll(rollQueue.shift(), 0);
            const frame = new DoubleRollsFrame(
                first,
                this.parseRoll(rollQueue.shift(), first.getNumOfKnockedOutPins())
            );
            frames[frames.length - 1].setNextFrame(frame);
            frames.push(frame);
        } else {
            throw Error('The last frame must contain 2 or 3 rolls');
        }
        return new Line(frames);
    }
}