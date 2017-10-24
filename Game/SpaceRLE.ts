/// <reference path="..\Scripts\typings\jquery-3.2.1.d.ts"/>

$(document).ready(function()
{
	gameTS = new GameTS();
	gameTS.Start();
});

enum ImageType
{
    None,
    StationSmall,
	StationBig,
	Ship1,
}

enum RenderLayer
{
	None,
	SelectionGUI,
	Bullets,
	Stations,
	MediumShips,
	GUI,
}

class GameTS
{
	canvas: CanvasData;
	time = 0;
	camera: CameraData;
	mouseData: MouseData;
	render: Render;
	imageLoader: ImageLoader;
	renderObjects: IRenderObject[];
	hireController: HireController;
	shipsManager: ShipsManager;
	renderUtils: RenderUtils;

 	Start()
	{
		console.log("Start");
		this.canvas = new CanvasData().Init("canvasMain");
		this.time = (new Date).getTime();
		this.camera = new CameraData().Init();
		this.camera.scale = new Vector2().Init(1, 1);
		this.mouseData = new MouseData().Init(this.canvas, this.camera);
		this.render = new Render().Init();
		this.renderUtils = new RenderUtils();

		this.imageLoader = new ImageLoader().Init();
		this.imageLoader.Add(ImageType.StationSmall, "Game/Sprites/tribase-u1-d0.png");
		this.imageLoader.Add(ImageType.StationBig, "Game/Sprites/tribase-u3-d0.png");
		this.imageLoader.Add(ImageType.Ship1, "Game/Sprites/ship1.png");
		this.imageLoader.Load(function() { gameTS.ResourcesLoaded(); });

		this.hireController = new HireController();
		this.shipsManager = new ShipsManager().Init();

		this.renderObjects = [];
		$("#newGameBtn").on('click touchstart', function() { gameTS.Restart(); });
		$("#hireShip1").on('click touchstart', function() { gameTS.hireController.PrepareToHire(ShipType.Ship1) });
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
		this.shipsManager.ships = [];

		let dxSmall = 350;
		let dySmall = 200;
		let dxBig = 400;

		// Team L

		this.shipsManager.SpawnShip(
			ShipType.StationSmall, Team.Left, new Vector2().Init(-dxSmall, dySmall), 0);

		this.shipsManager.SpawnShip(
			ShipType.StationSmall, Team.Left, new Vector2().Init(-dxSmall, -dySmall), 0);

		this.shipsManager.SpawnShip(
			ShipType.StationBig, Team.Left, new Vector2().Init(-dxBig, 0), 0);

		// Team R

		this.shipsManager.SpawnShip(
			ShipType.StationSmall, Team.Right, new Vector2().Init(dxSmall, dySmall), 0);

		this.shipsManager.SpawnShip(
			ShipType.StationSmall, Team.Right, new Vector2().Init(dxSmall, -dySmall), 0);

		this.shipsManager.SpawnShip(
			ShipType.StationBig, Team.Right, new Vector2().Init(dxBig, 0), 0);
	}

	RemoveObject(obj: IRenderObject)
	{
		for (let i=0; i<this.renderObjects.length; i++)
		{
			let o = this.renderObjects[i];
			if (o === obj)
			{
				this.renderObjects.splice(i, 1);
				return;
			}
		}
	}

	ProcessMouse(isDown: boolean)
	{
		if (isDown)
		{
			if (this.hireController.ProcessMouse(isDown))
				return;
		}
	}
}

let gameTS: GameTS;