(function($) {
    function Slide($tar, opts) {
        this.$tar = $tar;
        this.$slideList = $(opts.listSeletor);
        this.slideLength = this.$slideList.children('li').length - 2;
        this.activeId = opts.activeId;
        this.indexSeletor = opts.indexSeletor;
        this.$indexList = $(this.indexSeletor + ' li');
        this.prevSeletor = opts.prevSeletor;
        this.nextSeletor = opts.nextSeletor;
        this.stopTime = opts.stopTime;
        this.slideTime = opts.slideTime;
        this.slideWidth = opts.slideWidth;
        this.slided = false;
        this.slideIndex = 0;
        this.slideInterval;
        this.init();
    }

    Slide.prototype = {
        init: function() {
            this.$slideList.width((this.slideLength + 2) * this.slideWidth);
            // 为下标添加索引
            for (var i = 0; i < this.slideLength; i++) {
               this.$indexList.eq(i).data('index', i);
            }
            this.$tar.mouseover(this._handleMouseover.bind(this))
                .mouseout(this._handleMouseout.bind(this))
                .click(this._handleClick.bind(this));
            // 循环播放
            this.slideInterval = setInterval(this.slideNext.bind(this), this.stopTime);
        },

        // 默认播放下一张 根据 offset 的不同有所差别
        slideNext: function(offset) {
            var slideOffset = (offset * -this.slideWidth) || -this.slideWidth;
            if (this.slided === false) {
                this.slided = true;
                $('#' + this.activeId).removeAttr('id');
                this.$indexList.eq((this.slideIndex = this.slideIndex + (offset || 1) ) % this.slideLength)
                    .attr('id', this.activeId);
                var self = this;
                this.$slideList.animate({
                    left: '+=' + slideOffset
                }, this.slideTime, function() {
                    if (parseInt(self.$slideList.css('left')) < (-self.slideWidth * self.slideLength)) {
                        self.$slideList.css('left', -self.slideWidth);
                    }
                    if (parseInt(self.$slideList.css('left')) > -self.slideWidth) {
                        self.$slideList.css('left', -self.slideWidth * self.slideLength);
                    }
                    self.slided = false;
                });
                self.$tar.trigger('slideNext', self.slideIndex % self.slideLength);
            }
        },

        // 当鼠标移入时停止播放并显示箭头
        _handleMouseover: function() {
            clearInterval(this.slideInterval);
            $(this.prevSeletor).css({ display: 'block' });
            $(this.nextSeletor).css({ display: 'block' });
        },

        // 当鼠标移开时重新播放并隐藏箭头
        _handleMouseout: function() {
            this.slideInterval = setInterval(this.slideNext.bind(this), this.stopTime);
            $(this.prevSeletor).css({ display: 'none' });
            $(this.nextSeletor).css({ display: 'none' });
        },

        // 当点击下标时，滚动到相应位置
        _handleClick: function(ev) {
            var oEvent = ev || event;
            var $target = $(oEvent.target || oEvent.srcElement);
            if ($target.is(this.prevSeletor)) {
                this.slideNext(-1);
            }
            if ($target.is(this.nextSeletor)) {
                this.slideNext();
            }
            if ($target.is(this.indexSeletor + ' li') && !$target.is('#' + this.activeId)) {
                var offset = $target.data('index') - $('#' + this.activeId).data('index');
                this.slideNext(offset);
            }
        },

        destroy: function() {
            // 解除事件绑定
            this.$tar.off('mouseover').off('mouseout').off('click');
            // 取消自动滚动
            clearInterval(this.slideInterval);
        }
    };


    $.fn.slide = function(options) {
        // 参数为对象则新建组件
        if ($.type(options) === 'object' || $.type(options) === 'undefined') {
            var defaults = {
                listSeletor: '#slide-list',
                indexSeletor: '#slide-index',
                prevSeletor: '#slide-prev',
                nextSeletor: '#slide-next',
                activeId: 'slide-active',
                stopTime: 2000,
                slideTime: 1000
            };
            var slide = new Slide(this, $.extend({}, defaults, options));
            this.data('slide', slide);
        // 参数为其他则调用方法
        } else {
            var slide = this.data('slide');
            var returnVal;
            if (slide[options] && $.isFunction(slide[options])) {
                returnVal = slide[options].call(slide, Array.prototype.slice.call(arguments,1));
            }
            if (returnVal) return returnVal;
        }
        return this;
    };
})(jQuery);
