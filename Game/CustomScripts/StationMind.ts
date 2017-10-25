class StationMind implements IShipMind
{
    // Copy from ship
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

        if (this.target == null || this.target.isDead || this.targetUpdateCooldown < 0)
        {
            this.target = this.targeter.SearchTarget();
            this.targetUpdateCooldown = this.owner.template.targetsUpdateRate;
        }

        if (this.target == null)
            return;

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

        // Copy from ship move
        let currentPos = this.owner.position;
        let targetPos = target.position;
        let targetAngle = 0;

        if (currentPos.x > targetPos.x)
        {
            let dx = targetPos.x - currentPos.x;
            let dy = targetPos.y - currentPos.y;
            targetAngle = Math.atan(dy / dx) + gameTS.renderUtils.DegToRad(180);
        }
        else
        {
            let dx = currentPos.x - targetPos.x;
            let dy = currentPos.y - targetPos.y;
            targetAngle = Math.atan(dy / dx);
        }

        this.fireCooldown += this.owner.template.fireCooldown;
        gameTS.shipsManager.SpawnBullet(this.owner.team, this.owner.position, targetAngle, this.owner.template.bulletsDamage, this.owner.template.bulletSize);
    }
}