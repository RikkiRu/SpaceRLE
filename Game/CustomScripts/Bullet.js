var Bullet = (function () {
    function Bullet() {
    }
    Bullet.prototype.Init = function (team, position, moveDelta, damage, bulletSize) {
        this.team = team;
        this.position = position;
        this.moveDelta = moveDelta;
        this.damage = damage;
        this.bulletSize = bulletSize;
        this.lifeTime = 1000;
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
        ctx.ellipse(this.position.x, this.position.y, this.bulletSize, this.bulletSize, 0, 0, Math.PI * 2, false);
        ctx.fill();
    };
    return Bullet;
}());
//# sourceMappingURL=Bullet.js.map