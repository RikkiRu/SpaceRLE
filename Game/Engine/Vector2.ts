class Vector2
{
	x = 0;
	y = 0;

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