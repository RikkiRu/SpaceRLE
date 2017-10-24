var CanvasData = (function () {
    function CanvasData() {
    }
    Object.defineProperty(CanvasData.prototype, "ctxSize", {
        get: function () { return new Vector2().Init(this.html.clientWidth, this.html.clientHeight); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasData.prototype, "ctxSize2", {
        get: function () {
            var v = this.ctxSize;
            return v.Init(v.x / 2, v.y / 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasData.prototype, "ctx", {
        get: function () { return this.html.getContext('2d'); },
        enumerable: true,
        configurable: true
    });
    CanvasData.prototype.Init = function (canvasName) {
        this.canvasJquery = $("#" + canvasName);
        this.html = this.canvasJquery[0];
        var size = this.ctxSize;
        this.html.width = size.x;
        this.html.height = size.y;
        var coords = this.html.getBoundingClientRect();
        this.center = new Vector2().Init((coords.right - coords.left) / 2, (coords.bottom - coords.top) / 2);
        return this;
    };
    return CanvasData;
}());
//# sourceMappingURL=CanvasData.js.map