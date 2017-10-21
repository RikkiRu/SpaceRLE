class CanvasData
{
	html: HTMLCanvasElement;
	center: Vector2;

	get ctxSize() { return new Vector2().Init(this.html.clientWidth, this.html.clientHeight); }

	get ctxSize2()
	{
		let v = this.ctxSize;
		return v.Init(v.x / 2, v.y / 2);
	}

	get ctx() { return this.html.getContext('2d'); }

	Init(canvasName: string)
	{
		this.html = $("#" + canvasName)[0] as HTMLCanvasElement;
		let size = this.ctxSize;
		this.html.width = size.x;
		this.html.height = size.y;

		let coords = this.html.getBoundingClientRect();
		this.center = new Vector2().Init((coords.right - coords.left) / 2, (coords.bottom - coords.top) / 2);

		return this;
	}
}