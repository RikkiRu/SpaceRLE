/// <reference path="..\Scripts\typings\jquery-3.2.1.d.ts"/>
$(document).ready(function () {
    gameTS = new GameTS();
    gameTS.Start();
});
var ImageType;
(function (ImageType) {
    ImageType[ImageType["None"] = 0] = "None";
    ImageType[ImageType["StationSmall"] = 1] = "StationSmall";
    ImageType[ImageType["StationBig"] = 2] = "StationBig";
    ImageType[ImageType["Ship1"] = 3] = "Ship1";
})(ImageType || (ImageType = {}));
var RenderLayer;
(function (RenderLayer) {
    RenderLayer[RenderLayer["None"] = 0] = "None";
    RenderLayer[RenderLayer["SelectionGUI"] = 1] = "SelectionGUI";
    RenderLayer[RenderLayer["Bullets"] = 2] = "Bullets";
    RenderLayer[RenderLayer["Stations"] = 3] = "Stations";
    RenderLayer[RenderLayer["MediumShips"] = 4] = "MediumShips";
    RenderLayer[RenderLayer["GUI"] = 5] = "GUI";
})(RenderLayer || (RenderLayer = {}));
var GameTS = (function () {
    function GameTS() {
        this.time = 0;
    }
    GameTS.prototype.Start = function () {
        console.log("Start");
        this.canvas = new CanvasData().Init("canvasMain");
        this.time = (new Date).getTime();
        this.camera = new CameraData().Init();
        var scale = this.canvas.ctxSize.x / 1200;
        this.camera.scale = new Vector2().Init(scale, scale);
        this.mouseData = new MouseData().Init(this.canvas, this.camera);
        this.render = new Render().Init();
        this.renderUtils = new RenderUtils();
        this.imageLoader = new ImageLoader().Init();
        this.imageLoader.Add(ImageType.StationSmall, "Game/Sprites/tribase-u1-d0.png");
        this.imageLoader.Add(ImageType.StationBig, "Game/Sprites/tribase-u3-d0.png");
        this.imageLoader.Add(ImageType.Ship1, "Game/Sprites/ship1.png");
        this.imageLoader.Load(function () { gameTS.ResourcesLoaded(); });
        this.hireController = new HireController();
        this.shipsManager = new ShipsManager().Init();
        this.renderObjects = [];
        $("#newGameBtn").on('click touchstart', function () { alert("Touch start?"); gameTS.Restart(); });
        $("#hireShip1").on('click touchstart', function () { gameTS.hireController.PrepareToHire(ShipType.Ship1); });
        this.Restart();
    };
    GameTS.prototype.ResourcesLoaded = function () {
        console.log("ResourcesLoaded");
        this.render.PreRender();
        this.render.Render();
    };
    GameTS.prototype.Restart = function () {
        this.renderObjects = [];
        this.shipsManager.ships = [];
        var dxSmall = 350;
        var dySmall = 200;
        var dxBig = 400;
        // Team L
        this.shipsManager.SpawnShip(ShipType.StationSmall, Team.Left, new Vector2().Init(-dxSmall, dySmall), 0);
        this.shipsManager.SpawnShip(ShipType.StationSmall, Team.Left, new Vector2().Init(-dxSmall, -dySmall), 0);
        this.shipsManager.SpawnShip(ShipType.StationBig, Team.Left, new Vector2().Init(-dxBig, 0), 0);
        // Team R
        this.shipsManager.SpawnShip(ShipType.StationSmall, Team.Right, new Vector2().Init(dxSmall, dySmall), 0);
        this.shipsManager.SpawnShip(ShipType.StationSmall, Team.Right, new Vector2().Init(dxSmall, -dySmall), 0);
        this.shipsManager.SpawnShip(ShipType.StationBig, Team.Right, new Vector2().Init(dxBig, 0), 0);
    };
    GameTS.prototype.RemoveObject = function (obj) {
        for (var i = 0; i < this.renderObjects.length; i++) {
            var o = this.renderObjects[i];
            if (o === obj) {
                this.renderObjects.splice(i, 1);
                return;
            }
        }
    };
    GameTS.prototype.ProcessMouse = function (isDown) {
        if (isDown) {
            if (this.hireController.ProcessMouse(isDown))
                return;
        }
    };
    return GameTS;
}());
var gameTS;
//# sourceMappingURL=SpaceRLE.js.map