(function($) {
    function Lightbox($tar, opts) {
        this.$tar = $tar;
        this.$bigImg = $tar.children('img');
        this.wrapSel = opts.wrapSel;
        this.prevSel = opts.prevSel;
        this.nextSel = opts.nextSel;
        this.$smallImg;
        this.aniTime = opts.aniTime;
        this.init();
    }

    Lightbox.prototype = {
        init: function() {
            $(this.wrapSel).click(this._smallImgClick.bind(this));
            this.$tar.click(this._lightboxClick.bind(this));
        },

        _smallImgClick: function(ev) {
            this.$smallImg = $(ev.target || event.srcElement);
            if (this.$smallImg.is('img')) {
                this.$bigImg.attr('src', this.$smallImg.attr('src'));
                this.$tar.fadeIn(this.aniTime).trigger('fadeIn', this.$smallImg);
            }
        },

        _lightboxClick: function(ev) {
            var $target = $(ev.target || event.srcElement);
            // 显示前一张图
            if ($target.is(this.prevSel)) {
                if (!this.$smallImg.is(this.wrapSel + ' img:first-child')) {
                    this.$smallImg = this.$smallImg.prev(this.wrapSel + ' img');
                    this.$bigImg.attr('src', this.$smallImg.attr('src'));
                }
                // 显示后一张图
            } else if ($target.is(this.nextSel)) {
                if (!this.$smallImg.is(this.wrapSel + ' img:last-child')) {
                    this.$smallImg = this.$smallImg.next(this.wrapSel + ' img');
                    this.$bigImg.attr('src', this.$smallImg.attr('src'));
                }
                // 灯箱消失
            } else {
                this.$tar.fadeOut(this.aniTime).trigger('fadeOut', this.$smallImg);;
            }
        },

        destroy: function() {
            $(this.wrapSel).off('click');
            this.$tar.off('click');
        }
    };

    $.fn.lightbox = function(options) {
        // 参数为对象则新建组件
        if ($.type(options) === 'object' || $.type(options) === 'undefined') {
            var defaults = {
                aniTime: 'fast',
                wrapSel: '#img-wrap',
                prevSel: '#prev',
                nextSel: '#next'
            };
            var lightbox = new Lightbox(this, $.extend({}, defaults, options));
            this.data('lightbox', lightbox);
        // 参数为其他则调用方法
        } else {
            var lightbox = this.data('lightbox');
            var returnVal;
            if (lightbox[options] && $.isFunction(lightbox[options])) {
                returnVal = lightbox[options].call(lightbox, Array.prototype.slice.call(arguments,1));
            }
            if (returnVal) return returnVal;
        }
        return this;
    };
})(jQuery);
