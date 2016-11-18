(function(window, document){
    function Dock(opts) {
        this.dockBar = document.getElementById(opts.dockId);
        this.dockImg = this.dockBar.getElementsByTagName(opts.dockTag);
        this.scaleText = document.getElementById(opts.scaleId).getElementsByTagName(opts.textTag);
        this.initScale = opts.initScale;
        this.init();
    }

    Dock.prototype = {
        init: function() {
            // 监听鼠标移动事件
            document.onmousemove = this._handleMousemove.bind(this);
        },

        _handleMousemove: function(ev) {
            var oEvent = ev||event;
            var i = 0;
            var length = this.dockImg.length;
            // 对所有图标进行相应缩放
            for (i = 0; i < length; i++) {
                // 得到图标中心点坐标
                var cenLeft = this.dockImg[i].offsetLeft + this.dockBar.offsetLeft + this.dockImg[i].offsetWidth / 2;
                var cenTop = this.dockImg[i].offsetTop + this.dockBar.offsetTop + this.dockImg[i].offsetHeight / 2;

                // 图标距离左侧 顶部的中心点坐标减去鼠标距离页面左侧的坐标
                var a = cenLeft - oEvent.clientX;
                var b = cenTop - oEvent.clientY;
                // 图标中心与鼠标距离
                var dis = Math.sqrt(a*a+b*b);

                // 缩放比例 距离越近放大越大
                var scale = 1 - dis / 300;
                // 防止过度缩小
                if (scale < 0.5) {
                    scale = 0.5;
                }
                // 缩放并显示比例
                this.dockImg[i].width = scale * this.initScale;
                this.scaleText[i].innerText = scale.toFixed(3);
            }
        },

        destroy: function() {
            document.onmousemove = null;
        }
    };

    window.Dock = Dock;
})(window, document);
