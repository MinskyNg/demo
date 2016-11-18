(function(window, document){
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

        _handleScroll: function(ev) {
            var oEvent = ev || event;
            var scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
            this.banner.style.top = scrollTop + 'px';
            // var moveHeight = (scrollTop - this.banner.offsetTop) / 10;
            // moveHeight = moveHeight > 0 ? Math.ceil(moveHeight) : Math.floor(moveHeight);
            // if (moveHeight !== 0) {
            //     this.banner.style.top = this.banner.offsetTop + moveHeight + 'px';
            //     this.afterMove(moveHeight);
            //     setTimeout(this._handleScroll, this.speed);
            // }
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
            this._handleScroll = this._handleScroll.bind(this);
            document.addEventListener('scroll', this._handleScroll);
            // 绑定点击事件
            this._handleClick = this._handleClick.bind(this);
            this.backTop.addEventListener('click', this._handleClick);
        },

        _handleScroll: function(ev) {
            var oEvent = ev || event;
            var scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
            if (scrollTop > this.showHeight) {
                this.backTop.style.opacity = '1';
            } else {
                this.backTop.style.opacity = '0';
            }
        },

        _handleClick: function(ev) {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            // var moveHeight = document.documentElement.scrollTop + document.body.scrollTop;
            // if (moveHeight !== 0) {
            //     moveHeight = moveHeight > 100 ? moveHeight - 100 : 0;
            //     document.documentElement.scrollTop = moveHeight;
            //     document.body.scrollTop = moveHeight;
            //     setTimeout(this._handleClick, this.speed);
            // }
        },

        destroy: function() {
            document.removeEventListener('scroll', this._handleScroll);
            document.removeEventListener('scroll', this._handleClick);
        }
    };

    window.BackTop = BackTop;
})(window, document);
