interface RenderObject
{
    Draw(ctx:CanvasRenderingContext2D);
}

class Render
{
    Init()
    {
        return this;
    }

    PreRender(){}

    Render()
    {
        // Calculating time delta
        var now = (new Date).getTime();
        var dt = now - gameTS.time;
        gameTS.time = now;

        var ctx = gameTS.canvas.ctx;

        ctx.clearRect(0, 0, gameTS.canvas.ctxSize.x, gameTS.canvas.ctxSize.y);
        ctx.save();

        let ctxSize2 = gameTS.canvas.ctxSize2;

        ctx.translate(ctxSize2.x, ctxSize2.y);
        ctx.scale(gameTS.camera.scale.x, gameTS.camera.scale.y);
        ctx.translate(-ctxSize2.x, -ctxSize2.y);

        ctx.translate(-gameTS.camera.position.x + ctxSize2.x, -gameTS.camera.position.y + ctxSize2.y);

        // Идея для слоёв: пройти 1 по всем раз формируя список слоёв используя enum и тут же отрисовывая 1ый
        // Дорисовать остальные

        for (let i in gameTS.renderObjects)
        {
            let obj = gameTS.renderObjects[i];
            obj.Draw(ctx);
             //ctx.drawImage(gameTS.imageLoader.images[0].raw, -32, -32, 64, 64);
        }

        ctx.restore();

        window.requestAnimationFrame(gameTS.render.Render);
    }
}