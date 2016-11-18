(function($) {
    function Fullpage($tar, opts) {
        this.$tar = $tar;
        this.$main = $(opts.mainSelector);
        this.$content = $(opts.contentSelector);
        this.scrollTime = opts.scrollTime;
        this.scrolled = false;
        this.index = 0;
        this.pageHeight = window.innerHeight;
        this.init();
    }

    Fullpage.prototype = {
        init: function() {
            this.$tar.css({
                'height': this.pageHeight + 'px',
                'overflow': 'hidden',
                'width': '100%'
            });
            this.$main.css({
                'position': 'relative',
                'top': 0
            });
            this.$content.css({
                'width': '100%',
                'height': this.pageHeight + 'px',
                'margin': 0,
                'padding': 0
            });

            // firefox浏览器事件名与其他浏览器不同
            if ((navigator.userAgent.toLowerCase().indexOf('firefox') !== -1)) {
                document.addEventListener('DOMMouseScroll', this._handleScroll.bind(this), false);
            } else if (document.addEventListener) {
                document.addEventListener('mousewheel', this._handleScroll.bind(this), false);
            } else if (document.attachEvent) {
                document.attachEvent('onmousewheel', this._handleScroll.bind(this));
            } else {
                document.onmousewheel = this._handleScroll.bind(this);
            }
        },

        _handleScroll: function(ev) {
            var oEvent = ev || event;
            var self = this;
            if (this.scrolled === false) {
                // firefox中方向判断与其他浏览器相反
                var delta = oEvent.detail || (-oEvent.wheelDelta);
                this.scrolled = true;
                // 向下翻页并防止超过最后一屏
                if (delta > 0 && parseInt(this.$main.css('top')) > -this.pageHeight * ( this.$content.length - 1)) {
                    this.$main.animate({top: '-=' + this.pageHeight}, this.scrollTime, function() {
                        self.scrolled = false;
                        self.index++
                        // 事件广播
                        self.$tar.trigger('scrollDown', self.index);
                    });// 向上翻页并防止超过最上一屏
                } else if (delta < 0 && parseInt(this.$main.css('top')) < 0) {
                    this.$main.animate({top: '+=' + this.pageHeight}, this.scrollTime, function() {
                        self.scrolled = false;
                        self.index--;
                        // 事件广播
                        self.$tar.trigger('scrollUp', self.index);
                    });
                } else {
                    this.scrolled = false;
                }
            }
        },

        destroy: function() {
            // 去除样式
            this.$tar.removeAttr('style')
            this.$main.removeAttr('style');
            this.$content.removeAttr('style').height(this.pageHeight);

            // 解除事件绑定
            if ((navigator.userAgent.toLowerCase().indexOf('firefox') !== -1)) {
                document.removeEventListener('DOMMouseScroll', this._handleScroll.bind(this));
            } else if (document.removeEventListener) {
                document.removeEventListener('mousewheel', this._handleScroll.bind(this));
            } else if (document.detachEvent) {
                document.detachEvent('onmousewheel', this._handleScroll.bind(this));
            } else {
                document.onmousewheel = null;
            }
        }
    };


    $.fn.fullpage = function(options) {
        // 参数为对象则新建组件
        if ($.type(options) === 'object' || $.type(options) === 'undefined') {
            var defaults = {
                mainSelector: '#main',
                contentSelector: '.content',
                scrollTime: 700
            };
            var fullpage = new Fullpage(this, $.extend({}, defaults, options));
            this.data('fullpage', fullpage);
        // 参数为其他则调用方法
        } else {
            var fullpage = this.data('fullpage');
            var returnVal;
            if (fullpage[options] && $.isFunction(fullpage[options])) {
                returnVal = fullpage[options].call(fullpage, Array.prototype.slice.call(arguments,1));
            }
            if (returnVal) return returnVal;
        }
        return this;
    };
})(jQuery);
