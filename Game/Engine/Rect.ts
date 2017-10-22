class Rect
{
    leftTop: Vector2;
    size: Vector2;

    Init(left: number, top: number, width: number, height: number)
    {
        this.leftTop = new Vector2().Init(left, top);
        this.size = new Vector2().Init(width, height);
        return this;
    }

    Clone()
    {
        let clone = new Rect();
        clone.Init(this.leftTop.x, this.leftTop.y, this.size.x, this.size.y);
        return clone;
    }

    IsInside(v: Vector2)
    {
        return v.x >= this.leftTop.x
            && v.y >= this.leftTop.y
            && v.x <= this.leftTop.x + this.size.x
            && v.y <= this.leftTop.y + this.size.y;
    }

    GetRandomPoint()
    {
        let x = gameTS.renderUtils.Random(this.leftTop.x, this.leftTop.x + this.size.x);
        let y = gameTS.renderUtils.Random(this.leftTop.y, this.leftTop.y + this.size.y);
        return new Vector2().Init(x, y);
    }
}