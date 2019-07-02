import Roll from '../Roll';

export default class StrikeRoll implements Roll {
    getNumOfKnockedOutPins() : number {
        return 10;
    }

    getPrintableChars() : string {
        return "X";
    }
}