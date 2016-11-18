(function(window, document){
    function Calculator() {
        // 存储数值
        this.num = 0;
        // 运算结果
        this.result = 0;
        // 显示数值
        this.screenNum = '0';
        // 输入状态标志
        this.input = 0;
        // 计算状态标志
        this.operate = 0;
        // 防止重复输入标志
        this.quit = 0;
        // 显示屏DOM元素
        this.screen = document.getElementById('screen');
        // 按键DOM元素
        this.buttons = document.getElementById('buttons');
        // 操作符映射
        this.operateMap = {
            '←': this.backspace.bind(this),
            'C': this.clearScreen.bind(this),
            '×': this.times.bind(this),
            '÷': this.divide.bind(this),
            '+': this.plus.bind(this),
            '-': this.minus.bind(this),
            '%': this.mod.bind(this),
            '=': this.equal.bind(this),
            '00': this.dzero.bind(this),
            '.': this.dot.bind(this)
        };

        this.buttons.addEventListener('click', this.handleClick.bind(this));
    }

    Calculator.prototype = {
        handleClick: function(ev) {
            var oEvent = ev || event;
            var target = oEvent.target;
            switch(target.className) {
                case 'button-num':
                    this.addNum(target.innerHTML);
                    break;
                case 'button-opera':
                    this.operateMap[target.innerHTML]();
                    break;
                default:

            }
        },

        // 数字输入
        addNum: function(num) {
            var str = String(this.screen.value);
            str = (str !== '0') ? ((this.input === 0) ? str : '') : '';
            str = str + String(num);
            this.screen.value = str;
            this.input = 0;
            this.quit = 0;
        },

        // 双零输入
        dzero: function() {
            var str = String(this.screen.value);
            str = (str !== '0') ? ((this.input === 0) ? str + '00' : '0') : '0';
            this.screen.value = str;
            this.input = 0;
        },

        // 小数点输入
        dot: function() {
            var str = String(this.screen.value);
            str = (str !== '0') ? ((this.input === 0) ? str : '0') : '0';
            for (i = 0; i <= str.length; i++) {
                if (str.substr(i, 1) === '.') {
                    return false;
                }
            }
            str = str + '.';
            this.screen.value = str;
            this.input = 0;
        },

        // 退格
        backspace: function() {
            var str = String(this.screen.value);
            str = (str !== '0') ? str : '';
            str = str.substr(0, str.length - 1);
            str = (str !== '') ? str : '0';
            this.screen.value = str;
        },

        // 清空
        clearScreen: function() {
            this.num = 0;
            this.result = 0;
            this.screenNum = '0';
            this.screen.value = '0';
        },

        // 加法
        plus: function() {
            this.calculate();
            this.input = 1;
            this.operate = 1;
        },

        // 减法
        minus: function() {
            this.calculate();
            this.input = 1;
            this.operate = 2;
        },

        // 乘法
        times: function() {
            this.calculate();
            this.input = 1;
            this.operate = 3;
        },

        // 除法
        divide: function() {
            this.calculate();
            this.input = 1;
            this.operate = 4;
        },

        // 取余
        mod: function() {
            this.calculate();
            this.input = 1;
            this.operate = 5;
        },

        // 相等
        equal: function() {
            this.calculate();
            this.input = 1;
            this.num = 0;
            this.result = 0;
            this.screenNum = '0';
        },

        // 计算执行
        calculate: function() {
            this.screenNum = Number(this.screen.value);
            if(this.num !== 0 && this.quit !== 1) {
                switch(this.operate) {
                    case 1:
                        this.result = this.num + this.screenNum;
                        break;
                    case 2:
                        this.result = this.num - this.screenNum;
                        break;
                    case 3:
                        this.result = this.num * this.screenNum;
                        break;
                    case 4:
                        if(this.screenNum !== 0) {
                            this.result = this.num / this.screenNum;
                        } else {
                            document.getElementById('note').innerHTML = '被除数不能为零！';
                            setTimeout(this.clearNote, 4000)
                        }
                        break;
                    case 5:
                        this.result = this.num % this.screenNum;
                        break;
                }
                this.quit = 1;
            }
            else{
                this.result = this.screenNum;
            }
            this.screenNum = String(this.result);
            this.screen.value = this.screenNum;
            this.num = this.result;
        },

        // 清空警告
        clearNote: function() {
            document.getElementById('note').innerHTML = '';
        }
    }

    window.Calculator = Calculator;
})(window, document);
