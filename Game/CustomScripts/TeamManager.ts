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
    spawnZoneRect: Rect;
    spawnDir: number;
    protectCooldownCurrent: number;
    protectCooldownMax: number;

    constructor(owner: TeamData)
    {
        this.owner = owner;
        this.wantShips = null;
        this.spawnZoneRect = gameTS.hireController.hireZoneRectR;
        this.spawnDir = RenderUtils.instance.DegToRad(180);
        this.protectCooldownMax = 1000;
        this.protectCooldownCurrent = this.protectCooldownMax;
        this.GenerateWantShips();
    }

    GenerateWantShips()
    {
        this.wantShips = new Map();

        let chances: Map<string, number> = new Map();
        chances.set("Ship5", 30);
        chances.set("Ship1", 30);
        chances.set("Ship4", 5);
        chances.set("Ship1, Ship4", 5);
        chances.set("Ship5, Ship1", 30);

        let totalChances = 0;

        chances.forEach((data: number, key: string) =>
        {
            totalChances += data;
        });

        let n = RenderUtils.instance.Random(0, totalChances);

        let sum = 0;
        let wantShip = "";

        chances.forEach((data: number, key: string) =>
        {
            if (wantShip != "")
                return;

            sum += data;

            if (sum >= n)
            {
                wantShip = key;
            }
        });

        if (wantShip == "Ship1")
            this.wantShips.set(ShipType.Ship1, RenderUtils.instance.Random(1, 4));
        else if(wantShip == "Ship4")
            this.wantShips.set(ShipType.Ship4, RenderUtils.instance.Random(1, 3));
        else if(wantShip == "Ship5")
            this.wantShips.set(ShipType.Ship5, RenderUtils.instance.Random(1, 3));
        else if(wantShip == "Ship1, Ship4")
        {
            this.wantShips.set(ShipType.Ship1, 2);
            this.wantShips.set(ShipType.Ship4, 1);
        }
        else if(wantShip == "Ship5, Ship1")
        {
            this.wantShips.set(ShipType.Ship1, 1);
            this.wantShips.set(ShipType.Ship5, 1);
        }
        else
            throw new Error(wantShip);
    }

    ProtectBases()
    {
        for (let i in gameTS.shipsManager.ships)
        {
            let ship = gameTS.shipsManager.ships[i];
            if (ship.isDead || ship.team == this.owner.team || ship.team == Team.None)
                continue;

            if (this.spawnZoneRect.IsInside(ship.position))
            {
                let wantSpawn: ShipType;

                if (ship.template.shipType == ShipType.Ship5)
                {
                    wantSpawn = ShipType.Ship4;

                    if (RenderUtils.instance.Random(0, 5) == 0)
                        wantSpawn = ShipType.Ship1;
                    if (RenderUtils.instance.Random(0, 5) == 0)
                        wantSpawn = ShipType.Ship5;
                }
                else
                {
                    wantSpawn = ShipType.Ship1;

                    if (RenderUtils.instance.Random(0, 5) == 0)
                        wantSpawn = ShipType.Ship5;
                }

                if (this.owner.energy >= gameTS.shipsManager.templates.get(wantSpawn).energyCost)
                {
                    let pos: Vector2;

                    pos = ship.position.Clone();
                    pos.x += RenderUtils.instance.Random(-80, 50);

                    if (RenderUtils.instance.Random(0, 2) == 0)
                        pos.y += RenderUtils.instance.Random(-100, -50);
                    else
                        pos.y += RenderUtils.instance.Random(50, 100);

                    pos = this.spawnZoneRect.MakeInside(pos);

                    gameTS.shipsManager.SpawnShip(wantSpawn, this.owner.team, pos, this.spawnDir);
                }

                this.protectCooldownCurrent = this.protectCooldownMax;
            }
        }
    }

    Update(dt: number)
    {
        if (gameTS.teamManager.teams.get(Team.Left).stations == 0)
            return;

        if (this.protectCooldownCurrent > 0)
            this.protectCooldownCurrent -= dt;

        if (this.protectCooldownCurrent <= 0)
        {
            this.ProtectBases();
        }

        let needEnergy = 0;

        this.wantShips.forEach((count: number, shipType: ShipType) =>
        {
             needEnergy += gameTS.shipsManager.templates.get(shipType).energyCost * count;
        });

        if (needEnergy > this.owner.maxEnergy)
            throw new Error("Too expensive set to generate: " + JSON.stringify(this.wantShips));

        if (this.owner.energy >= needEnergy)
        {
            let posInZone = this.spawnZoneRect.GetRandomPoint();

            this.wantShips.forEach((count: number, shipType: ShipType) =>
            {
                for (let i = 0; i < count; i++)
                {
                    let pos: Vector2 = null;
                    pos = posInZone.Clone();
                    pos.x += RenderUtils.instance.Random(-30, 30);
                    pos.y += RenderUtils.instance.Random(-30, 30);
                    pos = this.spawnZoneRect.MakeInside(pos);

                    gameTS.shipsManager.SpawnShip(shipType, this.owner.team, pos, this.spawnDir);
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