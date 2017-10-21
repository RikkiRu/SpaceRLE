var ImageType;
(function (ImageType) {
    ImageType[ImageType["None"] = 0] = "None";
    ImageType[ImageType["StationSmall"] = 1] = "StationSmall";
    ImageType[ImageType["StationBig"] = 2] = "StationBig";
})(ImageType || (ImageType = {}));
var ImageLoader = (function () {
    function ImageLoader() {
    }
    ImageLoader.prototype.Init = function () {
        this.images = new Map();
        return this;
    };
    ImageLoader.prototype.Add = function (key, path) {
        var data = new IMGData();
        data.path = path;
        this.images.set(key, data);
    };
    ImageLoader.prototype.Load = function (oncomplete) {
        var imgCounter = 0;
        var total = this.images.size;
        if (total === 0)
            oncomplete();
        for (var item in ImageType) {
            if (isNaN(Number(item))) {
                var a = ImageType[item];
                if (a == ImageType.None)
                    continue;
                var data = this.images.get(a);
                data.raw = new Image();
                data.raw.onload = function () {
                    imgCounter++;
                    if (imgCounter === total)
                        oncomplete();
                };
                data.raw.src = data.path;
            }
        }
        return this;
    };
    return ImageLoader;
}());
var IMGData = (function () {
    function IMGData() {
    }
    return IMGData;
}());
//# sourceMappingURL=ImageLoader.js.map