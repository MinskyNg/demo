(function(window, document){
    function Snake(opts) {
        this.map = opts.map;
        this.button = opts.button;
        this.score = opts.score;
        // 贪吃蛇的身体
        this.snakeBody = [];
        // 初始移动方向
        this.stepX = 20;
        this.stepY = 0;
        this.moveDir = 'right';
        // 控制移动定时器
        this.timer;
        this.init();
    }

    Snake.prototype = {
        init: function() {
            var self = this;
            // 监听方向键
            document.onkeydown = this.dirControl.bind(this);
            // 点击按钮初始化游戏
            this.button.onclick = function() {
                if (this.innerHTML === '重新开始') {
                    // 重置
                    self.map.innerHTML = '';
                    self.snakeBody = [];
                    self.stepX = 20;
                    self.stepY = 0;
                    self.moveDir = 'right';
                    clearTimeout(self.timer);
                }
                for (var i = 2; i >= 0; i--) {
                    self.initSnake(i);
                }
                self.snakeMove();
                self.touchBound();
                self.generateFood();
                self.eat();
                // 按钮点击一次后失效
                this.innerHTML= '重新开始';
            }
        },

        // 控制方向
        dirControl: function(ev) {
            var oEvent = ev || event;
            var n = oEvent.keyCode;
            switch(n) {
                case 37:
                    // 向相反方向运动时按键无效
                    if (this.moveDir === 'right') {
                        break;
                    } else {
                        this.stepX = -20;
                        this.stepY = 0;
                        this.moveDir = 'left';
                    }
                    this.reMove();
                break;
                case 38:
                    if (this.moveDir === 'down') {
                        break;
                    } else {
                        this.stepX = 0;
                        this.stepY = -20;
                        this.moveDir = 'up';
                    }
                    this.reMove();
                break;
                case 39:
                    if ( this.moveDir === 'left') {
                        break;
                    } else {
                        this.stepX = 20;
                        this.stepY = 0;
                        this.moveDir = 'right';
                    }
                    this.reMove();
                break;
                case 40:
                    if (this.moveDir === 'up') {
                        break;
                    } else {
                        this.stepX = 0;
                        this.stepY = 20;
                        this.moveDir = 'down';
                    }
                    this.reMove();
                break;
            }
        },

        // 初始化蛇身
        initSnake: function(num) {
            var snakeNode = document.createElement('div');
            snakeNode.style.position = 'absolute';
            snakeNode.style.top = '0px';
            snakeNode.style.left =  num * 20+'px';
            snakeNode.style.background = '#383838';
            snakeNode.style.width = '20px';
            snakeNode.style.height = '20px';
            this.snakeBody.push(snakeNode);
            this.map.appendChild(snakeNode);
        },

        // 让蛇移动
        snakeMove: function() {
            // 前一个部分位置等于上一个部分
            for(var i = this.snakeBody.length - 1; i > 0; i--) {
                this.snakeBody[i].style.left = this.snakeBody[i-1].style.left;
                this.snakeBody[i].style.top = this.snakeBody[i-1].style.top;
            }
            // 设置蛇头前进位置
            this.snakeBody[0].style.left = parseInt(this.snakeBody[0].style.left) + this.stepX +'px';
            this.snakeBody[0].style.top = parseInt(this.snakeBody[0].style.top) + this.stepY +'px';
            // 不断前行
            this.timer = setTimeout(this.snakeMove.bind(this), 400);
        },

        // 重置运动
        reMove: function() {
            clearTimeout(this.timer);
            this.snakeMove()
        },

        // 判断是否死亡
        touchBound: function() {
            // 计算得分
            this.score.innerHTML = (this.snakeBody.length-3);
            // 获取蛇头位置
            var x1 = parseInt(this.snakeBody[0].style.left);
            var y1 = parseInt(this.snakeBody[0].style.top);
            // 判断是否碰到墙壁
            if (x1<0 || x1>580 || y1<0 || y1>580) {
                alert('Game Over');
                window.location.reload();
            }
            // 判断是否碰到自己
            if (this.snakeBody.length > 4) {
                var len = this.snakeBody.length - 1;
                for (var i = 3; i < len; i++) {
                    var x2 = parseInt(this.snakeBody[i].style.left);
                    var y2 = parseInt(this.snakeBody[i].style.top);
                    if (x1 === x2 && y1 === y2) {
                        alert('Game Over');
                        window.location.reload();
                    }
                }
            }
            setTimeout(this.touchBound.bind(this), 30);
        },

        // 生成食物
        generateFood: function() {
            var foodX = Math.floor(Math.random() * 29) * 20 + 'px';
            var foodY = Math.floor(Math.random() * 29) * 20 + 'px';
            var foodDiv = document.createElement('div');
            // 设置食物位置
            foodDiv.style.position = 'absolute';
            foodDiv.style.top = foodY;
            foodDiv.style.left = foodX;
            foodDiv.style.width = '20px';
            foodDiv.style.height = '20px';
            foodDiv.style.backgroundColor = '#fff';
            // 给食物做标记
            foodDiv.id = 'food';
            this.map.appendChild(foodDiv);
        },

        // 吃掉食物
        eat: function() {
            // 得到蛇头坐标
            var x1 = parseInt(this.snakeBody[0].style.left);
            var y1 = parseInt(this.snakeBody[0].style.top);
            // 得到食物坐标
            var food = document.getElementById('food');
            var x2 = parseInt(food.style.left);
            var y2 = parseInt(food.style.top);
            if (Math.abs(x1 - x2) < 20 && Math.abs(y1 - y2) < 20) {
                food.style.backgroundColor = '#383838';
                this.snakeBody.push(food);
                food.id = '';
                // 生成食物
                this.generateFood();
            }
            setTimeout(this.eat.bind(this), 30);
        }
    };

    window.Snake = Snake;
})(window, document);
