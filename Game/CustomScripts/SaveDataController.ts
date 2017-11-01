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

class SaveDataControler
{
    save: ISavable[];

    fractions: Fraction[];
    planets: Planet[];
    playerFraction: number;
    mapRect: Rect;

    Save()
    {
        let save = new JsonSaveData();

        save.planets = [];
        for (let i=0; i<this.planets.length; i++)
            save.planets.push(this.planets[i].Save());

        return save;
    }

    Load(json: JsonSaveData)
    {
        this.planets = [];

        for(let i=0; i<json.planets.length; i++)
            this.planets.push(new Planet().Load(json.planets[i]));
    }




    data: SaveData;

    Init(data: SaveData)
    {
        this.data = data;

        this.data.mapRect = new Rect().Init(
            this.data.mapRect.leftTop.x,
            this.data.mapRect.leftTop.y,
            this.data.mapRect.size.x,
            this.data.mapRect.size.y)
    }

    Generate()
    {
        lastFractionId: number;
        lastPlanetId: number;
        mapRect: Rect;

        this.data.mapRect = new Rect().Init(-100, -100, 200, 200);

        this.data.fractions = new Map();
        this.data.planets = new Map();

        this.data.playerFraction = 1;
        this.data.lastFractionId = 1;
        let playerFraction = new FractionData().Init(this.data.playerFraction);
        playerFraction.color.r = 0;
        playerFraction.color.g = 0;
        playerFraction.color.b = 255;
        this.data.fractions.set(this.data.playerFraction, playerFraction);

        this.data.lastPlanetId = 0;

        let aiTeams = 5;

        for (let i=0; i<aiTeams; i++)
        {
            this.data.lastFractionId++;
            this.data.fractions.set(this.data.lastFractionId, new FractionData().Init(this.data.lastFractionId));
        }

        let planetsCount = 15;

        for (let i=0; i<planetsCount; i++)
        {
            this.data.lastPlanetId++;
            let planet = new Planet();
            planet.Init(this.data.lastPlanetId);

            if (this.data.fractions.has(planet.id))
               planet.ownerID = planet.id;

            this.data.planets.set(this.data.lastPlanetId, planet);
        }

        this.LoadToGame();
    }

    LoadToGame()
    {
        this.data.planets.forEach((value: Planet, key: number) =>
        {
            gameTS.renderObjects.push(value);
        });
    }

    FindClosesPlanetTo(p: Vector2): number
    {
        let minDist = Number.POSITIVE_INFINITY;
        let minID = 0;

        this.data.planets.forEach((value: Planet, key: number) =>
        {
            let dist = value.position.DistTo(p);

            if (dist < minDist)
            {
                minID = value.id;
                minDist = dist;
            }
        });

        return minID;
    }
}

