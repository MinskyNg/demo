(function(window, document){
    function ScrollBar(opts) {
        this.main = document.getElementById(opts.mainId);
        this.content = document.getElementById(opts.contentId);
        this.aside = document.getElementById(opts.asideId);
        this.bar = document.getElementById(opts.barId);
        this.init();
    }

    ScrollBar.prototype = {
        init: function() {
            // 根据显示区与总内容区高度比例 初始化滚动条高度
            this.bar.style.height = this.aside.offsetHeight * (this.main.offsetHeight / this.content.offsetHeight) + 'px';
            this.bar.onmousedown = this._handleMousedown.bind(this);
            // firefox浏览器事件名与其他浏览器不同
            if ((navigator.userAgent.toLowerCase().indexOf('firefox') !== -1)) {
                this.main.addEventListener('DOMMouseScroll', this._handleScroll.bind(this), false);
            } else if (this.main.addEventListener) {
                this.main.addEventListener('mousewheel', this._handleScroll.bind(this), false);
            } else if (this.main.attachEvent) {
                this.main.attachEvent('onmousewheel', this._handleScroll.bind(this));
            } else {
                this.main.onmousewheel = this._handleScroll.bind(this);
            }
        },

        // 设置滚动条位置和内容区位置
        setPos: function(relativeY) {
            // 防止滚动条向上超过侧边区
            if (relativeY < 0) {
                relativeY = 0;
            // 防止滚动条向下超过侧边区
            } else if (relativeY > this.aside.offsetHeight - this.bar.offsetHeight) {
                relativeY = this.aside.offsetHeight - this.bar.offsetHeight;
            }
            // 设置滚动条位置
            this.bar.style.top = relativeY + 'px';
            // 设置内容区位置
            var scale = relativeY / (this.aside.offsetHeight - this.bar.offsetHeight);
            this.content.style.top = -scale * (this.content.offsetHeight - this.main.offsetHeight) + 'px';
        },

        // 为滚动条注册鼠标按下事件
        _handleMousedown: function(ev) {
            var self = this;
            var oEvent = ev || event;
            var disY = oEvent.clientY - this.bar.offsetTop;
            // 为滚动条注册鼠标移动事件
            document.onmousemove = function(ev) {
                var oEvent = ev || event;
                // 计算鼠标移动时，滚动条顶部相对侧边区顶部的距离
                var relativeY = oEvent.clientY - disY;
                // 设置滚动条位置和内容区位置
                self.setPos(relativeY);
            }
            // 为滚动条注册鼠标松开事件
            document.onmouseup = function() {
                // 解除事件绑定
                document.onmousemove = null;
                document.onmouseup = null;
            }
            // 终止事件
            return false;
        },

        _handleScroll: function(ev) {
            var oEvent = ev || event;
            // firefox中方向判断与其他浏览器相反
            var delta = oEvent.detail || (-oEvent.wheelDelta);
            var relativeY = this.bar.offsetTop;
            if (delta > 0) {
                relativeY += 10;
            } else {
                relativeY -= 10;
            }
            this.setPos(relativeY);
            return false;
        },

        destroy: function() {
            this.aside.parentNode.removeChild(this.aside);
            if ((navigator.userAgent.toLowerCase().indexOf('firefox') !== -1)) {
                this.main.removeEventListener('DOMMouseScroll', this._handleScroll.bind(this), false);
            } else if (this.main.removeEventListener) {
                this.main.removeEventListener('mousewheel', this._handleScroll.bind(this), false);
            } else if (this.main.detachEvent) {
                this.main.detachEvent('onmousewheel', this._handleScroll.bind(this));
            } else {
                this.main.onmousewheel = null;
            }
        }
    };

    window.ScrollBar = ScrollBar;
})(window, document);
