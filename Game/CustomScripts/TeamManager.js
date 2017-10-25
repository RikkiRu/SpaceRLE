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
        this.GenerateWantShips();
    }
    TeamAI.prototype.GenerateWantShips = function () {
        this.wantShips = new Map();
        var n = gameTS.renderUtils.Random(0, 3);
        if (n == 0)
            this.wantShips.set(ShipType.Ship1, gameTS.renderUtils.Random(1, 3));
        else if (n == 1)
            this.wantShips.set(ShipType.Ship4, gameTS.renderUtils.Random(1, 4));
        else if (n == 2)
            this.wantShips.set(ShipType.Ship5, 1);
    };
    TeamAI.prototype.Update = function (dt) {
        var _this = this;
        if (gameTS.teamManager.teams.get(Team.Left).stations == 0)
            return;
        var needEnergy = 0;
        this.wantShips.forEach(function (count, shipType) {
            needEnergy += gameTS.shipsManager.templates.get(shipType).energyCost * count;
        });
        if (this.owner.energy >= needEnergy) {
            this.wantShips.forEach(function (count, shipType) {
                var posInZone = gameTS.hireController.hireZoneRectR.GetRandomPoint();
                for (var i = 0; i < count; i++) {
                    var pos = null;
                    do {
                        pos = posInZone.Clone();
                        pos.x += gameTS.renderUtils.Random(-30, 30);
                        pos.y += gameTS.renderUtils.Random(-30, 30);
                    } while (!gameTS.hireController.hireZoneRectR.IsInside(pos));
                    gameTS.shipsManager.SpawnShip(shipType, _this.owner.team, pos, gameTS.renderUtils.DegToRad(180));
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