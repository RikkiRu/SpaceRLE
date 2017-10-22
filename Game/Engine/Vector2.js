var Vector2 = (function () {
    function Vector2() {
        this.x = 0;
        this.y = 0;
    }
    Vector2.prototype.Init = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Vector2.prototype.DistTo = function (v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    };
    return Vector2;
}());
//# sourceMappingURL=Vector2.js.map