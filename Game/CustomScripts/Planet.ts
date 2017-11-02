class Planet implements IRenderObject
{
    id: number;
    owner: Fraction;
    radius: number;
    position: Vector2;

    Save()
    {
        let json = new JsonPlanetData();

        json.id = this.id;

        if (this.owner == null)
            json.ownerID = 0;
        else
            json.ownerID = this.owner.id;

        json.radius = this.radius;
        json.position = this.position.Save();

        return json;
    }

    Load(json: JsonPlanetData)
    {
        this.id = json.id;

        if (json.ownerID == 0)
            this.owner = null;
        else
            this.owner = gameTS.saveDataController.GetFractionByID(json.ownerID);

        this.radius = json.radius;
        this.position = new Vector2().Parse(json.position);

        return this;
    }

    Init(id: number)
    {
        this.id = id;
        this.owner = null;
        this.radius = RenderUtils.instance.Random(10, 20);
        this.position = new Vector2().Init(0, 0);

        return this;
    }

    RandomizePosition()
    {
        let iterations = 0;
        let zone = gameTS.saveDataController.mapRect;

        while (true)
        {
            iterations++;
            if (iterations > 1000)
                throw new Error("Failed to generate planet position");

            let p = zone.GetRandomPoint();
            this.position = p;
            let closesPlanetID = gameTS.saveDataController.FindClosesPlanetTo(p);

            if (closesPlanetID == 0)
                return;
            else
            {
                let dist = gameTS.saveDataController.GetPlanetByID(closesPlanetID).position.DistTo(p);
                if (dist > 50)
                    return;
            }
        }
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.Planets;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.beginPath();

        if (this.owner == null)
            ctx.fillStyle = "#D0DB36";
        else
            this.owner.color.SetCtxFillStyle(ctx);

        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, Math.PI * 2, false);
        ctx.fill();
    }
}