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

    // need prerender here
    Draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        let offset = 0;
        let size = 0;

        if (this.owner != null)
        {
            let imgGalo = gameTS.imageLoader.Get(ImageType.PlanetGalo);
            let galoExtra = this.radius / 2;
            offset = -this.radius - galoExtra;
            size = this.radius * 2 + galoExtra * 2;
            ctx.drawImage(imgGalo.raw, offset, offset, size, size);
        }

        ctx.beginPath();

        if (this.owner == null)
            ctx.fillStyle = "#D0DB36";
        else
            this.owner.color.SetCtxFillStyle(ctx);

        ctx.ellipse(0, 0, this.radius, this.radius, 0, 0, Math.PI * 2, false);
        ctx.fill();

        let imgLight = gameTS.imageLoader.Get(ImageType.PlanetLight);
        let lightExtra = this.radius / 2;
        offset = -this.radius - lightExtra;
        size = this.radius * 2 + lightExtra * 2;
        ctx.drawImage(imgLight.raw, offset, offset, size, size);

        ctx.restore();
    }
}