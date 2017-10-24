class ShipMind implements IShipMind
{
    owner: Ship;
    target: Ship;
    targetUpdateCooldown: number;
    fireCooldown: number;
    targeter: Targeter;

    Init(owner: Ship)
    {
        this.owner = owner;
        this.targeter = new Targeter();
        this.targeter.Init(this.owner);
        this.targeter.SearchTarget();
        this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        this.fireCooldown = owner.template.fireCooldown;
    }

    Update(dt: number)
    {
        this.targetUpdateCooldown -= dt;

        if (this.target == null || this.targetUpdateCooldown < 0)
        {
            this.target = this.targeter.SearchTarget();
            this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        }

        if (this.target == null)
            return;

        this.RotateTo(this.target, dt);
        this.FlyTo(this.target, dt);
        this.Attack(this.target, dt);
    }

    Attack(target: Ship, dt: number)
    {
        if (this.fireCooldown > 0)
        {
            this.fireCooldown -= dt;
            return;
        }

        if (target == null)
            return;

        if (this.owner.position.DistTo(target.position) > this.owner.template.attackDist)
            return;

        this.fireCooldown += this.owner.template.fireCooldown;
        gameTS.shipsManager.SpawnBullet(this.owner.team, this.owner.position, this.owner.angle);
    }

    FlyTo(target: Ship, dt: number)
    {
        if (target == null)
            return;

        if (this.owner.position.DistTo(target.position) <= this.owner.template.attackDist)
            return;

        let dx = Math.cos(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;
        let dy = Math.sin(this.owner.angle) * dt * this.owner.template.maxMoveSpeed;

        let resX = this.owner.position.x + dx;
        let resY = this.owner.position.y + dy;

        let battleRect = gameTS.hireController.battleRect;

        if (!battleRect.IsInside(new Vector2().Init(resX, resY)))
            return;

        this.owner.position.x = resX;
        this.owner.position.y = resY;
    }

    RotateTo(target: Ship, dt: number)
    {
        if (target == null)
            return;

        let currentPos = this.owner.position;
        let targetPos = target.position;
        let currentAngle = this.owner.angle;

        let targetAngle = 0;

        if (currentPos.x > targetPos.x)
        {
            let dx = targetPos.x - currentPos.x;
            let dy = targetPos.y - currentPos.y;

            if (dx === 0)
                dx = 0.01;

            targetAngle = Math.atan(dy / dx) + gameTS.renderUtils.DegToRad(180);
        }
        else
        {
            let dx = currentPos.x - targetPos.x;
            let dy = currentPos.y - targetPos.y;

            if (dx === 0)
                dx = 0.01;

            targetAngle = Math.atan(dy / dx);
        }

        let changeAngle = targetAngle - currentAngle;
        let changeAngle2 = targetAngle - Math.PI * 2 - currentAngle;

        if (Math.abs(changeAngle2) < Math.abs(changeAngle))
            changeAngle = changeAngle2;

        let canChangeByTemplate = this.owner.template.maxAngleSpeed * dt;

        if (Math.abs(canChangeByTemplate) < Math.abs(changeAngle))
        {
            let sign = Math.sign(changeAngle);
            this.owner.angle += sign * canChangeByTemplate;
        }
        else
            this.owner.angle = targetAngle;

        this.owner.angle %= Math.PI * 2;
    }
}