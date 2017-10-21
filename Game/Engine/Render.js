var Render = (function () {
    function Render() {
    }
    Render.prototype.Init = function () {
        return this;
    };
    Render.prototype.PreRender = function () { };
    Render.prototype.Render = function () {
        // Calculating time delta
        var now = (new Date).getTime();
        var dt = now - gameTS.time;
        gameTS.time = now;
        var ctx = gameTS.canvas.ctx;
        ctx.clearRect(0, 0, gameTS.canvas.ctxSize.x, gameTS.canvas.ctxSize.y);
        ctx.save();
        // Render all by layers
        ctx.drawImage(gameTS.imageLoader.images[0].raw, 0, 0, 64, 64);
        ctx.restore();
        window.requestAnimationFrame(gameTS.render.Render);
    };
    return Render;
}());
//# sourceMappingURL=Render.js.map