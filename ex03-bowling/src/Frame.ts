export interface Frame {
    getScore(): number;
    getNextFrame(): Frame | void;
    setNextFrame(frame:Frame):void;
    toFormattedString(): string;
}

