import Roll from './Roll';
import Sequence  from 'sequency';

export default interface Frame {
    getScore(): number;
    getNextFrame(): Frame | void;
    rollStream(): Sequence<Roll>;
    setNextFrame(frame:Frame):void;
    toFormattedString(): string;
}

