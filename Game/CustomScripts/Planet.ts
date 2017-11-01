class Planet implements IRenderObject
{
    id: number;
    ownerID: number;
    radius: number;
    position: Vector2;

    Save()
    {
        let json = new JsonPlanetData();

        json.id = this.id;
        json.ownerID = this.ownerID;
        json.radius = this.radius;
        json.position = this.position.Save();

        return json;
    }

    Load(json: JsonPlanetData)
    {
        this.id = json.id;
        this.ownerID = json.ownerID;
        this.radius = json.radius;
        this.position = new Vector2().Parse(json.position);

        return this;
    }

    Init(id: number)
    {
        this.id = id;
        this.ownerID = 0;
        this.radius = RenderUtils.instance.Random(5, 20);
        this.position = new Vector2().Init(0, 0);

        return this;
    }

    RandomizePosition(zone: Rect, planets: Map<number, Planet>)
    {
        let iterations = 0;

        while (true)
        {
            iterations++;
            if (iterations > 1000)
                throw new Error("Failed to generate planet position");

            let p = zone.GetRandomPoint();
            this.position = p;
            let closesPlanetID = gameTS.saveData.FindClosesPlanetTo(p);

            if (closesPlanetID == 0)
                return;
            else
            {
                let dist = planets.get(closesPlanetID).position.DistTo(p);
                if (dist > 20)
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
        ctx.fillStyle = "#D0DB36";
        // find owner and make fill style
        ctx.ellipse(this.position.x, this.position.y, this.radius, this.radius, 0, 0, Math.PI * 2, false);
        ctx.fill();
    }
}