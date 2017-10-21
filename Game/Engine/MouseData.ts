class MouseData
{
	gamePosition: Vector2;
	rawPosition: Vector2;
	mouseDown = false;
	canvas: CanvasData;
	camera: CameraData;

	Init(canvas: CanvasData, camera: CameraData)
	{
		this.canvas = canvas;
		this.camera = camera;
		let self = this;
		canvas.html.addEventListener("mousemove", function(event) { self.UpdateRawGameCoords(event, this); });
		canvas.html.addEventListener("mousedown", function(event) { if (event.button === 0) self.MouseState(true); });
		canvas.html.addEventListener("mouseup", function(event) { if (event.button === 0) self.MouseState(false); });
		canvas.html.oncontextmenu = function(event) { return false; };
		return this;
	}

	UpdateRawGameCoords(e: MouseEvent, context: HTMLCanvasElement)
	{
		let coords = context.getBoundingClientRect();
		this.rawPosition = new Vector2().Init(e.clientX - coords.left, e.clientY - coords.top);
		this.UpdateGameCoords();
	}

	MouseState(isDown: boolean)
	{
		if (this.mouseDown === isDown)
			return;

		this.mouseDown = isDown;
		console.log("Mouse down " + isDown);
	}

	UpdateGameCoords()
	{
		let centerOffsetX = (this.rawPosition.x - this.canvas.center.x) / this.camera.scale.x;
		let centerOffsetY = (this.rawPosition.y - this.canvas.center.y) / this.camera.scale.y;
		let x = Math.round(this.camera.position.x - this.canvas.ctxSize2.x + (this.canvas.center.x + centerOffsetX));
		let y = Math.round(this.camera.position.y - this.canvas.ctxSize2.y  + (this.canvas.center.y + centerOffsetY));
		this.gamePosition = new Vector2().Init(x, y);
	}
}