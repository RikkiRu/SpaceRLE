class HireController
{
    shipPreview: ShipPreview;
    hireZone: HireZone;
    hireZoneRectL: Rect;
    hireZoneRectR: Rect;
    battleRect: Rect;
    shipType: ShipType;

    constructor()
    {
        let dx = 30;
        let w = 250;
        let h = 600;
        let t = -h/2;

        this.hireZoneRectL = new Rect().Init(-w-dx, t, w, h);
        this.hireZoneRectR = new Rect().Init(dx, t, w, h);
        this.battleRect = new Rect().Init(-450, -300, 900, 600);
    }

    PrepareToHire(shipType: ShipType)
    {
        if (this.shipPreview != null)
            gameTS.RemoveObject(this.shipPreview);

        if (this.hireZone != null)
            gameTS.RemoveObject(this.hireZone);

        let template = gameTS.shipsManager.templates.get(shipType);
        let team = gameTS.teamManager.teams.get(Team.Left);
        if (team.energy < template.energyCost)
            return;

        this.hireZone = new HireZone();
        this.hireZone.Init(this.hireZoneRectL);
        gameTS.renderObjects.push(this.hireZone);

        this.shipType = shipType;
    }

    ProcessMouse(isDown: boolean)
    {
        if (this.hireZone == null)
            return;

        if (isDown)
        {
            if (this.shipPreview == null)
            {
                this.shipPreview = new ShipPreview();
                this.shipPreview.Init(this.shipType);
                gameTS.renderObjects.push(this.shipPreview);
            }

			return false;
        }

        if (this.shipPreview != null)
        {
            if (this.hireZoneRectL.IsInside(gameTS.mouseData.gamePosition))
            {
                gameTS.shipsManager.SpawnShip(
                    this.shipPreview.shipType, Team.Left, gameTS.mouseData.gamePosition, this.shipPreview.shipAngle);
            }

            gameTS.RemoveObject(this.shipPreview);
            this.shipPreview = null;
        }

        gameTS.RemoveObject(this.hireZone);
        this.hireZone = null;

        return false;
    }
}

class HireZone implements IRenderObject
{
    rect: Rect;

    Init(rect: Rect)
    {
        this.rect = rect;
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.SelectionGUI;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.fillStyle = "#251F42";
        ctx.fillRect(this.rect.leftTop.x, this.rect.leftTop.y, this.rect.size.x, this.rect.size.y);
    }
}

class ShipPreview implements IRenderObject
{
    shipType: ShipType;
    shipAngle: number;

    Init(shipType: ShipType)
    {
        this.shipType = shipType;
        this.shipAngle = gameTS.renderUtils.DegToRad(0);
    }

    GetLayer(): RenderLayer
    {
        return RenderLayer.GUI;
    }

    Draw(ctx: CanvasRenderingContext2D): void
    {
        ctx.save();
        let pos = gameTS.mouseData.gamePosition;
        ctx.translate(pos.x, pos.y);

        ctx.rotate(this.shipAngle);
        let imgType = gameTS.shipsManager.templates.get(this.shipType).imageType;
        let img =  gameTS.imageLoader.Get(imgType);
        ctx.drawImage(img.raw, -img.raw.width / 2, -img.raw.height / 2);
        ctx.restore();
    }
}