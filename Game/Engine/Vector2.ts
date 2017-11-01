class JsonVector2
{
	x: number;
	y: number;
}

class Vector2
{
	x = 0;
	y = 0;

	Save()
	{
		let json = new JsonVector2();
		json.x = this.x;
		json.y = this.y;
		return json;
	}

	Parse(data: JsonVector2)
	{
		this.x = data.x;
		this.y = data.y;
		return this;
	}

	Init(x: number, y: number)
	{
		this.x = x;
		this.y = y;
		return this;
	}

	DistTo(v: Vector2)
	{
		return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
	}

	Clone()
	{
		return new Vector2().Init(this.x, this.y);
	}
}