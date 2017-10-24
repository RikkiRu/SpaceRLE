interface IRenderObject
{
    GetLayer(): RenderLayer;
    Draw(ctx:CanvasRenderingContext2D): void;
}

interface IUpdatable
{
    Update(dt: number);
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

        for (let i in gameTS.renderObjects)
        {
            let obj = gameTS.renderObjects[i];

            if ((<any>obj).Update !== undefined)
            {
                let updateble = <IUpdatable><any>obj;
                updateble.Update(dt);
            }
        }

        var ctx = gameTS.canvas.ctx;

        ctx.clearRect(0, 0, gameTS.canvas.ctxSize.x, gameTS.canvas.ctxSize.y);
        ctx.save();

        let ctxSize2 = gameTS.canvas.ctxSize2;

        ctx.translate(ctxSize2.x, ctxSize2.y);
        ctx.scale(gameTS.camera.scale.x, gameTS.camera.scale.y);
        ctx.translate(-ctxSize2.x, -ctxSize2.y);

        ctx.translate(-gameTS.camera.position.x + ctxSize2.x, -gameTS.camera.position.y + ctxSize2.y);

        let sort: Map<RenderLayer, IRenderObject[]> = new Map();

        for (let i in gameTS.renderObjects)
        {
            let obj = gameTS.renderObjects[i];
            let objLayer = obj.GetLayer();

            if (objLayer == RenderLayer.None)
                continue;

            let arr = sort.get(objLayer);

            if (arr == null)
            {
                arr = [];
                sort.set(objLayer, arr);
            }

            arr.push(obj);
        }

        const layersValues = Object.keys(RenderLayer).map(k => RenderLayer[k]);
        const layersNames = layersValues.filter(v => typeof v === "string") as string[];

        for (var i in layersNames)
        {
            var v: any = RenderLayer[layersNames[i]];
            let r: RenderLayer = v;

            let objs = sort.get(r);

            if (objs != null)
            {
                for (let j=0; j<objs.length; j++)
                {
                    let obj = objs[j];
                    obj.Draw(ctx);
                }
            }
        }

        ctx.restore();

        window.requestAnimationFrame(gameTS.render.Render);
    }
}