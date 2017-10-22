class RenderUtils
{
    DegToRad(v: number)
    {
        return v * Math.PI / 180;
    }

    Random(m: number, n: number)
    {
        return Math.floor(Math.random() * (n - m)) + m;
    };
}