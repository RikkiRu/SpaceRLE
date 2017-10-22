var RenderUtils = (function () {
    function RenderUtils() {
    }
    RenderUtils.prototype.DegToRad = function (v) {
        return v * Math.PI / 180;
    };
    RenderUtils.prototype.Random = function (m, n) {
        return Math.floor(Math.random() * (n - m)) + m;
    };
    ;
    return RenderUtils;
}());
//# sourceMappingURL=RenderUtils.js.map