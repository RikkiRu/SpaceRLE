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
    ShipsManager.prototype.SpawnBullet = function (team, position, angle) {
        var bulletSpeed = 0.3;
        var dx = Math.cos(angle) * bulletSpeed;
        var dy = Math.sin(angle) * bulletSpeed;
        var moveDelta = new Vector2().Init(dx, dy);
        var b = new Bullet();
        b.Init(team, position.Clone(), moveDelta);
        gameTS.renderObjects.push(b);
    };
    ShipsManager.prototype.SpawnShip = function (shipType, team, position, angle) {
        var s = new Ship();
        s.template = this.templates.get(shipType);
        s.team = team;
        s.position = position;
        s.angle = angle;
        s.hp = s.template.maxHP;
        s.Init();
        this.ships.push(s);
        gameTS.renderObjects.push(s);
    };
    ShipsManager.prototype.RemoveObject = function (obj) {
        for (var i = 0; i < this.ships.length; i++) {
            var o = this.ships[i];
            if (o === obj) {
                this.ships.splice(i, 1);
                return;
            }
        }
    };
    ShipsManager.prototype.DoDamage = function (target, damage) {
        if (target.hp < damage)
            target.hp = 0;
        else
            target.hp -= damage;
        if (target.hp <= 0) {
            gameTS.RemoveObject(target);
            this.RemoveObject(target);
        }
        else {
            var hpText = new HpText();
            hpText.Init(target.hp.toString(), 500, target.position.Clone());
            gameTS.renderObjects.push(hpText);
        }
    };
    return ShipsManager;
}());
var HpText = (function () {
    function HpText() {
    }
    HpText.prototype.Init = function (txt, lifeTime, pos) {
        this.txt = txt;
        this.lifeTime = lifeTime;
        this.pos = pos;
    };
    HpText.prototype.Update = function (dt) {
        this.pos.y -= dt * 0.02;
        this.lifeTime -= dt;
        if (this.lifeTime < 0)
            gameTS.RemoveObject(this);
    };
    HpText.prototype.GetLayer = function () {
        return RenderLayer.GUI;
    };
    HpText.prototype.Draw = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = "#D82D33";
        ctx.fillText(this.txt, this.pos.x, this.pos.y);
    };
    return HpText;
}());
var Bullet = (function () {
    function Bullet() {
    }
    Bullet.prototype.Init = function (team, position, moveDelta) {
        this.team = team;
        this.position = position;
        this.moveDelta = moveDelta;
        this.damage = 10;
        this.lifeTime = 700;
    };
    Bullet.prototype.Update = function (dt) {
        this.lifeTime -= dt;
        if (this.lifeTime < 0) {
            gameTS.RemoveObject(this);
            return;
        }
        this.position.x += this.moveDelta.x * dt;
        this.position.y += this.moveDelta.y * dt;
        if (!gameTS.hireController.battleRect.IsInside(this.position)) {
            gameTS.RemoveObject(this);
            return;
        }
        for (var i in gameTS.shipsManager.ships) {
            var ship = gameTS.shipsManager.ships[i];
            if (ship.team === this.team || ship.team === Team.None)
                continue;
            if (this.position.DistTo(ship.position) < 20) {
                gameTS.RemoveObject(this);
                gameTS.shipsManager.DoDamage(ship, this.damage);
            }
        }
    };
    Bullet.prototype.GetLayer = function () {
        return RenderLayer.Bullets;
    };
    Bullet.prototype.Draw = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = "#D0DB36";
        ctx.ellipse(this.position.x, this.position.y, 2, 2, 0, 0, Math.PI * 2, false);
        ctx.fill();
    };
    return Bullet;
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
    };
    return Ship;
}());
var Targeter = (function () {
    function Targeter() {
    }
    Targeter.prototype.Init = function (owner) {
        this.owner = owner;
    };
    Targeter.prototype.SearchTarget = function () {
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
    return Targeter;
}());
var ShipTemplate = (function () {
    function ShipTemplate() {
        this.isStation = false;
        this.attackDist = 150;
        this.maxMoveSpeed = 0.03;
        this.maxAngleSpeed = 0.0003;
        this.targetsUpdateRate = 1000;
        this.fireCooldown = 400;
        this.maxHP = 100;
    }
    return ShipTemplate;
}());
//# sourceMappingURL=ShipsManager.js.map