var StationMind = (function () {
    function StationMind() {
    }
    StationMind.prototype.Init = function (owner) {
        this.owner = owner;
        this.targeter = new Targeter();
        this.targeter.Init(this.owner);
        this.targeter.SearchTarget();
        this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        this.fireCooldown = owner.template.fireCooldown;
    };
    StationMind.prototype.Update = function (dt) {
        this.targetUpdateCooldown -= dt;
        if (this.target == null || this.target.isDead || this.targetUpdateCooldown < 0) {
            this.target = this.targeter.SearchTarget();
            this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        }
        if (this.target == null)
            return;
        this.Attack(this.target, dt);
    };
    StationMind.prototype.Attack = function (target, dt) {
        if (this.fireCooldown > 0) {
            this.fireCooldown -= dt;
            return;
        }
        if (target == null)
            return;
        if (this.owner.position.DistTo(target.position) > this.owner.template.attackDist)
            return;
        // Copy from ship move
        var currentPos = this.owner.position;
        var targetPos = target.position;
        var targetAngle = 0;
        if (currentPos.x > targetPos.x) {
            var dx = targetPos.x - currentPos.x;
            var dy = targetPos.y - currentPos.y;
            targetAngle = Math.atan(dy / dx) + RenderUtils.instance.DegToRad(180);
        }
        else {
            var dx = currentPos.x - targetPos.x;
            var dy = currentPos.y - targetPos.y;
            targetAngle = Math.atan(dy / dx);
        }
        this.fireCooldown += this.owner.template.fireCooldown;
        gameTS.shipsManager.SpawnBullet(this.owner.team, this.owner.position, targetAngle, this.owner.template.bulletsDamage, this.owner.template.bulletSize);
    };
    return StationMind;
}());
//# sourceMappingURL=StationMind.js.map