var Planet = (function () {
    function Planet() {
    }
    Planet.prototype.Save = function () {
        var json = new JsonPlanetData();
        json.id = this.id;
        if (this.owner == null)
            json.ownerID = 0;
        else
            json.ownerID = this.owner.id;
        json.radius = this.radius;
        json.position = this.position.Save();
        return json;
    };
    Planet.prototype.Load = function (json) {
        this.id = json.id;
        if (json.ownerID == 0)
            this.owner = null;
        else
            this.owner = gameTS.saveDataController.GetFractionByID(json.ownerID);
        this.radius = json.radius;
        this.position = new Vector2().Parse(json.position);
        return this;
    };
    Planet.prototype.Init = function (id) {
        this.id = id;
        this.owner = null;
        this.radius = RenderUtils.instance.Random(10, 20);
        this.position = new Vector2().Init(0, 0);
        return this;
    };
    Planet.prototype.RandomizePosition = function () {
        var iterations = 0;
        var zone = gameTS.saveDataController.mapRect;
        while (true) {
            iterations++;
            if (iterations > 1000)
                throw new Error("Failed to generate planet position");
            var p = zone.GetRandomPoint();
            this.position = p;
            var closesPlanetID = gameTS.saveDataController.FindClosesPlanetTo(p);
            if (closesPlanetID == 0)
                return;
            else {
                var dist = gameTS.saveDataController.GetPlanetByID(closesPlanetID).position.DistTo(p);
                if (dist > 50)
                    return;
            }
        }
    };
    Planet.prototype.GetLayer = function () {
        return RenderLayer.Planets;
    };
    // need prerender here
    Planet.prototype.Draw = function (ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        var offset = 0;
        var size = 0;
        if (this.owner != null) {
            var imgGalo = gameTS.imageLoader.Get(ImageType.PlanetGalo);
            var galoExtra = this.radius / 2;
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
        var imgLight = gameTS.imageLoader.Get(ImageType.PlanetLight);
        var lightExtra = this.radius / 2;
        offset = -this.radius - lightExtra;
        size = this.radius * 2 + lightExtra * 2;
        ctx.drawImage(imgLight.raw, offset, offset, size, size);
        ctx.restore();
    };
    return Planet;
}());
//# sourceMappingURL=Planet.js.map