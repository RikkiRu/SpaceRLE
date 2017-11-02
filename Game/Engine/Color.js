var JsonColor = (function () {
    function JsonColor() {
    }
    return JsonColor;
}());
var Color = (function () {
    function Color() {
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 1;
    }
    Color.prototype.Save = function () {
        var color = new JsonColor();
        color.r = this.r;
        color.g = this.g;
        color.b = this.b;
        color.a = this.a;
        return color;
    };
    Color.prototype.Parse = function (data) {
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;
        return this;
    };
    // Min - include, max - exclude
    Color.prototype.Randomize = function (min, max) {
        this.r = RenderUtils.instance.Random(min, max);
        this.g = RenderUtils.instance.Random(min, max);
        this.b = RenderUtils.instance.Random(min, max);
        this.a = 1;
    };
    Color.prototype.SetCtxFillStyle = function (ctx) {
        ctx.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    return Color;
}());
//# sourceMappingURL=Color.js.map