var JsonVector2 = (function () {
    function JsonVector2() {
    }
    return JsonVector2;
}());
var Vector2 = (function () {
    function Vector2() {
        this.x = 0;
        this.y = 0;
    }
    Vector2.prototype.Save = function () {
        var json = new JsonVector2();
        json.x = this.x;
        json.y = this.y;
        return json;
    };
    Vector2.prototype.Parse = function (data) {
        this.x = data.x;
        this.y = data.y;
        return this;
    };
    Vector2.prototype.Init = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Vector2.prototype.DistTo = function (v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    };
    Vector2.prototype.Clone = function () {
        return new Vector2().Init(this.x, this.y);
    };
    return Vector2;
}());
//# sourceMappingURL=Vector2.js.map