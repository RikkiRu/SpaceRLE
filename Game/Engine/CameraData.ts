class CameraData
{
	position: Vector2;
	scale: Vector2;

	Init()
	{
		this.position = new Vector2().Init(0, 0);
		this.scale = new Vector2().Init(1, 1);
		return this;
	}
}