var FleetRow = (function () {
    function FleetRow() {
    }
    FleetRow.prototype.Save = function () {
        var json = new JsonFleetRow();
        json.shipName = ShipType[this.ship];
        json.count = this.count;
        return json;
    };
    FleetRow.prototype.Load = function (json) {
        this.ship = ShipType[json.shipName];
        this.count = json.count;
        return this;
    };
    return FleetRow;
}());
var Fraction = (function () {
    function Fraction() {
    }
    Fraction.prototype.Save = function () {
        var json = new JsonFractionData();
        json.id = this.id;
        json.color = this.color.Save();
        json.fleet = [];
        for (var i = 0; i < this.fleet.length; i++)
            json.fleet.push(this.fleet[i].Save());
        return json;
    };
    Fraction.prototype.Load = function (json) {
        this.id = json.id;
        this.color = new Color().Parse(json.color);
        this.fleet = [];
        for (var i = 0; i < json.fleet.length; i++)
            this.fleet.push(new FleetRow().Load(json.fleet[i]));
        return this;
    };
    Fraction.prototype.GetFleetRow = function (ship) {
        for (var i = 0; i < this.fleet.length; i++) {
            var temp = this.fleet[i];
            if (temp.ship === ship)
                return temp;
        }
        return null;
    };
    Fraction.prototype.ChangeShipsCount = function (ship, delta) {
        var row = this.GetFleetRow(ship);
        if (row == null) {
            row = new FleetRow();
            row.ship = ship;
            row.count = 0;
            this.fleet.push(row);
        }
        row.count += delta;
        if (row.count < 0) {
            row.count = 0;
            console.warn("Ships count < 0");
        }
    };
    Fraction.prototype.Init = function (id) {
        this.id = id;
        this.color = new Color();
        this.color.Randomize(50, 240);
        this.fleet = [];
        this.ChangeShipsCount(ShipType.Ship1, 3);
        this.ChangeShipsCount(ShipType.Ship5, 5);
        return this;
    };
    return Fraction;
}());
//# sourceMappingURL=Fractions.js.map