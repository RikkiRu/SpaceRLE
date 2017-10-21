var game; 

$(document).ready(function() 
{
	game = new Game(); 
	game.Start();
});

function Game() {}

Game.prototype.Start = function()
{
	this.canvas = document.getElementById("canvasMain");
	this.ctxW = this.canvas.clientWidth;
	this.ctxH = this.canvas.clientHeight;
	this.ctxW2 = this.ctxW / 2;
	this.ctxH2 = this.ctxH / 2;
	this.canvas.width = this.ctxW;
	this.canvas.height = this.ctxH;
	this.ctx = this.canvas.getContext('2d');	
	
	this.camX = 0;
	this.camY = 0;
	this.scale = 1;
	
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseRawX = 0;
	this.mouseRawY = 0;
	
	var coords = this.canvas.getBoundingClientRect();
	this.canvasCenterX = (coords.right - coords.left) / 2;
	this.canvasCenterY = (coords.bottom - coords.top) / 2;
	
	this.mouseDown = false;
	this.canvas.addEventListener("mousemove", function(event) { game.UpdateRawGameCoords(event, this); });
	this.canvas.addEventListener("mousedown", function(event) { if (event.button === 0) game.MouseState(true); });
	this.canvas.addEventListener("mouseup", function(event) { if (event.button === 0) game.MouseState(false); });
	this.canvas.oncontextmenu = function(event) { return false; };
	
	var now = (new Date).getTime();
	this.time = now;
	
	game.images = {};
	//game.images.infantry = { src: "textures/infantry.png" };
	//game.images.infantry_border = { src: "textures/infantry_border.png" };
	
	this.LoadImages();
}

Game.prototype.LoadImages = function()
{
	var imgCounter = 0;
	
	var total = 0;
	for (var i in game.images)
	{
		total++;
	}
	
	for (var i in game.images)
	{
		var imgData = game.images[i];
		
		imgData.raw = new Image();
		imgData.raw.onload = function() 
		{
			imgCounter++;
			
			if (imgCounter === total)
			{
				game.PreRender();
				game.Render();
			}
		};
		imgData.raw.src = imgData.src;
	}
}

Game.prototype.MouseState = function(isDown)
{
	if (this.mouseDown === isDown)
		return;
	
	this.mouseDown = isDown;
	console.log("Mouse down " + isDown);
}

Game.prototype.UpdateRawGameCoords = function(e, context)
{
	var coords = context.getBoundingClientRect();
    game.mouseRawX = e.clientX - coords.left;
    game.mouseRawY = e.clientY - coords.top;
	game.UpdateGameCoords();
};

Game.prototype.UpdateGameCoords = function()
{	
	var centerOffsetX = (game.mouseRawX - game.canvasCenterX) / game.scale;
	var centerOffsetY = (game.mouseRawY - game.canvasCenterY) / game.scale;
	game.mouseX = Math.round(game.camX - game.ctxW2 + (game.canvasCenterX + centerOffsetX));
	game.mouseY = Math.round(game.camY - game.ctxH2  + (game.canvasCenterY + centerOffsetY));
};

Game.prototype.PreRender = function()
{
	
}

Game.prototype.Render = function()
{
	// Calculating time delta
	var now = (new Date).getTime();
	var dt = now - game.time;
	game.time = now;
	
	var ctx = game.ctx;
	
	ctx.clearRect(0, 0, game.ctxW, game.ctxH);
	ctx.save();
	
	// Render all by layers
	
	ctx.restore();
	
	window.requestAnimationFrame(game.Render);
}