/// <reference path="..\..\Scripts\typings\jquery-3.2.1.d.ts"/>
var MouseData = (function () {
    function MouseData() {
        this.mouseDown = false;
    }
    MouseData.prototype.Init = function (canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        var self = this;
        this.gamePosition = new Vector2().Init(0, 0);
        this.rawPosition = new Vector2().Init(0, 0);
        canvas.html.addEventListener("mousemove", function (event) { self.UpdateRawGameCoords(event, this); });
        canvas.html.addEventListener("mousedown", function (event) { self.MouseState(event, this, true); });
        canvas.html.addEventListener("mouseup", function (event) { self.MouseState(event, this, false); });
        canvas.html.addEventListener("touchstart", function (event) { self.MouseStateTouch(event, this, true); });
        canvas.html.addEventListener("touchend", function (event) { self.MouseStateTouch(event, this, false); });
        canvas.html.addEventListener("touchmove", function (event) { self.UpdateRawGameCoordsTouch(event, this); });
        canvas.html.oncontextmenu = function (event) { return false; };
        return this;
    };
    MouseData.prototype.UpdateRawGameCoordsTouch = function (e, context) {
        if (e.touches.length < 1)
            return;
        var coords = context.getBoundingClientRect();
        this.rawPosition = new Vector2().Init(e.touches[0].clientX - coords.left, e.touches[0].clientY - coords.top);
        this.UpdateGameCoords();
    };
    MouseData.prototype.UpdateRawGameCoords = function (e, context) {
        var coords = context.getBoundingClientRect();
        this.rawPosition = new Vector2().Init(e.clientX - coords.left, e.clientY - coords.top);
        this.UpdateGameCoords();
    };
    MouseData.prototype.MouseStateTouch = function (e, context, isDown) {
        if (this.mouseDown === isDown)
            return;
        gameTS.mouseData.UpdateRawGameCoordsTouch(e, context);
        this.mouseDown = isDown;
        gameTS.ProcessMouse(isDown);
    };
    MouseData.prototype.MouseState = function (e, context, isDown) {
        if (this.mouseDown === isDown)
            return;
        gameTS.mouseData.UpdateRawGameCoords(e, context);
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