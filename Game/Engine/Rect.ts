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

    MakeInside(v: Vector2)
    {
        let right = this.leftTop.x + this.size.x;
        let bottom = this.leftTop.y + this.size.y;

        let r = v.Clone();

        if (r.x < this.leftTop.x)
            r.x = this.leftTop.x;
        else if (r.x > right)
            r.x = right;

        if (r.y < this.leftTop.y)
            r.y = this.leftTop.y;
        else if(r.y > bottom)
            r.y = bottom;

        return r;
    }

    GetRandomPoint()
    {
        let x = gameTS.renderUtils.Random(this.leftTop.x, this.leftTop.x + this.size.x);
        let y = gameTS.renderUtils.Random(this.leftTop.y, this.leftTop.y + this.size.y);
        return new Vector2().Init(x, y);
    }
}