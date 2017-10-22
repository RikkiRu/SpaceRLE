class Station implements IRenderObject
{
    isMainStation = false;
    position: Vector2;

    Init(position: Vector2)
    {
        this.position = position;
        return this;
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.Station;
    }

    Draw(ctx: CanvasRenderingContext2D)
    {
        let spriteType = this.isMainStation ? ImageType.StationBig : ImageType.StationSmall;
        let img =  gameTS.imageLoader.Get(spriteType);
        ctx.drawImage(img.raw, this.position.x - img.raw.width / 2, this.position.y - img.raw.height / 2);
    }
}