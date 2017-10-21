/// <reference path="..\Scripts\typings\jquery-3.2.1.d.ts"/>
$(document).ready(function () {
    gameTS = new GameTS();
    gameTS.Start();
});
var GameTS = (function () {
    function GameTS() {
        this.time = 0;
        this.imagePaths = [
            "Game/Sprites/ship1.png",
        ];
    }
    GameTS.prototype.Start = function () {
        console.log("Start");
        this.canvas = new CanvasData().Init("canvasMain");
        this.time = (new Date).getTime();
        this.camera = new CameraData().Init();
        this.mouseData = new MouseData().Init(this.canvas, this.camera);
        this.render = new Render().Init();
        this.imageLoader = new ImageLoader().Init(this.imagePaths, function () { gameTS.ResourcesLoaded(); });
    };
    GameTS.prototype.ResourcesLoaded = function () {
        console.log("ResourcesLoaded");
        this.render.PreRender();
        this.render.Render();
    };
    return GameTS;
}());
var gameTS;
//# sourceMappingURL=SpaceRLE.js.map