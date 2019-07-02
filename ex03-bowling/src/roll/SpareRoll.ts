import NumberedRoll from "./NumberedRoll";

export default class SpareRoll extends NumberedRoll {
    constructor(numOfKnockedOutPins : number) {
        super(numOfKnockedOutPins);
    }

    getPrintableChars() : string {
        return "/";
    }
}