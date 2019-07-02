import { Roll } from '../roll';

export class StrikeRoll implements Roll {
    getNumOfKnockedOutPins() : number {
        return 10;
    }

    getPrintableChars() : string {
        return "X";
    }
}