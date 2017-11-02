var Fraction = (function () {
    function Fraction() {
    }
    Fraction.prototype.Save = function () {
        var json = new JsonFractionData();
        json.id = this.id;
        json.color = this.color.Save();
        return json;
    };
    Fraction.prototype.Load = function (json) {
        this.id = json.id;
        this.color = new Color().Parse(json.color);
        return this;
    };
    Fraction.prototype.Init = function (id) {
        this.id = id;
        this.color = new Color();
        this.color.Randomize(70, 256);
        return this;
    };
    return Fraction;
}());
//# sourceMappingURL=Fractions.js.map