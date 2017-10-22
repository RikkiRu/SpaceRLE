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
        var ctxSize2 = gameTS.canvas.ctxSize2;
        ctx.translate(ctxSize2.x, ctxSize2.y);
        ctx.scale(gameTS.camera.scale.x, gameTS.camera.scale.y);
        ctx.translate(-ctxSize2.x, -ctxSize2.y);
        ctx.translate(-gameTS.camera.position.x + ctxSize2.x, -gameTS.camera.position.y + ctxSize2.y);
        var sort = new Map();
        for (var i_1 in gameTS.renderObjects) {
            var obj = gameTS.renderObjects[i_1];
            var objLayer = obj.GetLayer();
            var arr = sort.get(objLayer);
            if (arr == null) {
                arr = [];
                sort.set(objLayer, arr);
            }
            arr.push(obj);
        }
        var layersValues = Object.keys(RenderLayer).map(function (k) { return RenderLayer[k]; });
        var layersNames = layersValues.filter(function (v) { return typeof v === "string"; });
        for (var i in layersNames) {
            var v = RenderLayer[layersNames[i]];
            var r = v;
            var objs = sort.get(r);
            if (objs != null) {
                for (var j = 0; j < objs.length; j++) {
                    var obj = objs[j];
                    obj.Draw(ctx);
                }
            }
        }
        ctx.restore();
        window.requestAnimationFrame(gameTS.render.Render);
    };
    return Render;
}());
//# sourceMappingURL=Render.js.map