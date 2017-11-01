class SaveDataControler
{
    playerFraction: number;
    mapRect: Rect;
    fractions: Fraction[];
    planets: Planet[];

    Save()
    {
        let save = new JsonSaveData();

        save.playerFraction = this.playerFraction;
        save.mapRect = this.mapRect.Save();

        save.planets = [];
        for (let i=0; i<this.planets.length; i++)
            save.planets.push(this.planets[i].Save());

        save.fractions = [];
        for (let i=0; i<this.fractions.length; i++)
            save.fractions.push(this.fractions[i].Save());

        return save;
    }

    Load(json: JsonSaveData)
    {
        this.playerFraction = json.playerFraction;
        this.mapRect = new Rect().Parse(json.mapRect);

        this.planets = [];
        for(let i=0; i<json.planets.length; i++)
            this.planets.push(new Planet().Load(json.planets[i]));

        this.fractions = [];
        for(let i=0; i<json.fractions.length; i++)
            this.fractions.push(new Fraction().Load(json.fractions[i]));
    }

    Init()
    {
    }

    Generate()
    {
        let lastFractionId: number = 0;
        let lastPlanetId: number = 0;

        this.mapRect = new Rect().Init(-100, -100, 200, 200);

        this.fractions = [];
        this.planets = [];

        this.playerFraction = 1;
        lastFractionId = 1;

        let playerFraction = new Fraction().Init(this.playerFraction);
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

