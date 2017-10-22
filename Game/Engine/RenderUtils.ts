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

    Pnpoly(point: Vector2, vs: Vector2[])
    {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

        var x = point.x;
        var y = point.y;

        var inside = false;

        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++)
        {
            var xi = vs[i].x, yi = vs[i].y;
            var xj = vs[j].x, yj = vs[j].y;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };
}