var Station = (function () {
    function Station() {
        this.isMainStation = false;
    }
    Station.prototype.Init = function (position) {
        this.position = position;
        return this;
    };
    Station.prototype.Draw = function (ctx) {
        var spriteType = this.isMainStation ? ImageType.StationBig : ImageType.StationSmall;
        var img = gameTS.imageLoader.images.get(spriteType);
        ctx.drawImage(img.raw, this.position.x - img.raw.width / 2, this.position.y - img.raw.height / 2);
    };
    return Station;
}());
//# sourceMappingURL=Station.js.map