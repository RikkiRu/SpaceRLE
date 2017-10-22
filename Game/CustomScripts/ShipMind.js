var ShipMind = (function () {
    function ShipMind() {
    }
    ShipMind.prototype.Init = function (owner) {
        this.owner = owner;
        this.targeter = new Targeter();
        this.targeter.Init(this.owner);
        this.targeter.SearchTarget();
        this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        this.fireCooldown = owner.template.fireCooldown;
    };
    ShipMind.prototype.Update = function (dt) {
        this.targetUpdateCooldown -= dt;
        if (this.target == null || this.targetUpdateCooldown < 0) {
            this.target = this.targeter.SearchTarget();
            this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        }
        if (this.target == null)
            return;
        this.RotateTo(this.target, dt);
        this.FlyTo(this.target, dt);
        this.Attack(this.target, dt);
    };
    ShipMind.prototype.Attack = function (target, dt) {
        if (this.fireCooldown > 0) {
            this.fireCooldown -= dt;
            return;
        }
        if (target == null)
            return;
        if (this.owner.position.DistTo(target.position) > this.owner.template.attackDist)
            return;
        this.fireCooldown += this.owner.template.fireCooldown;
        gameTS.shipsManager.SpawnBullet(this.owner.team, this.owner.position, this.owner.angle);
    };
    ShipMind.prototype.FlyTo = function (target, dt) {
        if (target == null)
            return;
        if (this.owner.position.DistTo(target.position) <= this.owner.template.attackDist)
            return;
        var dx = Math.cos(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;
        var dy = Math.sin(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;
        var resX = this.owner.position.x + dx;
        var resY = this.owner.position.y + dy;
        var battleRect = gameTS.hireController.battleRect;
        if (!battleRect.IsInside(new Vector2().Init(resX, resY)))
            return;
        this.owner.position.x = resX;
        this.owner.position.y = resY;
    };
    ShipMind.prototype.RotateTo = function (target, dt) {
        if (target == null)
            return;
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
//# sourceMappingURL=ShipMind.js.map