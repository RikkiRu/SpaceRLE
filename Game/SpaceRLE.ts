/// <reference path="..\Scripts\typings\jquery-3.2.1.d.ts"/>

$(document).ready(function()
{
	gameTS = new GameTS();
	gameTS.Start();
});

enum GameMode
{
	None,
	Battle,
	Map,
}

enum ImageType
{
    None,
    StationSmall,
	StationBig,
	Ship1,
	Ship4,
	Ship5,
}

enum RenderLayer
{
	None,
	SelectionGUI,
	Planets,
	Bullets,
	Stations,
	MediumShips,
	Explosions,
	GUI,
}

class GameTS
{
	static readonly HireBtnPrefix = "#hireBtn_";

	canvas: CanvasData;
	time = 0;
	camera: CameraData;
	mouseData: MouseData;
	render: Render;
	imageLoader: ImageLoader;
	renderObjects: IRenderObject[];
	hireController: HireController;
	shipsManager: ShipsManager;
	teamManager: TeamManager;
	currentGameMode: GameMode;
	battleButtonsSubscribed: boolean;
	jsonSaveData: JsonSaveData;
	saveDataController: SaveDataControler;

 	Start()
	{
		console.log("Start");

		this.renderObjects = [];

		this.canvas = new CanvasData().Init("canvasMain");
		this.time = (new Date).getTime();
		this.camera = new CameraData().Init();
		let scale = this.canvas.ctxSize.x / 1200;
		this.camera.scale = new Vector2().Init(scale, scale);
		this.mouseData = new MouseData().Init(this.canvas, this.camera);
		this.render = new Render().Init();
		this.battleButtonsSubscribed = false;

		this.saveDataController = new SaveDataControler();

		this.imageLoader = new ImageLoader().Init();
		this.imageLoader.Add(ImageType.StationSmall, "Game/Sprites/tribase-u1-d0.png");
		this.imageLoader.Add(ImageType.StationBig, "Game/Sprites/tribase-u3-d0.png");
		this.imageLoader.Add(ImageType.Ship1, "Game/Sprites/ship1.png");
		this.imageLoader.Add(ImageType.Ship4, "Game/Sprites/ship4.png");
		this.imageLoader.Add(ImageType.Ship5, "Game/Sprites/ship5.png");
		this.imageLoader.AddMany("explosion", "Game/Sprites/explosion/", 20);
		this.imageLoader.Load(function() { gameTS.ResourcesLoaded(); });

		$("#newGameBtn").on('click touchstart', function() { gameTS.StartBattle(); });

		this.StartMap();
		//this.StartBattle();
	}

	SubscribeBattleButtons()
	{
		this.battleButtonsSubscribed = true;

		$("#hireShip1").on('click touchstart', function() { gameTS.hireController.PrepareToHire(ShipType.Ship1) });

		const values = Object.keys(ShipType).map(k => ShipType[k]).filter(v => typeof v === "string") as string[];

        for (var i in values)
        {
			let t: ShipType = ShipType[values[i]]

			if (t == ShipType.None)
				continue;

			let template = this.shipsManager.templates.get(t);

			if (template.isStation)
				continue;

			$(GameTS.HireBtnPrefix + values[i]).on('click touchstart', function() { gameTS.hireController.PrepareToHire(t) });
			$("#hireCost_" + values[i]).html(template.energyCost.toString());
		}
	}

	ResourcesLoaded()
	{
		console.log("ResourcesLoaded");
		this.render.PreRender();
		this.render.Render();
	}

	Clear()
	{
		this.currentGameMode = GameMode.None;
		this.renderObjects = [];
		this.hireController = null;
		this.shipsManager = null;
		this.teamManager = null;
		$("#battleGUI").hide();
	}

	StartMap()
	{
		this.Clear();
		this.currentGameMode = GameMode.Map;

		this.saveDataController.Generate();
		this.jsonSaveData = this.saveDataController.Save(); // Save load generated to check working of saving
		let json = JSON.stringify(this.jsonSaveData);
		let parsed = <JsonSaveData>JSON.parse(json);
		this.saveDataController.Load(parsed);
		this.saveDataController.LoadToGame();
	}

	StartBattle()
	{
		this.Clear();
		this.currentGameMode = GameMode.Battle;
		$("#battleGUI").show();

		this.hireController = new HireController();
		this.shipsManager = new ShipsManager().Init();
		this.teamManager = new TeamManager();

		if (!this.battleButtonsSubscribed)
			this.SubscribeBattleButtons()

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
		if (this.currentGameMode == GameMode.Battle && this.hireController.ProcessMouse(isDown))
			return;
	}
}

let gameTS: GameTS;