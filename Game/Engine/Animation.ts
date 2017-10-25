enum AnimationType
{
    None,
    explosion,
}

class Animation implements IRenderObject, IUpdatable
{
    animationType: AnimationType;
    frameRate: number;
    currentTime: number;
    renderLayer: RenderLayer;
    position: Vector2;
    currentFrame: number;
    scale: number;

    constructor(animationType: AnimationType, renderLayer: RenderLayer, position: Vector2)
    {
        this.animationType = animationType;
        this.frameRate = 30;
        this.currentTime = 0;
        this.renderLayer = renderLayer;
        this.position = position;
        this.currentFrame = 0;
        this.scale = 1;
        gameTS.renderObjects.push(this);
    }

    Update(dt: number)
    {
        this.currentTime += dt;

        if (this.currentTime >= this.frameRate)
        {
            this.currentTime -= this.frameRate;
            this.currentFrame++;
            if (!gameTS.imageLoader.images.has(AnimationType[this.animationType] + this.currentFrame.toString()))
            {
                gameTS.RemoveObject(this);
            }
        }
    }

    GetLayer(): RenderLayer
    {
        return this.renderLayer;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.scale, this.scale);
        let img =  gameTS.imageLoader.images.get(AnimationType[this.animationType] + this.currentFrame.toString())
        ctx.drawImage(img.raw, -img.raw.width / 2, -img.raw.height / 2);
        ctx.restore();
    }
}