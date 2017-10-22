var ShipType;
(function (ShipType) {
    ShipType[ShipType["None"] = 0] = "None";
    ShipType[ShipType["Ship1"] = 1] = "Ship1";
    ShipType[ShipType["StationSmall"] = 2] = "StationSmall";
    ShipType[ShipType["StationBig"] = 3] = "StationBig";
})(ShipType || (ShipType = {}));
var Team;
(function (Team) {
    Team[Team["None"] = 0] = "None";
    Team[Team["Left"] = 1] = "Left";
    Team[Team["Right"] = 2] = "Right";
})(Team || (Team = {}));
var ShipsManager = (function () {
    function ShipsManager() {
    }
    ShipsManager.prototype.Init = function () {
        this.templates = new Map();
        var ship1 = new ShipTemplate();
        ship1.shipType = ShipType.Ship1;
        ship1.imageType = ImageType.Ship1;
        this.templates.set(ShipType.Ship1, ship1);
        var stationSmall = new ShipTemplate();
        stationSmall.shipType = ShipType.StationSmall;
        stationSmall.imageType = ImageType.StationSmall;
        stationSmall.isStation = true;
        this.templates.set(ShipType.StationSmall, stationSmall);
        var stationBig = new ShipTemplate();
        stationBig.shipType = ShipType.StationBig;
        stationBig.imageType = ImageType.StationBig;
        stationBig.isStation = true;
        this.templates.set(ShipType.StationBig, stationBig);
        this.ships = [];
        return this;
    };
    ShipsManager.prototype.SpawnShip = function (shipType, team, position, angle) {
        var s = new Ship();
        s.template = this.templates.get(shipType);
        s.team = team;
        s.position = position;
        s.angle = angle;
        s.Init();
        this.ships.push(s);
        gameTS.renderObjects.push(s);
    };
    return ShipsManager;
}());
var Ship = (function () {
    function Ship() {
    }
    Ship.prototype.Init = function () {
        if (this.template.isStation)
            this.mind = new StationMind();
        else
            this.mind = new ShipMind();
        this.mind.Init(this);
    };
    Ship.prototype.Update = function (dt) {
        this.mind.Update(dt);
    };
    Ship.prototype.GetLayer = function () {
        if (this.template.isStation)
            return RenderLayer.Stations;
        return RenderLayer.MediumShips;
    };
    Ship.prototype.Draw = function (ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        var imgType = this.template.imageType;
        var img = gameTS.imageLoader.Get(imgType);
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
    };
    return Ship;
}());
var StationMind = (function () {
    function StationMind() {
    }
    StationMind.prototype.Init = function (owner) {
    };
    StationMind.prototype.Update = function (dt) {
    };
    return StationMind;
}());
var ShipMind = (function () {
    function ShipMind() {
    }
    ShipMind.prototype.Init = function (owner) {
        this.owner = owner;
        this.SearchTarget();
    };
    ShipMind.prototype.SearchTarget = function () {
        var minDist = Number.POSITIVE_INFINITY;
        var bestTarget = null;
        for (var i in gameTS.shipsManager.ships) {
            var ship = gameTS.shipsManager.ships[i];
            if (ship.team === this.owner.team || ship.team === Team.None)
                continue;
            var dist = this.owner.position.DistTo(ship.position);
            if (dist < minDist) {
                minDist = dist;
                bestTarget = ship;
            }
        }
        return bestTarget;
    };
    ShipMind.prototype.Update = function (dt) {
        if (this.target == null)
            this.target = this.SearchTarget();
        if (this.target == null)
            return;
        this.RotateTo(this.target, dt);
        this.FlyTo(this.target, dt);
    };
    ShipMind.prototype.FlyTo = function (target, dt) {
        //if (this.owner.position.DistTo(target.position) <= this.owner.template.attackDist)
        //    return;
        var dx = Math.cos(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;
        var dy = Math.sin(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;
        this.owner.position.x += dx;
        this.owner.position.y += dy;
    };
    ShipMind.prototype.RotateTo = function (target, dt) {
        var currentPos = this.owner.position;
        var targetPos = target.position;
        var currentAngle = this.owner.angle;
        var targetAngle = 0;
        if (currentPos.x > targetPos.x) {
            var dx = targetPos.x - currentPos.x;
            var dy = targetPos.y - currentPos.y;
            targetAngle = Math.atan(dy / dx) + gameTS.renderUtils.DegToRad(180);
        }
        else {
            var dx = currentPos.x - targetPos.x;
            var dy = currentPos.y - targetPos.y;
            targetAngle = Math.atan(dy / dx);
        }
        var changeAngle = targetAngle - currentAngle;
        var changeAngle2 = targetAngle - Math.PI * 2 - currentAngle;
        if (Math.abs(changeAngle2) < Math.abs(changeAngle))
            changeAngle = changeAngle2;
        var canChangeByTemplate = this.owner.template.maxAngleSpeed * dt;
        if (Math.abs(canChangeByTemplate) < Math.abs(changeAngle)) {
            var sign = Math.sign(changeAngle);
            this.owner.angle += sign * canChangeByTemplate;
        }
        else
            this.owner.angle = targetAngle;
        this.owner.angle %= Math.PI * 2;
    };
    return ShipMind;
}());
var ShipTemplate = (function () {
    function ShipTemplate() {
        this.isStation = false;
        this.attackDist = 150;
        this.maxMoveSpeed = 0.01;
        this.maxAngleSpeed = 0.0003;
    }
    return ShipTemplate;
}());
//# sourceMappingURL=ShipsManager.js.map