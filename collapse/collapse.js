(function($) {
    function Collapse($tar, opts) {
        this.$tar = $tar;
        this.btnSel = opts.btnSel;
        this.conSel = opts.conSel;
        this.aniTime = opts.aniTime;
        this.init();
    }

    Collapse.prototype = {
        // 初始化
        init: function() {
            this.$tar.on('click', this.btnSel, this._handleClick.bind(this));
        },

        _handleClick: function(event) {
            var $target = $(event.target);
            var show = false;
            // 如果相邻列表不可见
            if ($target.next().is(':visible') === false) {
                show = true;
                this.$tar.find(this.conSel).slideUp(this.aniTime);
            }
            $target.next().slideToggle(this.aniTime);
            // 事件广播
            if (show) {
                this.$tar.trigger('collapse.show', event.tatget);
            } else {
                this.$tar.trigger('collapse.close', event.tatget);
            }
        }
    };

    $.fn.collapse = function(options) {
        var defaults = {
            btnSel: '.collapse-title',
            conSel: 'ul',
            aniTime: 300,
        };
        new Collapse(this, $.extend({}, defaults, options));
        return this;
    };
})(jQuery);
