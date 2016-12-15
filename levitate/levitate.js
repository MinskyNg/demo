(function(window, document){
    var de = document.documentElement;
    var db = document.body;

    function Levitate(opts) {
        this.banner = document.getElementById(opts.banner);
        this.speed = opts.speed;
        // 滚动时调用的函数
        if (opts.afterMove instanceof Function) {
            this.afterMove = opts.afterMove;
        }
        this.init();
    }

    Levitate.prototype = {
        init: function() {
            // 绑定窗口滚动事件
            this._handleScroll = this._handleScroll.bind(this);
            document.addEventListener('scroll', this._handleScroll);
        },

        _handleScroll: function() {
            var scrollTop = de.scrollTop + db.scrollTop;
            this.banner.style.top = scrollTop + 'px';
        },

        destroy: function() {
            document.removeEventListener('scroll', this._handleScroll);
        }
    };

    window.Levitate = Levitate;


    function BackTop(opts) {
        this.backTop = document.getElementById(opts.backTop);
        this.showHeight = opts.showHeight;
        this.speed = opts.speed;
        this.init();
    }

    BackTop.prototype = {
        init: function() {
            // 绑定窗口滚动事件
            this._handleScroll = debounce(this._handleScroll.bind(this), 50);
            document.addEventListener('scroll', this._handleScroll);
            // 绑定点击事件
            this._handleClick = this._handleClick.bind(this);
            this.backTop.addEventListener('click', this._handleClick);
        },

        _handleScroll: function() {
            var scrollTop = de.scrollTop + db.scrollTop;
            if (scrollTop > this.showHeight) {
                this.backTop.style.opacity = '1';
            } else {
                this.backTop.style.opacity = '0';
            }
        },

        _handleClick: function() {
            var pre = +new Date();
            var acc = 0;
            function move() {
                var top = 0;
                var scrollTop = de.scrollTop + db.scrollTop;
                var cur = +new Date();
                var passed = cur - pre;
                pre = cur;
                acc += passed;
                while (acc > 15 && scrollTop > 0) {
                    top += 15 * 4;
                    acc -= 15;
                }
                de.scrollTop -= top;
                db.scrollTop -= top;
                if (de.scrollTop + db.scrollTop > 0) {
                    setTimeout(move, 15);
                }
            }
            setTimeout(move, 15);
        },

        destroy: function() {
            document.removeEventListener('scroll', this._handleScroll);
            document.removeEventListener('scroll', this._handleClick);
        }
    };


    // 函数防抖
    function debounce(fn, delay) {
        var timer;
        return function() {
            var ctx = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(ctx, args);
            }, delay || 500);
        };
    }


    window.BackTop = BackTop;
})(window, document);
