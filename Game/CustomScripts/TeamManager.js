/// <reference path="..\..\Scripts\typings\jquery-3.2.1.d.ts"/>
var Team;
(function (Team) {
    Team[Team["None"] = 0] = "None";
    Team[Team["Left"] = 1] = "Left";
    Team[Team["Right"] = 2] = "Right";
})(Team || (Team = {}));
var TeamManager = (function () {
    function TeamManager() {
        this.teams = new Map();
        var left = new TeamData();
        left.team = Team.Left;
        this.teams.set(Team.Left, left);
        var right = new TeamData();
        right.team = Team.Right;
        right.ai = new TeamAI(right);
        this.teams.set(Team.Right, right);
    }
    return TeamManager;
}());
var TeamAI = (function () {
    function TeamAI(owner) {
        this.owner = owner;
        this.wantShips = null;
        this.spawnZoneRect = gameTS.hireController.hireZoneRectR;
        this.spawnDir = gameTS.renderUtils.DegToRad(180);
        this.protectCooldownMax = 1000;
        this.protectCooldownCurrent = this.protectCooldownMax;
        this.GenerateWantShips();
    }
    TeamAI.prototype.GenerateWantShips = function () {
        this.wantShips = new Map();
        var chances = new Map();
        chances.set("Ship5", 30);
        chances.set("Ship1", 30);
        chances.set("Ship4", 5);
        chances.set("Ship1, Ship4", 5);
        chances.set("Ship5, Ship1", 30);
        var totalChances = 0;
        chances.forEach(function (data, key) {
            totalChances += data;
        });
        var n = gameTS.renderUtils.Random(0, totalChances);
        var sum = 0;
        var wantShip = "";
        chances.forEach(function (data, key) {
            if (wantShip != "")
                return;
            sum += data;
            if (sum >= n) {
                wantShip = key;
            }
        });
        if (wantShip == "Ship1")
            this.wantShips.set(ShipType.Ship1, gameTS.renderUtils.Random(1, 4));
        else if (wantShip == "Ship4")
            this.wantShips.set(ShipType.Ship4, gameTS.renderUtils.Random(1, 3));
        else if (wantShip == "Ship5")
            this.wantShips.set(ShipType.Ship5, gameTS.renderUtils.Random(1, 3));
        else if (wantShip == "Ship1, Ship4") {
            this.wantShips.set(ShipType.Ship1, 2);
            this.wantShips.set(ShipType.Ship4, 1);
        }
        else if (wantShip == "Ship5, Ship1") {
            this.wantShips.set(ShipType.Ship1, 1);
            this.wantShips.set(ShipType.Ship5, 1);
        }
        else
            throw new Error(wantShip);
    };
    TeamAI.prototype.ProtectBases = function () {
        for (var i in gameTS.shipsManager.ships) {
            var ship = gameTS.shipsManager.ships[i];
            if (ship.isDead || ship.team == this.owner.team || ship.team == Team.None)
                continue;
            if (this.spawnZoneRect.IsInside(ship.position)) {
                var wantSpawn = void 0;
                if (ship.template.shipType == ShipType.Ship5) {
                    wantSpawn = ShipType.Ship4;
                    if (gameTS.renderUtils.Random(0, 5) == 0)
                        wantSpawn = ShipType.Ship1;
                    if (gameTS.renderUtils.Random(0, 5) == 0)
                        wantSpawn = ShipType.Ship5;
                }
                else {
                    wantSpawn = ShipType.Ship1;
                    if (gameTS.renderUtils.Random(0, 5) == 0)
                        wantSpawn = ShipType.Ship5;
                }
                if (this.owner.energy >= gameTS.shipsManager.templates.get(wantSpawn).energyCost) {
                    var pos = void 0;
                    pos = ship.position.Clone();
                    pos.x += gameTS.renderUtils.Random(-80, 50);
                    if (gameTS.renderUtils.Random(0, 2) == 0)
                        pos.y += gameTS.renderUtils.Random(-100, -50);
                    else
                        pos.y += gameTS.renderUtils.Random(50, 100);
                    pos = this.spawnZoneRect.MakeInside(pos);
                    gameTS.shipsManager.SpawnShip(wantSpawn, this.owner.team, pos, this.spawnDir);
                }
                this.protectCooldownCurrent = this.protectCooldownMax;
            }
        }
    };
    TeamAI.prototype.Update = function (dt) {
        var _this = this;
        if (gameTS.teamManager.teams.get(Team.Left).stations == 0)
            return;
        if (this.protectCooldownCurrent > 0)
            this.protectCooldownCurrent -= dt;
        if (this.protectCooldownCurrent <= 0) {
            this.ProtectBases();
        }
        var needEnergy = 0;
        this.wantShips.forEach(function (count, shipType) {
            needEnergy += gameTS.shipsManager.templates.get(shipType).energyCost * count;
        });
        if (needEnergy > this.owner.maxEnergy)
            throw new Error("Too expensive set to generate: " + JSON.stringify(this.wantShips));
        if (this.owner.energy >= needEnergy) {
            var posInZone_1 = this.spawnZoneRect.GetRandomPoint();
            this.wantShips.forEach(function (count, shipType) {
                for (var i = 0; i < count; i++) {
                    var pos = null;
                    pos = posInZone_1.Clone();
                    pos.x += gameTS.renderUtils.Random(-30, 30);
                    pos.y += gameTS.renderUtils.Random(-30, 30);
                    pos = _this.spawnZoneRect.MakeInside(pos);
                    gameTS.shipsManager.SpawnShip(shipType, _this.owner.team, pos, _this.spawnDir);
                }
            });
            this.GenerateWantShips();
        }
    };
    return TeamAI;
}());
var TeamData = (function () {
    function TeamData() {
        this.energy = 0;
        this.maxEnergy = 100;
        this.cooldownEnergyMax = 700;
        this.cooldownEnergyCurrent = this.cooldownEnergyMax;
        this.ai = null;
        this.stations = 0;
        gameTS.renderObjects.push(this);
        this.ChangeEnergy(50);
    }
    TeamData.prototype.ChangeEnergy = function (delta) {
        if (delta == 0)
            return;
        this.energy += delta;
        if (this.energy > this.maxEnergy)
            this.energy = this.maxEnergy;
        if (this.team == Team.Left) {
            $("#energyLabel").html(this.energy + " / " + this.maxEnergy);
            var values = Object.keys(ShipType).map(function (k) { return ShipType[k]; }).filter(function (v) { return typeof v === "string"; });
            for (var i in values) {
                var t = ShipType[values[i]];
                if (t == ShipType.None)
                    continue;
                var template = gameTS.shipsManager.templates.get(t);
                if (template.isStation)
                    continue;
                var opacity = this.energy >= template.energyCost ? 1 : 0.5;
                $(GameTS.HireBtnPrefix + values[i]).fadeTo(0, opacity);
                var restoreHeight = 100;
                if (this.energy < template.energyCost)
                    restoreHeight = this.energy / template.energyCost * 100;
                $("#hireBtnRestore_" + values[i])[0].style.height = 100 - restoreHeight + "%";
            }
        }
    };
    TeamData.prototype.Update = function (dt) {
        if (this.stations == 0)
            return;
        this.cooldownEnergyCurrent -= dt;
        if (this.cooldownEnergyCurrent <= 0) {
            if (this.energy < this.maxEnergy)
                this.ChangeEnergy(1);
            this.cooldownEnergyCurrent += this.cooldownEnergyMax / this.stations;
        }
        if (this.ai != null)
            this.ai.Update(dt);
    };
    TeamData.prototype.GetLayer = function () {
        return RenderLayer.None;
    };
    TeamData.prototype.Draw = function (ctx) {
    };
    return TeamData;
}());
//# sourceMappingURL=TeamManager.js.map