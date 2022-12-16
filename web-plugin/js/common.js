class TofuItem {
    constructor(name, weight) {
        this.name = name;
        this.weight = weight;
        console.log(this.toString());
    }
    toString() {
        return `TofuItem Name: ${this.name} Weight: ${this.weight}`;
    }
}

const STATUS = {
    Empty:  'empty',
    No_Food : 'no-food',
    NotEmpty : 'offset'
}