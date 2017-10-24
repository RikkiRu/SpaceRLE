/// <reference path="..\..\Scripts\typings\jquery-3.2.1.d.ts"/>
var MouseData = (function () {
    function MouseData() {
        this.mouseDown = false;
    }
    MouseData.prototype.Init = function (canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        var self = this;
        canvas.html.addEventListener("mousemove", function (event) { self.UpdateRawGameCoords(event, this); });
        canvas.canvasJquery.on('mousedown touchstart', function () { self.MouseState(true); });
        canvas.canvasJquery.on('mouseup touchend', function () { self.MouseState(false); });
        canvas.html.addEventListener("touchmove", function (event) { self.UpdateRawGameCoordsE(event, this); });
        canvas.html.oncontextmenu = function (event) { return false; };
        return this;
    };
    MouseData.prototype.UpdateRawGameCoordsE = function (e, context) {
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