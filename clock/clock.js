(function(window, document){
    function Clock(opts) {
        this.canvas = document.getElementById(opts.id);
        // 设置画布大小
        this.dia = this.canvas.height = this.canvas.width = opts.radius * 2;
        this.radius = opts.radius;
        this.context = this.canvas.getContext('2d');
        // 表盘时针分针秒针颜色
        this.dialColor = opts.dialColor;
        this.hourColor = opts.hourColor;
        this.minColor = opts.minColor;
        this.secColor = opts.secColor;
        // 表盘刻度时针分针秒针宽度
        this.dialWidth = opts.dialWidth;
        this.degWidth = opts.degWidth;
        this.hourWidth = opts.hourWidth;
        this.minWidth = opts.minWidth;
        this.secWidth = opts.secWidth;
        // 绘图完成时调用的函数
        if (opts.afterDraw instanceof Function) {
            this.afterDraw = opts.afterDraw;
        }
        // 创建时分秒变量
        this.d;
        this.h;
        this.m;
        this.s;
        this.timer;
        this.draw();
    }

    Clock.prototype = {
        // 绘制图画
        draw: function() {
            this.context.clearRect(0, 0, this.dia, this.dia);
            this.now();
            this.drawDial();
            this.drawMinDegree();
            this.drawHourDegree();
            this.drawCenter();
            this.drawHour();
            this.drawMin();
            this.drawSec();
            if (this.afterDraw) {
                this.afterDraw(Math.floor(this.h), this.m, this.s);
            }
            this.timer = setTimeout(this.draw.bind(this), 1000);
        },

        // 获取当前时间
        now: function() {
            this.d = new Date();
            this.h = this.d.getHours();
            this.m = this.d.getMinutes();
            this.s = this.d.getSeconds();
            this.h += this.m / 60;
            // 时钟转一周12小时
            this.h = this.h > 12 ? this.h -12 : this.h;
        },

        // 表盘
        drawDial: function() {
            this.context.beginPath();
            this.context.lineWidth = this.dialWidth;
            this.context.strokeStyle = this.dialColor;
            // 圆心(x, y) 半径 起始终止角度 顺时针
            this.context.arc(this.radius, this.radius, 200, 0, 360, false);
            this.context.closePath();
            this.context.stroke();
            // this.context.fill();
        },

        // 时钟刻度
        drawHourDegree: function() {
            for (var i = 0; i < 12; i++) {
                // 保存画布状态
                this.context.save();
                this.context.lineWidth = this.degWidth;
                // 转换画布参照点
                this.context.translate(this.radius, this.radius);
                // 旋转1小时的弧度
                this.context.rotate( i * 30 * Math.PI / 180 );
                this.context.beginPath();
                this.context.moveTo(0, -180);
                this.context.lineTo(0, -160);
                this.context.strokeStyle = this.hourColor;
                this.context.closePath();
                this.context.stroke();
                // 还原状态
                this.context.restore();
            }
        },

        // 分针刻度
        drawMinDegree: function() {
            for (var i = 0; i < 60 ; i++) {
                this.context.save();
                this.context.translate(this.radius, this.radius);
                this.context.rotate(i * 6 * Math.PI / 180);
                this.context.beginPath();
                this.context.moveTo(0, -180);
                this.context.lineWidth = this.degWidth;
                this.context.lineTo(0, -170);
                this.context.strokeStyle = this.minColor;
                this.context.closePath();
                this.context.stroke();
                this.context.restore();
            }
        },

        // 圆心
        drawCenter: function() {
            this.context.beginPath();
            this.context.arc(this.radius, this.radius, 10, 0, 360, false);
            this.context.closePath();
            this.context.fill();
        },

        // 时针
        drawHour: function() {
            this.context.save();
            this.context.translate(this.radius,this.radius);
            this.context.rotate(this.h * 30 * Math.PI / 180);
            this.context.beginPath();
            this.context.moveTo(0, -110);
            this.context.lineTo(0, 30);
            this.context.lineWidth = this.hourWidth;
            this.context.strokeStyle = this.hourColor;
            this.context.closePath();
            this.context.stroke();
            this.context.restore();
        },

        // 分针
        drawMin: function() {
            this.context.save();
            this.context.translate(this.radius, this.radius);
            this.context.rotate(this.m * 6 * Math.PI / 180);
            this.context.beginPath();
            this.context.moveTo(0, -130);
            this.context.lineWidth = this.minWidth;
            this.context.lineTo(0, 25);
            this.context.strokeStyle = this.minColor;
            this.context.closePath();
            this.context.stroke();
            this.context.restore();
        },

        // 秒针
        drawSec: function() {
            this.context.save();
            this.context.translate(this.radius, this.radius);
            this.context.rotate(this.s * 6 * Math.PI / 180);
            this.context.beginPath();
            this.context.moveTo(0, 150);
            this.context.lineWidth = this.secWidth;
            this.context.strokeStyle = this.secColor;
            this.context.lineTo(0, -25);
            this.context.closePath();
            this.context.stroke();
            this.context.restore();
        },

        // 清除画布
        destroy: function() {
            clearTimeout(this.timer);
            this.context.clearRect(0, 0, this.dia, this.dia);
        }
    };

    window.Clock = Clock;
})(window, document);
