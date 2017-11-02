var SaveDataControler = (function () {
    function SaveDataControler() {
    }
    SaveDataControler.prototype.Save = function () {
        var save = new JsonSaveData();
        save.playerFraction = this.playerFraction;
        save.mapRect = this.mapRect.Save();
        save.fractions = [];
        for (var i = 0; i < this.fractions.length; i++)
            save.fractions.push(this.fractions[i].Save());
        save.planets = [];
        for (var i = 0; i < this.planets.length; i++)
            save.planets.push(this.planets[i].Save());
        return save;
    };
    SaveDataControler.prototype.Load = function (json) {
        this.playerFraction = json.playerFraction;
        this.mapRect = new Rect().Parse(json.mapRect);
        this.fractions = [];
        for (var i = 0; i < json.fractions.length; i++)
            this.fractions.push(new Fraction().Load(json.fractions[i]));
        this.planets = [];
        for (var i = 0; i < json.planets.length; i++)
            this.planets.push(new Planet().Load(json.planets[i]));
    };
    SaveDataControler.prototype.Generate = function () {
        this.mapRect = new Rect().Init(-300, -300, 600, 600);
        this.fractions = [];
        this.planets = [];
        this.playerFraction = 1;
        var playerFraction = new Fraction().Init(this.playerFraction);
        playerFraction.color.r = 0;
        playerFraction.color.g = 0;
        playerFraction.color.b = 255;
        this.fractions.push(playerFraction);
        var aiTeams = 5;
        var lastFractionId = 1;
        for (var i = 0; i < aiTeams; i++) {
            lastFractionId++;
            this.fractions.push(new Fraction().Init(lastFractionId));
        }
        var planetsCount = 15;
        var lastPlanetId = 0;
        for (var i = 0; i < planetsCount; i++) {
            lastPlanetId++;
            var planet = new Planet();
            planet.Init(lastPlanetId);
            planet.RandomizePosition();
            planet.owner = this.GetFractionByID(planet.id);
            if (planet.owner != null)
                planet.radius = 15;
            this.planets.push(planet);
        }
    };
    SaveDataControler.prototype.GetFractionByID = function (id) {
        for (var i = 0; i < this.fractions.length; i++) {
            var temp = this.fractions[i];
            if (temp.id === id)
                return temp;
        }
        return null;
    };
    SaveDataControler.prototype.GetPlanetByID = function (id) {
        for (var i = 0; i < this.planets.length; i++) {
            var temp = this.planets[i];
            if (temp.id === id)
                return temp;
        }
        return null;
    };
    SaveDataControler.prototype.LoadToGame = function () {
        for (var i = 0; i < this.planets.length; i++)
            gameTS.renderObjects.push(this.planets[i]);
    };
    SaveDataControler.prototype.FindClosesPlanetTo = function (p) {
        var minDist = Number.POSITIVE_INFINITY;
        var minID = 0;
        for (var i = 0; i < this.planets.length; i++) {
            var tempPlanet = this.planets[i];
            var dist = tempPlanet.position.DistTo(p);
            if (dist < minDist) {
                minID = tempPlanet.id;
                minDist = dist;
            }
        }
        return minID;
    };
    return SaveDataControler;
}());
//# sourceMappingURL=SaveDataController.js.map