var AnimationType;
(function (AnimationType) {
    AnimationType[AnimationType["None"] = 0] = "None";
    AnimationType[AnimationType["explosion"] = 1] = "explosion";
})(AnimationType || (AnimationType = {}));
var Animation = (function () {
    function Animation(animationType, renderLayer, position) {
        this.animationType = animationType;
        this.frameRate = 30;
        this.currentTime = 0;
        this.renderLayer = renderLayer;
        this.position = position;
        this.currentFrame = 0;
        this.scale = 1;
        gameTS.renderObjects.push(this);
    }
    Animation.prototype.Update = function (dt) {
        this.currentTime += dt;
        if (this.currentTime >= this.frameRate) {
            this.currentTime -= this.frameRate;
            this.currentFrame++;
            if (!gameTS.imageLoader.images.has(AnimationType[this.animationType] + this.currentFrame.toString())) {
                gameTS.RemoveObject(this);
            }
        }
    };
    Animation.prototype.GetLayer = function () {
        return this.renderLayer;
    };
    Animation.prototype.Draw = function (ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.scale, this.scale);
        var img = gameTS.imageLoader.images.get(AnimationType[this.animationType] + this.currentFrame.toString());
        ctx.drawImage(img.raw, -img.raw.width / 2, -img.raw.height / 2);
        ctx.restore();
    };
    return Animation;
}());
//# sourceMappingURL=Animation.js.map