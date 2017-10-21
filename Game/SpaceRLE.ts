/// <reference path="..\Scripts\typings\jquery-3.2.1.d.ts"/>

$(document).ready(function()
{
	gameTS = new GameTS();
	gameTS.Start();
});

class GameTS
{
	canvas: CanvasData;
	time = 0;
	camera: CameraData;
	mouseData: MouseData;
	render: Render;
	imageLoader: ImageLoader;

	imagePaths =
	[
		"Game/Sprites/ship1.png",
	]

 	Start()
	{
		console.log("Start");
		this.canvas = new CanvasData().Init("canvasMain");
		this.time = (new Date).getTime();
		this.camera = new CameraData().Init();
		this.mouseData = new MouseData().Init(this.canvas, this.camera);
		this.render = new Render().Init();
		this.imageLoader = new ImageLoader().Init(this.imagePaths, function() { gameTS.ResourcesLoaded(); });
	}

	ResourcesLoaded()
	{
		console.log("ResourcesLoaded");
		this.render.PreRender();
		this.render.Render();
	}
}

let gameTS: GameTS;