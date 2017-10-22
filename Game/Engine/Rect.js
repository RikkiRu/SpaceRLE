var Rect = (function () {
    function Rect() {
    }
    Rect.prototype.Init = function (left, top, width, height) {
        this.leftTop = new Vector2().Init(left, top);
        this.size = new Vector2().Init(width, height);
        return this;
    };
    Rect.prototype.Clone = function () {
        var clone = new Rect();
        clone.Init(this.leftTop.x, this.leftTop.y, this.size.x, this.size.y);
        return clone;
    };
    Rect.prototype.IsInside = function (v) {
        return v.x >= this.leftTop.x
            && v.y >= this.leftTop.y
            && v.x <= this.leftTop.x + this.size.x
            && v.y <= this.leftTop.y + this.size.y;
    };
    Rect.prototype.GetRandomPoint = function () {
        var x = gameTS.renderUtils.Random(this.leftTop.x, this.leftTop.x + this.size.x);
        var y = gameTS.renderUtils.Random(this.leftTop.y, this.leftTop.y + this.size.y);
        return new Vector2().Init(x, y);
    };
    return Rect;
}());
//# sourceMappingURL=Rect.js.map