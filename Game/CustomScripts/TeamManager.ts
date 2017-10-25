/// <reference path="..\..\Scripts\typings\jquery-3.2.1.d.ts"/>

enum Team
{
    None,
    Left,
    Right,
}

class TeamManager
{
    teams: Map<Team, TeamData>;

    constructor()
    {
        this.teams = new Map();

        let left = new TeamData();
        left.team = Team.Left;
        this.teams.set(Team.Left, left);

        let right = new TeamData();
        right.team = Team.Right;
        right.ai = new TeamAI(right);
        this.teams.set(Team.Right, right);
    }
}

class TeamAI implements IUpdatable
{
    owner: TeamData;
    wantShips: Map<ShipType, number>;

    constructor(owner: TeamData)
    {
        this.owner = owner;
        this.wantShips = null;
        this.GenerateWantShips();
    }

    GenerateWantShips()
    {
        this.wantShips = new Map();

        let n = gameTS.renderUtils.Random(0, 2);

        if (n == 0)
            this.wantShips.set(ShipType.Ship1, gameTS.renderUtils.Random(1, 4));
        else
            this.wantShips.set(ShipType.Ship4, gameTS.renderUtils.Random(2, 5));
    }

    Update(dt: number)
    {
        if (gameTS.teamManager.teams.get(Team.Left).stations == 0)
            return;

        let needEnergy = 0;

        this.wantShips.forEach((count: number, shipType: ShipType) =>
        {
             needEnergy += gameTS.shipsManager.templates.get(shipType).energyCost * count;
        });

        if (this.owner.energy >= needEnergy)
        {
            this.wantShips.forEach((count: number, shipType: ShipType) =>
            {
                let posInZone = gameTS.hireController.hireZoneRectR.GetRandomPoint();

                for (let i=0; i<count; i++)
                {
                    let pos: Vector2 = null;

                    do
                    {
                        pos = posInZone.Clone();
                        pos.x += gameTS.renderUtils.Random(-30, 30);
                        pos.y += gameTS.renderUtils.Random(-30, 30);
                    }
                    while(!gameTS.hireController.hireZoneRectR.IsInside(pos))

                    gameTS.shipsManager.SpawnShip(shipType, this.owner.team, pos, gameTS.renderUtils.DegToRad(180));
                }
            });

            this.GenerateWantShips();
        }
    }
}

class TeamData implements IUpdatable, IRenderObject
{
    team: Team;
    energy: number;
    cooldownEnergyCurrent: number;
    cooldownEnergyMax: number;
    maxEnergy: number;
    ai: TeamAI;
    stations: number;

    constructor()
    {
        this.energy = 0;
        this.maxEnergy = 100;
        this.cooldownEnergyMax = 700;
        this.cooldownEnergyCurrent = this.cooldownEnergyMax;
        this.ai = null;
        this.stations = 0;

        gameTS.renderObjects.push(this);

        this.ChangeEnergy(50);
    }

    ChangeEnergy(delta)
    {
        if (delta == 0)
            return;

        this.energy += delta;
        if (this.energy > this.maxEnergy)
            this.energy = this.maxEnergy;

        if (this.team == Team.Left)
        {
           $("#energyLabel").html(this.energy + " / " + this.maxEnergy);

           const values = Object.keys(ShipType).map(k => ShipType[k]).filter(v => typeof v === "string") as string[];

            for (var i in values)
            {
                let t: ShipType = ShipType[values[i]]

                if (t == ShipType.None)
                    continue;

                let template = gameTS.shipsManager.templates.get(t);

                if (template.isStation)
                    continue;

                let opacity = this.energy >= template.energyCost ? 1 : 0.5;

                $(GameTS.HireBtnPrefix + values[i]).fadeTo(0, opacity);

                let restoreHeight = 100;

                if (this.energy < template.energyCost)
                    restoreHeight = this.energy / template.energyCost * 100;

                $("#hireBtnRestore_" + values[i])[0].style.height = 100 - restoreHeight + "%";
            }
        }
    }

    Update(dt: number)
    {
        if (this.stations == 0)
            return;

        this.cooldownEnergyCurrent -= dt;

        if (this.cooldownEnergyCurrent <= 0)
        {
            if (this.energy < this.maxEnergy)
                this.ChangeEnergy(1);

            this.cooldownEnergyCurrent += this.cooldownEnergyMax / this.stations;
        }

        if (this.ai != null)
            this.ai.Update(dt);
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.None;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
    }
}