var ImageLoader = (function () {
    function ImageLoader() {
    }
    ImageLoader.prototype.Init = function () {
        this.images = new Map();
        return this;
    };
    ImageLoader.prototype.Get = function (key) {
        return this.images.get(ImageType[key]);
    };
    ImageLoader.prototype.Add = function (key, path) {
        var data = new IMGData();
        data.path = path;
        this.images.set(ImageType[key], data);
    };
    ImageLoader.prototype.Load = function (oncomplete) {
        var imgCounter = 0;
        var total = this.images.size;
        if (total === 0)
            oncomplete();
        this.images.forEach(function (data, key) {
            data.raw = new Image();
            data.raw.onload = function () {
                imgCounter++;
                if (imgCounter === total)
                    oncomplete();
            };
            data.raw.src = data.path;
        });
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