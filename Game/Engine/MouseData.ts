/// <reference path="..\..\Scripts\typings\jquery-3.2.1.d.ts"/>

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

		this.gamePosition = new Vector2().Init(0, 0);
		this.rawPosition = new Vector2().Init(0, 0);

		canvas.html.addEventListener("mousemove", function(event) { self.UpdateRawGameCoords(event, this); });
		canvas.html.addEventListener("mousedown", function(event) { self.MouseState(event, this, true); });
		canvas.html.addEventListener("mouseup", function(event) { self.MouseState(event, this, false); });
		canvas.html.addEventListener("touchstart", function(event) { self.MouseStateTouch(event, this, true); });
		canvas.html.addEventListener("touchend", function(event) { self.MouseStateTouch(event, this, false); });
		canvas.html.addEventListener("touchmove", function(event) { self.UpdateRawGameCoordsTouch(event, this); });

		canvas.html.oncontextmenu = function(event) { return false; };
		return this;
	}

	UpdateRawGameCoordsTouch(e: TouchEvent, context: HTMLCanvasElement)
	{
		if (e.touches.length < 1)
			return;

		let coords = context.getBoundingClientRect();
		this.rawPosition = new Vector2().Init(e.touches[0].clientX - coords.left, e.touches[0].clientY - coords.top);
		this.UpdateGameCoords();
	}

	UpdateRawGameCoords(e: MouseEvent, context: HTMLCanvasElement)
	{
		let coords = context.getBoundingClientRect();
		this.rawPosition = new Vector2().Init(e.clientX - coords.left, e.clientY - coords.top);
		this.UpdateGameCoords();
	}

	MouseStateTouch(e: TouchEvent, context: HTMLCanvasElement, isDown: boolean)
	{
		if (this.mouseDown === isDown)
			return;

		gameTS.mouseData.UpdateRawGameCoordsTouch(e, context);

		this.mouseDown = isDown;
		gameTS.ProcessMouse(isDown);
	}

	MouseState(e: MouseEvent, context: HTMLCanvasElement, isDown: boolean)
	{
		if (this.mouseDown === isDown)
			return;

		gameTS.mouseData.UpdateRawGameCoords(e, context);

		this.mouseDown = isDown;
		gameTS.ProcessMouse(isDown);
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