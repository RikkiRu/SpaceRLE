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

    SpawnShip(shipType: ShipType, team: Team, position: Vector2, angle: number)
    {
        let s = new Ship();
        s.template = this.templates.get(shipType);
        s.team = team;
        s.position = position;
        s.angle = angle;
        s.Init();
        this.ships.push(s);
        gameTS.renderObjects.push(s);
    }
}

class Ship implements IRenderObject, IUpdatable
{
    template: ShipTemplate;
    team: Team;
    mind: IShipMind;
    position: Vector2;
    angle: number;

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

        // if (!this.template.isStation)
        // {
        //     let m = <ShipMind><any>this.mind;
        //     if(m.target != null)
        //     {
        //         let color = "#FF0000";
        //         if(this.team == Team.Left)
        //             color = "#0000FF"

        //         ctx.beginPath();
        //         ctx.moveTo(this.position.x, this.position.y);
        //         ctx.lineTo(m.target.position.x, m.target.position.y);
        //         ctx.lineWidth = 2;
        //         ctx.strokeStyle = color;
        //         ctx.stroke();

        //         ctx.fillStyle = color;
        //         ctx.fillRect(this.position.x, this.position.y, 10, 10);
        //     }
        // }
    }
}

interface IShipMind extends IUpdatable
{
    Init(owner: Ship);
}

class StationMind implements IShipMind
{
    Init(owner: Ship)
    {
    }
    Update(dt: number)
    {
    }
}

class ShipMind implements IShipMind
{
    owner: Ship;
    target: Ship;

    Init(owner: Ship)
    {
        this.owner = owner;
        this.SearchTarget();
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

    Update(dt: number)
    {
        if (this.target == null)
            this.target = this.SearchTarget();

        if (this.target == null)
            return;

        this.RotateTo(this.target, dt);
        this.FlyTo(this.target, dt);
    }

    FlyTo(target: Ship, dt: number)
    {
        //if (this.owner.position.DistTo(target.position) <= this.owner.template.attackDist)
        //    return;

        let dx = Math.cos(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;
        let dy = Math.sin(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;

        this.owner.position.x += dx;
        this.owner.position.y += dy;
    }

    RotateTo(target: Ship, dt: number)
    {
        let currentPos = this.owner.position;
        let targetPos = target.position;
        let currentAngle = this.owner.angle;

        let targetAngle = 0;

        if (currentPos.x > targetPos.x)
        {
            let dx = targetPos.x - currentPos.x;
            let dy = targetPos.y - currentPos.y;
            targetAngle = Math.atan(dy / dx) + gameTS.renderUtils.DegToRad(180);
        }
        else
        {
            let dx = currentPos.x - targetPos.x;
            let dy = currentPos.y - targetPos.y;
            targetAngle = Math.atan(dy / dx);
        }

        let changeAngle = targetAngle - currentAngle;
        let changeAngle2 = targetAngle - Math.PI * 2 - currentAngle;

        if (Math.abs(changeAngle2) < Math.abs(changeAngle))
            changeAngle = changeAngle2;

        let canChangeByTemplate = this.owner.template.maxAngleSpeed * dt;

        if (Math.abs(canChangeByTemplate) < Math.abs(changeAngle))
        {
            let sign = Math.sign(changeAngle);
            this.owner.angle += sign * canChangeByTemplate;
        }
        else
            this.owner.angle = targetAngle;

        this.owner.angle %= Math.PI * 2;
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

    constructor()
    {
        this.isStation = false;
        this.attackDist = 150;
        this.maxMoveSpeed = 0.01;
        this.maxAngleSpeed = 0.0003;
    }
}