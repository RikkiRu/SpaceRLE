var HireController = (function () {
    function HireController() {
        var dx = 30;
        var w = 250;
        var h = 600;
        var t = -h / 2;
        this.hireZoneRectL = new Rect().Init(-w - dx, t, w, h);
        this.hireZoneRectR = new Rect().Init(dx, t, w, h);
        this.battleRect = new Rect().Init(-450, -300, 900, 600);
    }
    HireController.prototype.PrepareToHire = function (shipType) {
        if (this.shipPreview != null)
            gameTS.RemoveObject(this.shipPreview);
        if (this.hireZone != null)
            gameTS.RemoveObject(this.hireZone);
        this.hireZone = new HireZone();
        this.hireZone.Init(this.hireZoneRectL);
        gameTS.renderObjects.push(this.hireZone);
        this.shipType = shipType;
    };
    HireController.prototype.ProcessMouse = function (isDown) {
        if (this.hireZone == null)
            return;
        if (isDown) {
            if (this.shipPreview == null) {
                this.shipPreview = new ShipPreview();
                this.shipPreview.Init(this.shipType);
                gameTS.renderObjects.push(this.shipPreview);
                console.log("create preview");
            }
            return false;
        }
        if (this.shipPreview != null) {
            if (this.hireZoneRectL.IsInside(gameTS.mouseData.gamePosition)) {
                gameTS.shipsManager.SpawnShip(this.shipPreview.shipType, Team.Left, gameTS.mouseData.gamePosition, this.shipPreview.shipAngle);
                gameTS.shipsManager.SpawnShip(this.shipPreview.shipType, Team.Right, this.hireZoneRectR.GetRandomPoint(), gameTS.renderUtils.DegToRad(180));
            }
            gameTS.RemoveObject(this.shipPreview);
            this.shipPreview = null;
        }
        gameTS.RemoveObject(this.hireZone);
        this.hireZone = null;
        return false;
    };
    return HireController;
}());
var HireZone = (function () {
    function HireZone() {
    }
    HireZone.prototype.Init = function (rect) {
        this.rect = rect;
    };
    HireZone.prototype.GetLayer = function () {
        return RenderLayer.SelectionGUI;
    };
    HireZone.prototype.Draw = function (ctx) {
        console.log("drw");
        ctx.fillStyle = "#251F42";
        ctx.fillRect(this.rect.leftTop.x, this.rect.leftTop.y, this.rect.size.x, this.rect.size.y);
    };
    return HireZone;
}());
var ShipPreview = (function () {
    function ShipPreview() {
    }
    ShipPreview.prototype.Init = function (shipType) {
        this.shipType = shipType;
        this.shipAngle = gameTS.renderUtils.DegToRad(0);
    };
    ShipPreview.prototype.GetLayer = function () {
        return RenderLayer.GUI;
    };
    ShipPreview.prototype.Draw = function (ctx) {
        ctx.save();
        var pos = gameTS.mouseData.gamePosition;
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.shipAngle);
        var imgType = gameTS.shipsManager.templates.get(this.shipType).imageType;
        var img = gameTS.imageLoader.Get(imgType);
        ctx.drawImage(img.raw, -img.raw.width / 2, -img.raw.height / 2);
        ctx.restore();
    };
    return ShipPreview;
}());
//# sourceMappingURL=HireController.js.map