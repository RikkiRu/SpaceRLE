class Bullet implements IRenderObject, IUpdatable
{
    team: Team;
    position: Vector2;
    moveDelta: Vector2;
    damage: number;
    lifeTime: number;
    bulletSize: number;

    Init(team: Team, position: Vector2, moveDelta: Vector2, damage: number, bulletSize: number)
    {
        this.team = team;
        this.position = position;
        this.moveDelta = moveDelta;
        this.damage = damage;
        this.bulletSize = bulletSize;
        this.lifeTime = 1000;
    }

    Update(dt: number)
    {
        this.lifeTime -= dt;

        if (this.lifeTime < 0)
        {
            gameTS.RemoveObject(this);
            return;
        }

        this.position.x += this.moveDelta.x * dt;
        this.position.y += this.moveDelta.y * dt;

        if (!gameTS.hireController.battleRect.IsInside(this.position))
        {
            gameTS.RemoveObject(this);
            return;
        }

        for (let i in gameTS.shipsManager.ships)
        {
            let ship = gameTS.shipsManager.ships[i];

            if (ship.team === this.team || ship.team === Team.None)
                continue;

            if (this.position.DistTo(ship.position) < 20)
            {
                gameTS.RemoveObject(this);
                gameTS.shipsManager.DoDamage(ship, this.damage);
            }
        }
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.Bullets;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
       ctx.beginPath();
       ctx.fillStyle = "#D0DB36";
       ctx.ellipse(this.position.x, this.position.y, this.bulletSize, this.bulletSize, 0, 0, Math.PI * 2, false);
       ctx.fill();
    }
}