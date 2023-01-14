class TofuItem {
    constructor(name, unit, quantity) {
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        console.log(this.toString());
    }
    toString() {
        return `TofuItem Name: ${this.name} quantity: ${this.quantity} unit: ${this.unit}`;
    }
}

const STATUS = {
    Empty: 'empty',
    HaveFood: 'offset'
}

//we need a convert table for like  "ct -> ounce". many convert GHGI support it.
const UNIT_Convert = {
    //"lb" : "pound", // found this valid short can auto convert by the API.
    //"oz" : "ounce",
    "ct": "oz", // not valid one?
    "fl oz": "oz"
}