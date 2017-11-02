var JsonRect = (function () {
    function JsonRect() {
    }
    return JsonRect;
}());
var Rect = (function () {
    function Rect() {
    }
    Rect.prototype.Init = function (left, top, width, height) {
        this.leftTop = new Vector2().Init(left, top);
        this.size = new Vector2().Init(width, height);
        return this;
    };
    Rect.prototype.Parse = function (data) {
        this.leftTop = new Vector2().Parse(data.leftTop);
        this.size = new Vector2().Parse(data.size);
        return this;
    };
    Rect.prototype.Save = function () {
        var rect = new JsonRect();
        rect.leftTop = this.leftTop.Save();
        rect.size = this.size.Save();
        return rect;
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
    Rect.prototype.MakeInside = function (v) {
        var right = this.leftTop.x + this.size.x;
        var bottom = this.leftTop.y + this.size.y;
        var r = v.Clone();
        if (r.x < this.leftTop.x)
            r.x = this.leftTop.x;
        else if (r.x > right)
            r.x = right;
        if (r.y < this.leftTop.y)
            r.y = this.leftTop.y;
        else if (r.y > bottom)
            r.y = bottom;
        return r;
    };
    Rect.prototype.GetRandomPoint = function () {
        var x = RenderUtils.instance.Random(this.leftTop.x, this.leftTop.x + this.size.x);
        var y = RenderUtils.instance.Random(this.leftTop.y, this.leftTop.y + this.size.y);
        return new Vector2().Init(x, y);
    };
    return Rect;
}());
//# sourceMappingURL=Rect.js.map