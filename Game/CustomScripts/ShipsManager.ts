enum ShipType
{
    None,
    Ship1,
    StationSmall,
    StationBig,
}

enum Team
{
    None,
    Left,
    Right,
}

class ShipsManager
{
    templates: Map<ShipType, ShipTemplate>;
    ships: Ship[];

    Init()
    {
        this.templates = new Map();

        let ship1 = new ShipTemplate();
        ship1.shipType = ShipType.Ship1;
        ship1.imageType = ImageType.Ship1;
        this.templates.set(ShipType.Ship1, ship1);

        let stationSmall = new ShipTemplate();
        stationSmall.shipType = ShipType.StationSmall;
        stationSmall.imageType = ImageType.StationSmall;
        stationSmall.isStation = true;
        this.templates.set(ShipType.StationSmall, stationSmall);

        let stationBig = new ShipTemplate();
        stationBig.shipType = ShipType.StationBig;
        stationBig.imageType = ImageType.StationBig;
        stationBig.isStation = true;
        this.templates.set(ShipType.StationBig, stationBig);

        this.ships = [];

        return this;
    }

    SpawnBullet(team: Team, position: Vector2, angle: number)
    {
        let bulletSpeed = 0.3;
        let dx = Math.cos(angle) * bulletSpeed;
        let dy = Math.sin(angle) * bulletSpeed;
        let moveDelta = new Vector2().Init(dx, dy);

        let b = new Bullet();
        b.Init(team, position.Clone(), moveDelta);
        gameTS.renderObjects.push(b);
    }

    SpawnShip(shipType: ShipType, team: Team, position: Vector2, angle: number)
    {
        let s = new Ship();
        s.template = this.templates.get(shipType);
        s.team = team;
        s.position = position;
        s.angle = angle;
        s.hp = s.template.maxHP;
        s.Init();
        this.ships.push(s);
        gameTS.renderObjects.push(s);
    }

    RemoveObject(obj: Ship)
	{
		for (let i=0; i<this.ships.length; i++)
		{
			let o = this.ships[i];
			if (o === obj)
			{
				this.ships.splice(i, 1);
				return;
			}
		}
	}

    DoDamage(target: Ship, damage: number)
    {
        if (target.hp < damage)
            target.hp = 0;
        else
            target.hp -= damage;

        if (target.hp <= 0)
        {
            gameTS.RemoveObject(target);
            this.RemoveObject(target);
        }
        else
        {
            let hpText = new HpText();
            hpText.Init(target.hp.toString(), 500, target.position.Clone());
            gameTS.renderObjects.push(hpText);
        }
    }
}

class HpText implements IRenderObject, IUpdatable
{
    txt: string;
    lifeTime: number;
    pos: Vector2;

    Init(txt: string, lifeTime: number, pos: Vector2)
    {
        this.txt = txt;
        this.lifeTime = lifeTime;
        this.pos = pos;
    }

    Update(dt: number)
    {
        this.pos.y -= dt * 0.02;

        this.lifeTime -= dt;
        if (this.lifeTime < 0)
            gameTS.RemoveObject(this);
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.GUI;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.beginPath();
        ctx.fillStyle = "#D82D33";
        ctx.fillText(this.txt, this.pos.x, this.pos.y);
    }
}

class Bullet implements IRenderObject, IUpdatable
{
    team: Team;
    position: Vector2;
    moveDelta: Vector2;
    damage: number;

    Init(team: Team, position: Vector2, moveDelta: Vector2)
    {
        this.team = team;
        this.position = position;
        this.moveDelta = moveDelta;
        this.damage = 10;
    }

    Update(dt: number)
    {
        this.position.x += this.moveDelta.x * dt;
        this.position.y += this.moveDelta.y * dt;

        for (let i in gameTS.shipsManager.ships)
        {
            let ship = gameTS.shipsManager.ships[i];

            if (ship.team === this.team || ship.team === Team.None)
                continue;

            if (this.position.DistTo(ship.position) < 20)
            {
                gameTS.RemoveObject(this);
                gameTS.shipsManager.DoDamage(ship, this.damage);
            }
        }

        if (!gameTS.hireController.battleRect.IsInside(this.position))
        {
            gameTS.RemoveObject(this);
        }
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.Bullets;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
       ctx.beginPath();
       ctx.fillStyle = "#D0DB36";
       ctx.ellipse(this.position.x, this.position.y, 2, 2, 0, 0, Math.PI * 2, false);
       ctx.fill();
    }
}

class Ship implements IRenderObject, IUpdatable
{
    template: ShipTemplate;
    team: Team;
    mind: IShipMind;
    position: Vector2;
    angle: number;
    hp: number;

    Init()
    {
        if (this.template.isStation)
            this.mind = new StationMind();
        else
            this.mind = new ShipMind();

        this.mind.Init(this);
    }

    Update(dt: number)
    {
        this.mind.Update(dt);
    }

    GetLayer(): RenderLayer
    {
        if (this.template.isStation)
            return RenderLayer.Stations;

        return RenderLayer.MediumShips;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        let imgType = this.template.imageType;
        let img =  gameTS.imageLoader.Get(imgType);
        ctx.drawImage(img.raw, -img.raw.width / 2, -img.raw.height / 2);
        ctx.restore();
    }
}

interface IShipMind extends IUpdatable
{
    Init(owner: Ship);
}

class Targeter
{
    owner: Ship;

    Init(owner: Ship)
    {
        this.owner = owner;
    }

    SearchTarget()
    {
        let minDist = Number.POSITIVE_INFINITY;
        let bestTarget: Ship = null;

        for (let i in gameTS.shipsManager.ships)
        {
            let ship = gameTS.shipsManager.ships[i];

            if (ship.team === this.owner.team || ship.team === Team.None)
                continue;

            let dist = this.owner.position.DistTo(ship.position);

            if (dist < minDist)
            {
                minDist = dist;
                bestTarget = ship;
            }
        }

        return bestTarget;
    }
}

class ShipTemplate
{
    imageType: ImageType;
    shipType: ShipType;
    isStation: boolean;
    attackDist: number;
    maxMoveSpeed: number;
    maxAngleSpeed: number;
    targetsUpdateRate: number;
    fireCooldown: number;
    maxHP: number;

    constructor()
    {
        this.isStation = false;
        this.attackDist = 150;
        this.maxMoveSpeed = 0.03;
        this.maxAngleSpeed = 0.0003;
        this.targetsUpdateRate = 1000;
        this.fireCooldown = 700;
        this.maxHP = 100;
    }
}