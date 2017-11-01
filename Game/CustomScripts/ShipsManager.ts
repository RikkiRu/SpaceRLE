enum ShipType
{
    None,
    Ship1,
    StationSmall,
    StationBig,
    Ship4,
    Ship5,
}

class ShipsManager
{
    templates: Map<ShipType, ShipTemplate>;
    ships: Ship[];

    Init()
    {
        this.templates = new Map();

        // Medium
        let ship1 = new ShipTemplate();
        ship1.shipType = ShipType.Ship1;
        ship1.imageType = ImageType.Ship1;
        ship1.energyCost = 30;
        ship1.dieExplosionScale = 0.5;
        this.templates.set(ShipType.Ship1, ship1);

        // Small
        let ship4 = new ShipTemplate();
        ship4.shipType = ShipType.Ship4;
        ship4.imageType = ImageType.Ship4;
        ship4.energyCost = 15;
        ship4.maxMoveSpeed = 0.05;
        ship4.maxAngleSpeed = 0.002;
        ship4.targetsUpdateRate = 500;
        ship4.maxHP = 10;
        ship4.attackDist = 100;
        ship4.fireCooldown = 150;
        ship4.bulletsDamage = 10;
        ship4.bulletSize = 1;
        this.templates.set(ShipType.Ship4, ship4);

        // Big
        let ship5 = new ShipTemplate();
        ship5.shipType = ShipType.Ship5;
        ship5.imageType = ImageType.Ship5;
        ship5.energyCost = 50;
        ship5.maxMoveSpeed = 0.015;
        ship5.maxAngleSpeed = 0.00015;
        ship5.targetsUpdateRate = 2000;
        ship5.maxHP = 200;
        ship5.attackDist = 300;
        ship5.bulletsDamage = 25;
        ship5.bulletSize = 4;
        ship5.fireCooldown = 600;
        ship5.dieExplosionScale = 1;
        this.templates.set(ShipType.Ship5, ship5);

        let stationSmall = new ShipTemplate();
        stationSmall.shipType = ShipType.StationSmall;
        stationSmall.imageType = ImageType.StationSmall;
        stationSmall.isStation = true;
        stationSmall.attackDist = 320;
        stationSmall.maxHP = 200;
        stationSmall.dieExplosionScale = 1;
        this.templates.set(ShipType.StationSmall, stationSmall);

        let stationBig = new ShipTemplate();
        stationBig.shipType = ShipType.StationBig;
        stationBig.imageType = ImageType.StationBig;
        stationBig.isStation = true;
        stationBig.attackDist = 320;
        stationBig.maxHP = 250;
        stationBig.dieExplosionScale = 1;
        this.templates.set(ShipType.StationBig, stationBig);

        this.ships = [];

        return this;
    }

    SpawnBullet(team: Team, position: Vector2, angle: number, damage: number, bulletSize: number)
    {
        let bulletSpeed = 0.3;

        angle += (Math.random() - 0.5) * 0.3;

        let dx = Math.cos(angle) * bulletSpeed;
        let dy = Math.sin(angle) * bulletSpeed;
        let moveDelta = new Vector2().Init(dx, dy);

        let b = new Bullet();
        b.Init(team, position.Clone(), moveDelta, damage, bulletSize);
        gameTS.renderObjects.push(b);
    }

    SpawnShip(shipType: ShipType, team: Team, position: Vector2, angle: number)
    {
        let teamData = gameTS.teamManager.teams.get(team);
        let template = this.templates.get(shipType);

        if (!template.isStation && teamData.stations == 0)
             return;

        if (teamData.energy < template.energyCost)
            return;

        teamData.ChangeEnergy(-template.energyCost);

        if (template.isStation)
            teamData.stations++;

        let s = new Ship();
        s.template = template;
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
                if (o.template.isStation)
                {
                    let team = gameTS.teamManager.teams.get(o.team);
                    team.stations--;
                }

                this.ships.splice(i, 1);

                let a = new Animation(AnimationType.explosion, RenderLayer.Explosions, o.position.Clone());
                a.scale = o.template.dieExplosionScale;

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
            target.isDead = true;
            gameTS.RemoveObject(target);
            this.RemoveObject(target);
        }
        else
        {
            let hpText = new HpText();
            hpText.Init(damage.toString(), 700, target.position.Clone());
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
        pos.x += RenderUtils.instance.Random(-10, 11);
        this.txt = txt;
        this.lifeTime = lifeTime;
        this.pos = pos;
    }

    Update(dt: number)
    {
        this.pos.y -= dt * 0.05;

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
        ctx.font="15px Verdana";
        ctx.fillText(this.txt, this.pos.x, this.pos.y);
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
    isDead: boolean;

    Init()
    {
        this.isDead = false;

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
        if (!this.template.isStation)
        {
            let m = <ShipMind>this.mind;

            if (m.arriveCurrentLineHide > 0)
            {
                let alpha = m.arriveCurrentLineHide / m.arriveMaxLineHide;

               ctx.beginPath();
               ctx.lineWidth = 2;
               ctx.moveTo(m.arriveFromPosition.x, m.arriveFromPosition.y);

                //if (m.arriveMode)
                    ctx.lineTo(this.position.x, this.position.y);
                //else
                //    ctx.lineTo(m.arriveToPosition.x, m.arriveToPosition.y);

               //ctx.strokeStyle = "#FF0000";
               ctx.strokeStyle = 'rgba(255,0,0,' + alpha + ')';
               ctx.stroke();
            }
        }

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        let imgType = this.template.imageType;
        let img =  gameTS.imageLoader.Get(imgType);
        ctx.drawImage(img.raw, -img.raw.width / 2, -img.raw.height / 2);
        ctx.restore();

        //ctx.beginPath();
        //ctx.fillStyle = "#D82D33";
        //ctx.font="15px Verdana";
        //ctx.fillText((this.angle / Math.PI).toFixed(2).toString(), this.position.x, this.position.y + 20);
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

            if (ship.team === this.owner.team || ship.team === Team.None || ship.isDead)
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
    energyCost: number;
    bulletsDamage: number;
    bulletSize: number;
    dieExplosionScale: number;

    constructor()
    {
        this.isStation = false;
        this.attackDist = 170;
        this.maxMoveSpeed = 0.05;
        this.maxAngleSpeed = 0.001;
        this.targetsUpdateRate = 1000;
        this.fireCooldown = 300;
        this.maxHP = 100;
        this.energyCost = 0;
        this.bulletsDamage = 5;
        this.bulletSize = 2;
        this.dieExplosionScale = 0.3;
    }
}