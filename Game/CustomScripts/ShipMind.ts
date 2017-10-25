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
        if (this.target == null || this.target.isDead)
        {
            this.target = this.targeter.SearchTarget();
        }
        else if (this.target.position.DistTo(this.owner.position) > this.owner.template.attackDist)
        {
            this.targetUpdateCooldown -= dt;

            if (this.targetUpdateCooldown < 0)
            {
                this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
                this.target = this.targeter.SearchTarget();
            }
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
        gameTS.shipsManager.SpawnBullet(this.owner.team, this.owner.position, this.owner.angle, this.owner.template.bulletsDamage, this.owner.template.bulletSize);
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

            targetAngle = Math.atan(dy / dx) + Math.PI;
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

        if (Math.abs(changeAngle) > Math.PI)
            changeAngle = Math.PI * 2 - changeAngle;

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