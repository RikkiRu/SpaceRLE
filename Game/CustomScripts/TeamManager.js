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
        this.wantShips.set(ShipType.Ship1, gameTS.renderUtils.Random(1, 4));
    };
    TeamAI.prototype.Update = function (dt) {
        var _this = this;
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
        this.energy = 50;
        this.maxEnergy = 100;
        this.cooldownEnergyMax = 700;
        this.cooldownEnergyCurrent = this.cooldownEnergyMax;
        this.ai = null;
        this.stations = 0;
        gameTS.renderObjects.push(this);
        if (this.team == Team.Left) {
            $("#energyLabel").html(this.energy + " / " + this.maxEnergy);
        }
    }
    TeamData.prototype.ChangeEnergy = function (delta) {
        if (delta == 0)
            return;
        this.energy += delta;
        if (this.energy > this.maxEnergy)
            this.energy = this.maxEnergy;
        if (this.team == Team.Left) {
            $("#energyLabel").html(this.energy + " / " + this.maxEnergy);
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