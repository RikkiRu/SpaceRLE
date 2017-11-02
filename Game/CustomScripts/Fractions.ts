class FleetRow
{
    ship: ShipType;
    count: number;

    Save()
    {
        let json = new JsonFleetRow();
        json.shipName = ShipType[this.ship];
        json.count = this.count;
        return json;
    }

    Load(json: JsonFleetRow)
    {
        this.ship = ShipType[json.shipName];
        this.count = json.count;
        return this;
    }
}

class Fraction
{
    id: number;
    color: Color;
    fleet: FleetRow[];

    Save()
    {
        let json = new JsonFractionData();
        json.id = this.id;
        json.color = this.color.Save();

        json.fleet = [];
        for (let i=0; i<this.fleet.length; i++)
            json.fleet.push(this.fleet[i].Save());

        return json;
    }

    Load(json: JsonFractionData)
    {
        this.id = json.id;
        this.color = new Color().Parse(json.color);
        this.fleet = [];

        for(let i=0; i<json.fleet.length; i++)
            this.fleet.push(new FleetRow().Load(json.fleet[i]));

        return this;
    }

    GetFleetRow(ship: ShipType): FleetRow
    {
        for (let i=0; i<this.fleet.length; i++)
        {
            let temp = this.fleet[i];
            if(temp.ship === ship)
                return temp;
        }

        return null;
    }

    ChangeShipsCount(ship: ShipType, delta: number)
    {
        let row = this.GetFleetRow(ship);
        if (row == null)
        {
            row = new FleetRow();
            row.ship = ship;
            row.count = 0;
            this.fleet.push(row);
        }

        row.count += delta;
        if (row.count < 0)
        {
            row.count = 0;
            console.warn("Ships count < 0");
        }
    }

    Init(id: number)
    {
        this.id = id;
        this.color = new Color();
        this.color.Randomize(50, 240);
        this.fleet = [];
        this.ChangeShipsCount(ShipType.Ship1, 3);
        this.ChangeShipsCount(ShipType.Ship5, 5);

        return this;
    }
}