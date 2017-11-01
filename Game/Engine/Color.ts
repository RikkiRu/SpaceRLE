class JsonColor
{
    r: number;
    g: number;
    b: number;
    a: number;
}

class Color
{
    r: number;
    g: number;
    b: number;
    a: number;

    constructor()
    {
        this.r = 255;
        this.g = 255;
        this.b = 255;
        this.a = 1;
    }

    Save()
    {
        let color = new JsonColor();
        color.r = this.r;
        color.g = this.g;
        color.b = this.b;
        color.a = this.a;
        return color;
    }

    Parse(data: JsonColor)
    {
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;
        return this;
    }

    // Min - include, max - exclude
    Randomize(min: number, max: number)
    {
        this.r = RenderUtils.instance.Random(min, max);
        this.g = RenderUtils.instance.Random(min, max);
        this.b = RenderUtils.instance.Random(min, max);
        this.a = 1;
    }

    SetCtxFillStyle(ctx: CanvasRenderingContext2D)
    {
        ctx.fillStyle = "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
    }
}