class HireController
{
    shipPreview: ShipPreview;
    hireZone: HireZone;
    hireZoneRectL: Rect;
    hireZoneRectR: Rect;

    constructor()
    {
        let dx = 30;
        let w = 250;
        let h = 600;
        let t = -h/2;

        this.hireZoneRectL = new Rect().Init(-w-dx, t, w, h);
        this.hireZoneRectR = new Rect().Init(dx, t, w, h);
    }

    PrepareToHire(shipType: ShipType)
    {
        if (this.shipPreview != null)
        {
            gameTS.RemoveObject(this.shipPreview);
            gameTS.RemoveObject(this.hireZone);
        }

        this.shipPreview = new ShipPreview();
        this.shipPreview.Init(shipType);
        gameTS.renderObjects.push(this.shipPreview);

        this.hireZone = new HireZone();
        this.hireZone.Init(this.hireZoneRectL);
        gameTS.renderObjects.push(this.hireZone);
    }

    ProcessMouse(isDown: boolean)
    {
        if (this.shipPreview != null)
        {
            if (this.hireZoneRectL.IsInside(gameTS.mouseData.gamePosition))
            {
                gameTS.shipsManager.SpawnShip(
                    this.shipPreview.shipType, Team.Left, gameTS.mouseData.gamePosition, this.shipPreview.shipAngle);

                gameTS.shipsManager.SpawnShip(
                    this.shipPreview.shipType, Team.Right, this.hireZoneRectR.GetRandomPoint(), gameTS.renderUtils.DegToRad(180));
            }
            else
            {
                //gameTS.shipsManager.SpawnShip(
                //    this.shipPreview.shipType, Team.Right, gameTS.mouseData.gamePosition, this.shipPreview.shipAngle);
            }

            gameTS.RemoveObject(this.shipPreview);
            gameTS.RemoveObject(this.hireZone);

            return true;
        }

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