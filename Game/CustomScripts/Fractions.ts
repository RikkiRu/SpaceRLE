class Fraction
{
    id: number;
    color: Color;

    Save()
    {
        let json = new JsonFractionData();
        json.id = this.id;
        json.color = this.color.Save();
        return json;
    }

    Load(json: JsonFractionData)
    {
        this.id = json.id;
        this.color = new Color().Parse(json.color);
        return this;
    }

    Init(id: number)
    {
        this.id = id;
        this.color = new Color();
        this.color.Randomize(20, 240);
        return this;
    }
}