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
        if (this.target == null || this.target.isDead) {
            this.target = this.targeter.SearchTarget();
        }
        else if (this.target.position.DistTo(this.owner.position) > this.owner.template.attackDist) {
            this.targetUpdateCooldown -= dt;
            if (this.targetUpdateCooldown < 0) {
                this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
                this.target = this.targeter.SearchTarget();
            }
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
        gameTS.shipsManager.SpawnBullet(this.owner.team, this.owner.position, this.owner.angle, this.owner.template.bulletsDamage, this.owner.template.bulletSize);
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
        var targetAngle = 0;
        var dx = targetPos.x - currentPos.x;
        var dy = targetPos.y - currentPos.y;
        var dxAbs = Math.abs(dx);
        var dyAbs = Math.abs(dy);
        var a = 0;
        var offset = 0;
        var targetIsCurrent = false;
        if (dx > 0) {
            if (dy > 0) {
                offset = 0;
                a = dyAbs / dxAbs;
            }
            else {
                if (dy == 0) {
                    a = 0;
                    offset = 0;
                }
                else {
                    a = dxAbs / dyAbs;
                    offset = 1.5 * Math.PI;
                }
            }
        }
        else {
            if (dy > 0) {
                a = dxAbs / dyAbs;
                offset = 0.5 * Math.PI;
            }
            else {
                if (dx == 0) {
                    a = 0;
                    offset = 1.5 * Math.PI;
                }
                else {
                    a = dyAbs / dxAbs;
                    offset = Math.PI;
                }
            }
        }
        var currentAngle = this.owner.angle % (Math.PI * 2);
        while (currentAngle < 0)
            currentAngle += Math.PI * 2;
        if (targetIsCurrent)
            targetAngle = currentAngle;
        else {
            targetAngle = offset + Math.atan(a);
        }
        var changeAngle = targetAngle - currentAngle;
        if (changeAngle > Math.PI)
            changeAngle -= Math.PI * 2;
        else if (changeAngle < -Math.PI)
            changeAngle += Math.PI * 2;
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