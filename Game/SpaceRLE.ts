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
	renderObjects: RenderObject[];

 	Start()
	{
		console.log("Start");
		this.canvas = new CanvasData().Init("canvasMain");
		this.time = (new Date).getTime();
		this.camera = new CameraData().Init();
		this.camera.scale = new Vector2().Init(0.2, 0.2);
		this.mouseData = new MouseData().Init(this.canvas, this.camera);
		this.render = new Render().Init();

		this.imageLoader = new ImageLoader().Init();
		this.imageLoader.Add(ImageType.StationSmall, "Game/Sprites/tribase-u1-d0.png");
		this.imageLoader.Add(ImageType.StationBig, "Game/Sprites/tribase-u3-d0.png");
		this.imageLoader.Load(function() { gameTS.ResourcesLoaded(); });

		this.renderObjects = [];
		$("#newGameBtn")[0].onclick = function() { gameTS.Restart(); };
		this.Restart();
	}

	ResourcesLoaded()
	{
		console.log("ResourcesLoaded");
		this.render.PreRender();
		this.render.Render();
	}

	Restart()
	{
		this.renderObjects = [];

		let dxSmall = 1750;
		let dySmall = 1000;
		let dxBig = 2050;

		// Team L

		let station1 = new Station();
		station1.Init(new Vector2().Init(-dxSmall, dySmall));
		this.renderObjects.push(station1);

		station1 = new Station();
		station1.Init(new Vector2().Init(-dxSmall, -dySmall));
		this.renderObjects.push(station1);

		station1 = new Station();
		station1.Init(new Vector2().Init(-dxBig, 0));
		station1.isMainStation = true;
		this.renderObjects.push(station1);

		// Team R

		station1 = new Station();
		station1.Init(new Vector2().Init(dxSmall, dySmall));
		this.renderObjects.push(station1);

		station1 = new Station();
		station1.Init(new Vector2().Init(dxSmall, -dySmall));
		this.renderObjects.push(station1);

		station1 = new Station();
		station1.Init(new Vector2().Init(dxBig, 0));
		station1.isMainStation = true;
		this.renderObjects.push(station1);
	}
}

let gameTS: GameTS;