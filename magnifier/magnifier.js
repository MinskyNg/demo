(function(window, document){
    function Magnifier(opts) {
        this.magnifier = document.getElementById(opts.magnifierId);
        this.smallImg = document.getElementById(opts.smallId);
        this.drag = document.getElementById(opts.dragId);
        this.imgWrap = document.getElementById(opts.wrapId);
        this.bigImg = document.getElementById(opts.bigId);
        this.init();
    }

    Magnifier.prototype = {
        init: function() {
            this.magnifier.onmousemove = this._handleMousemove.bind(this);
            this.magnifier.onmouseout = this._handleMouseout.bind(this);
        },

        // 当鼠标在magnifier上面移动的事件
        _handleMousemove: function(ev) {
            var oEvent = ev || event;
            // 拖拽框显示
            this.drag.style.display = 'block';
            // 放大镜显示
            this.imgWrap.style.display = 'block';
            // magnifier内部拖拽框距离magnifier左侧 顶部距离
            var leftDis = oEvent.clientX - this.magnifier.offsetLeft - this.drag.offsetWidth / 2;
            var topDis = oEvent.clientY - this.magnifier.offsetTop - this.drag.offsetHeight / 2;
            // magnifier内部x y方向可移动最大距离
            var maxmoveX = this.magnifier.clientWidth - this.drag.offsetWidth;
            var maxmoveY = this.magnifier.clientHeight - this.drag.offsetHeight;
            // 防止拖拽框溢出this.magnifier右 下 左 上侧
            if (leftDis > maxmoveX) {
                leftDis = maxmoveX;
            }
            if (topDis > maxmoveY) {
                topDis = maxmoveY;
            }
            if(leftDis < 0){
                leftDis = 0;
            }
            if(topDis < 0){
                topDis = 0;
            }
            // 确定拖拽框位置
            this.drag.style.left = leftDis + 'px';
            this.drag.style.top = topDis + 'px';
            // 求得要放大的倍数
            var scale = this.bigImg.offsetWidth / this.smallImg.offsetWidth;
            // 移动imgWrap隐藏滚动条(overflow: scroll可见效果) 显示放大区域
            this.imgWrap.scrollLeft = this.drag.offsetLeft * scale;
            this.imgWrap.scrollTop = this.drag.offsetTop * scale;
        },

        _handleMouseout: function() {
            // 鼠标移出时隐藏拖拽框和放大镜
            this.drag.style.display = 'none';
            this.imgWrap.style.display = 'none';
        },

        destroy: function() {
            this.magnifier.onmousemove = null;
            this.magnifier.onmouseout = null;
        }
    };

    window.Magnifier = Magnifier;
})(window, document);
