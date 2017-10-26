var ShipType;
(function (ShipType) {
    ShipType[ShipType["None"] = 0] = "None";
    ShipType[ShipType["Ship1"] = 1] = "Ship1";
    ShipType[ShipType["StationSmall"] = 2] = "StationSmall";
    ShipType[ShipType["StationBig"] = 3] = "StationBig";
    ShipType[ShipType["Ship4"] = 4] = "Ship4";
    ShipType[ShipType["Ship5"] = 5] = "Ship5";
})(ShipType || (ShipType = {}));
var ShipsManager = (function () {
    function ShipsManager() {
    }
    ShipsManager.prototype.Init = function () {
        this.templates = new Map();
        // Medium
        var ship1 = new ShipTemplate();
        ship1.shipType = ShipType.Ship1;
        ship1.imageType = ImageType.Ship1;
        ship1.energyCost = 30;
        ship1.dieExplosionScale = 0.5;
        this.templates.set(ShipType.Ship1, ship1);
        // Small
        var ship4 = new ShipTemplate();
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
        var ship5 = new ShipTemplate();
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
        var stationSmall = new ShipTemplate();
        stationSmall.shipType = ShipType.StationSmall;
        stationSmall.imageType = ImageType.StationSmall;
        stationSmall.isStation = true;
        stationSmall.attackDist = 320;
        stationSmall.maxHP = 200;
        stationSmall.dieExplosionScale = 1;
        this.templates.set(ShipType.StationSmall, stationSmall);
        var stationBig = new ShipTemplate();
        stationBig.shipType = ShipType.StationBig;
        stationBig.imageType = ImageType.StationBig;
        stationBig.isStation = true;
        stationBig.attackDist = 320;
        stationBig.maxHP = 250;
        stationBig.dieExplosionScale = 1;
        this.templates.set(ShipType.StationBig, stationBig);
        this.ships = [];
        return this;
    };
    ShipsManager.prototype.SpawnBullet = function (team, position, angle, damage, bulletSize) {
        var bulletSpeed = 0.3;
        angle += (Math.random() - 0.5) * 0.3;
        var dx = Math.cos(angle) * bulletSpeed;
        var dy = Math.sin(angle) * bulletSpeed;
        var moveDelta = new Vector2().Init(dx, dy);
        var b = new Bullet();
        b.Init(team, position.Clone(), moveDelta, damage, bulletSize);
        gameTS.renderObjects.push(b);
    };
    ShipsManager.prototype.SpawnShip = function (shipType, team, position, angle) {
        var teamData = gameTS.teamManager.teams.get(team);
        var template = this.templates.get(shipType);
        if (!template.isStation && teamData.stations == 0)
            return;
        if (teamData.energy < template.energyCost)
            return;
        teamData.ChangeEnergy(-template.energyCost);
        if (template.isStation)
            teamData.stations++;
        var s = new Ship();
        s.template = template;
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
                if (o.template.isStation) {
                    var team = gameTS.teamManager.teams.get(o.team);
                    team.stations--;
                }
                this.ships.splice(i, 1);
                var a = new Animation(AnimationType.explosion, RenderLayer.Explosions, o.position.Clone());
                a.scale = o.template.dieExplosionScale;
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
            target.isDead = true;
            gameTS.RemoveObject(target);
            this.RemoveObject(target);
        }
        else {
            var hpText = new HpText();
            hpText.Init(damage.toString(), 700, target.position.Clone());
            gameTS.renderObjects.push(hpText);
        }
    };
    return ShipsManager;
}());
var HpText = (function () {
    function HpText() {
    }
    HpText.prototype.Init = function (txt, lifeTime, pos) {
        pos.x += gameTS.renderUtils.Random(-10, 11);
        this.txt = txt;
        this.lifeTime = lifeTime;
        this.pos = pos;
    };
    HpText.prototype.Update = function (dt) {
        this.pos.y -= dt * 0.05;
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
        ctx.font = "15px Verdana";
        ctx.fillText(this.txt, this.pos.x, this.pos.y);
    };
    return HpText;
}());
var Ship = (function () {
    function Ship() {
    }
    Ship.prototype.Init = function () {
        this.isDead = false;
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
        if (!this.template.isStation) {
            var m = this.mind;
            if (m.arriveCurrentLineHide > 0) {
                var alpha = m.arriveCurrentLineHide / m.arriveMaxLineHide;
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
        var imgType = this.template.imageType;
        var img = gameTS.imageLoader.Get(imgType);
        ctx.drawImage(img.raw, -img.raw.width / 2, -img.raw.height / 2);
        ctx.restore();
        //ctx.beginPath();
        //ctx.fillStyle = "#D82D33";
        //ctx.font="15px Verdana";
        //ctx.fillText((this.angle / Math.PI).toFixed(2).toString(), this.position.x, this.position.y + 20);
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
            if (ship.team === this.owner.team || ship.team === Team.None || ship.isDead)
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
    return ShipTemplate;
}());
//# sourceMappingURL=ShipsManager.js.map