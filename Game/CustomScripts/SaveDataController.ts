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

        save.fractions = [];
        for (let i=0; i<this.fractions.length; i++)
            save.fractions.push(this.fractions[i].Save());

        save.planets = [];
        for (let i=0; i<this.planets.length; i++)
            save.planets.push(this.planets[i].Save());

        return save;
    }

    Load(json: JsonSaveData)
    {
        this.playerFraction = json.playerFraction;
        this.mapRect = new Rect().Parse(json.mapRect);

        this.fractions = [];
        for(let i=0; i<json.fractions.length; i++)
            this.fractions.push(new Fraction().Load(json.fractions[i]));

        this.planets = [];
        for(let i=0; i<json.planets.length; i++)
            this.planets.push(new Planet().Load(json.planets[i]));
    }

    Generate()
    {
        this.mapRect = new Rect().Init(-300, -300, 600, 600);

        this.fractions = [];
        this.planets = [];

        this.playerFraction = 1;
        let playerFraction = new Fraction().Init(this.playerFraction);
        playerFraction.color.r = 0;
        playerFraction.color.g = 0;
        playerFraction.color.b = 255;
        this.fractions.push(playerFraction);

        let aiTeams = 5;
        let lastFractionId = 1;

        for (let i=0; i<aiTeams; i++)
        {
            lastFractionId++;
            this.fractions.push(new Fraction().Init(lastFractionId));
        }

        let planetsCount = 15;
        let lastPlanetId = 0;

        for (let i=0; i<planetsCount; i++)
        {
            lastPlanetId++;
            let planet = new Planet();
            planet.Init(lastPlanetId);
            planet.RandomizePosition();
            planet.owner = this.GetFractionByID(planet.id);
            if (planet.owner != null)
                planet.radius = 15;

            this.planets.push(planet);
        }
    }

    GetFractionByID(id: number): Fraction
    {
        for (let i=0; i<this.fractions.length; i++)
        {
            let temp = this.fractions[i];
            if (temp.id === id)
                return temp;
        }

        return null;
    }

    GetPlanetByID(id: number): Planet
    {
        for (let i=0; i<this.planets.length; i++)
        {
            let temp = this.planets[i];
            if (temp.id === id)
                return temp;
        }

        return null;
    }

    LoadToGame()
    {
        for (let i=0; i<this.planets.length; i++)
            gameTS.renderObjects.push(this.planets[i]);
    }

    FindClosesPlanetTo(p: Vector2): number
    {
        let minDist = Number.POSITIVE_INFINITY;
        let minID = 0;

        for (let i=0; i<this.planets.length; i++)
        {
            let tempPlanet = this.planets[i];
            let dist = tempPlanet.position.DistTo(p);

            if (dist < minDist)
            {
                minID = tempPlanet.id;
                minDist = dist;
            }
        }

        return minID;
    }
}

