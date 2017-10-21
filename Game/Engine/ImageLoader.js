var ImageLoader = (function () {
    function ImageLoader() {
    }
    ImageLoader.prototype.Init = function (paths, oncomplete) {
        this.images = [];
        var imgCounter = 0;
        var total = paths.length;
        if (total === 0)
            oncomplete();
        for (var i in paths) {
            var data = new IMGData();
            data.path = paths[i];
            data.raw = new Image();
            data.raw.onload = function () {
                imgCounter++;
                if (imgCounter === total)
                    oncomplete();
            };
            this.images.push(data);
            data.raw.src = data.path;
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