import { NumberedRoll } from "./NumberedRoll";

export class SpareRoll extends NumberedRoll {
    constructor(numOfKnockedOutPins : number) {
        super(numOfKnockedOutPins);
    }

    getPrintableChars() : string {
        return "/";
    }
}