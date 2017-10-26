class ShipMind implements IShipMind
{
    owner: Ship;
    target: Ship;
    targetUpdateCooldown: number;
    fireCooldown: number;
    targeter: Targeter;
    arriveToPosition: Vector2;
    arriveFromPosition: Vector2;
    arriveMode: boolean;
    arriveMaxLineHide: number;
    arriveCurrentLineHide: number;

    Init(owner: Ship)
    {
        this.owner = owner;
        this.arriveMaxLineHide = 300;
        this.arriveCurrentLineHide = this.arriveMaxLineHide;
        this.arriveToPosition = owner.position.Clone();
        owner.position.x -= Math.cos(owner.angle) * 1000;
        this.arriveFromPosition = owner.position.Clone();
        this.arriveMode = true;
        this.targeter = new Targeter();
        this.targeter.Init(this.owner);
        this.targeter.SearchTarget();
        this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        this.fireCooldown = owner.template.fireCooldown;
    }

    Update(dt: number)
    {
        if (this.arriveMode)
        {
            let dx = this.owner.position.x - this.arriveToPosition.x;
            let dxByAnimation = dt * 1 * Math.cos(this.owner.angle);

            if (Math.abs(dx) < Math.abs(dxByAnimation))
            {
                this.owner.position.x = this.arriveToPosition.x;
                this.arriveMode = false;
            }
            else
                this.owner.position.x += dxByAnimation;

            return;
        }

        if (this.arriveCurrentLineHide > 0)
        {
            this.arriveCurrentLineHide -= dt;
            return;
        }

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

        let targetAngle = 0;

        let dx = targetPos.x - currentPos.x;
        let dy = targetPos.y - currentPos.y;
        let dxAbs = Math.abs(dx);
        let dyAbs = Math.abs(dy);

        let a = 0;
        let offset = 0;
        let targetIsCurrent = false;

        if (dx > 0)
        {
            if (dy > 0)
            {
                offset = 0;
                a = dyAbs / dxAbs;
            }
            else
            {
                if (dy == 0)
                {
                    a = 0;
                    offset = 0;
                }
                else
                {
                    a = dxAbs / dyAbs;
                    offset = 1.5 * Math.PI;
                }
            }
        }
        else
        {
            if (dy > 0)
            {
                a = dxAbs / dyAbs;
                offset = 0.5 * Math.PI;
            }
            else
            {
               if (dx == 0)
               {
                   a = 0;
                   offset = 1.5 * Math.PI;
               }
               else
               {
                   a = dyAbs / dxAbs;
                   offset = Math.PI;
               }
            }
        }

        let currentAngle = this.owner.angle % (Math.PI * 2);
        while (currentAngle < 0)
            currentAngle += Math.PI * 2;

        if (targetIsCurrent)
            targetAngle = currentAngle;
        else
        {
            targetAngle = offset + Math.atan(a);
        }

        let changeAngle = targetAngle - currentAngle;

        if (changeAngle > Math.PI)
            changeAngle -= Math.PI * 2;
        else if(changeAngle < -Math.PI)
            changeAngle += Math.PI * 2;

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