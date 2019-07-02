import Roll from '../Roll';

export default class NumberedRoll implements Roll {
    numOfKnockedOutPins : number;

    constructor(numOfKnockedOutPins : number) {
        this.numOfKnockedOutPins = numOfKnockedOutPins;
    }

    getNumOfKnockedOutPins() : number {
        return this.numOfKnockedOutPins;
    }

    getPrintableChars() : string {
        return (this.numOfKnockedOutPins > 0) ? String(this.numOfKnockedOutPins) : "-";
    }
}