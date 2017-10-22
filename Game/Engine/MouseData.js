var MouseData = (function () {
    function MouseData() {
        this.mouseDown = false;
    }
    MouseData.prototype.Init = function (canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        var self = this;
        canvas.html.addEventListener("mousemove", function (event) { self.UpdateRawGameCoords(event, this); });
        canvas.html.addEventListener("mousedown", function (event) { if (event.button === 0)
            self.MouseState(true); });
        canvas.html.addEventListener("mouseup", function (event) { if (event.button === 0)
            self.MouseState(false); });
        canvas.html.oncontextmenu = function (event) { return false; };
        return this;
    };
    MouseData.prototype.UpdateRawGameCoords = function (e, context) {
        var coords = context.getBoundingClientRect();
        this.rawPosition = new Vector2().Init(e.clientX - coords.left, e.clientY - coords.top);
        this.UpdateGameCoords();
    };
    MouseData.prototype.MouseState = function (isDown) {
        if (this.mouseDown === isDown)
            return;
        this.mouseDown = isDown;
        gameTS.ProcessMouse(isDown);
    };
    MouseData.prototype.UpdateGameCoords = function () {
        var centerOffsetX = (this.rawPosition.x - this.canvas.center.x) / this.camera.scale.x;
        var centerOffsetY = (this.rawPosition.y - this.canvas.center.y) / this.camera.scale.y;
        var x = Math.round(this.camera.position.x - this.canvas.ctxSize2.x + (this.canvas.center.x + centerOffsetX));
        var y = Math.round(this.camera.position.y - this.canvas.ctxSize2.y + (this.canvas.center.y + centerOffsetY));
        this.gamePosition = new Vector2().Init(x, y);
    };
    return MouseData;
}());
//# sourceMappingURL=MouseData.js.map