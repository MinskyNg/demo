(function(window, document){
    function Calendar(target) {
        this.target = target;
        this.weeks = {'0': '日', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六'};
        this.date = {};
        var now = new Date();
        this.date.year = now.getFullYear();
        this.date.month = now.getUTCMonth() + 1;
        this.date.day = now.getDate();
        this.date.week = this.weeks[now.getDay()];
        this.date.Alldays = this.countDays(this.date.year, this.date.month);

        this.createInput();
        this.createCalendar();
    }

    Calendar.prototype = {
        // 创建选择器input
        createInput: function() {
            var inputbox = document.createElement('div');
            inputbox.className = 'input-box';
            this.input = document.createElement('input');
            this.input.className = 'datePicker';
            var now = new Date();
            this.input.defaultValue = this.date.year + '年' + this.date.month + '月' + this.date.day + '日';
            this.input.onfocus = function() {
                this.blur();
            };
            var i = document.createElement('i');
            i.className = 'fa fa-calendar';
            i.setAttribute('aria-hidden', true);
            inputbox.appendChild(this.input);
            inputbox.appendChild(i);
            this.target.appendChild(inputbox);
        },

        // 创建日历
        createCalendar: function() {
            var calendar = document.createElement('div');
            calendar.className = 'calendar';
            this.left = document.createElement('div');
            this.left.className = 'left';
            this.right = document.createElement('div');
            this.right.className = 'right';
            calendar.appendChild(this.left);
            calendar.appendChild(this.right);
            this.target.appendChild(calendar);
            this.createLeft();
            this.createRight();
        },

        // 日历左边区域
        createLeft: function() {
            this.left.innerHTML = '';
            var showYear = document.createElement('a');
            showYear.innerHTML = this.date.year;
            showYear.className = 'show-year';
            this.left.appendChild(showYear);

            var showWeek = document.createElement('a');
            showWeek.innerHTML = '星期' + this.date.week;
            showWeek.className = 'show-week';
            this.left.appendChild(showWeek);

            var showDay = document.createElement('a');
            showDay.innerHTML = this.date.month + '月' + this.date.day + '日';
            showDay.className = 'show-day';
            this.left.appendChild(showDay);
        },

        // 日历右边区域
        createRight: function(animate) {
            this.right.innerHTML = '';
            var controle = document.createElement('div');
            var prevMonth = document.createElement('i');
            var nextMonth = document.createElement('i');
            var now = document.createElement('a');
            controle.className = 'controle';
            prevMonth.className = 'fa fa-chevron-left go-left';
            prevMonth.setAttribute('aria-hidden', true);
            nextMonth.className = 'fa fa-chevron-right go-right';
            nextMonth.setAttribute('aria-hidden', true);
            now.className = 'controle-show';
            now.innerHTML = this.date.year + '/' +  this.date.month;
            controle.appendChild(prevMonth);
            controle.appendChild(now);
            controle.appendChild(nextMonth);
            this.right.appendChild(controle);

            this.createTable(animate);

            var buttonbox = document.createElement('div');
            buttonbox.className = 'button-box';
            var today = document.createElement('a');
            today.innerHTML = '今天';
            today.className = 'go-today';
            var ok = document.createElement('a');
            ok.innerHTML = '确定';
            ok.className = 'go-time';
            buttonbox.appendChild(today);
            buttonbox.appendChild(ok);
            this.right.appendChild(buttonbox);

            today.addEventListener('click', this.goToday.bind(this));
            ok.addEventListener('click', this.pick.bind(this));
            prevMonth.addEventListener('click', this.prevMonth.bind(this));
            nextMonth.addEventListener('click', this.nextMonth.bind(this));
        },

        // 跳至当日
        goToday: function () {
            var now = new Date();
            this.date.year = now.getFullYear();
            this.date.month = now.getUTCMonth() + 1;
            this.date.day = now.getDate();
            this.date.week = this.weeks[now.getDay()];
            this.date.Alldays = this.countDays(this.date.year, this.date.month);
            this.createRight('animate');
            this.createLeft();
        },

        // 选择日期
        pick: function () {
            this.input.value = this.date.year + '年' + this.date.month + '月' + this.date.day + '日';
            this.createLeft();
        },

        // 上个月
        prevMonth: function () {
            if (this.date.month > 1) {
                this.date.month = this.date.month - 1;
                this.date.Alldays = this.countDays(this.date.year, this.date.month);
            } else {
                this.date.year = this.date.year - 1;
                this.date.month = 12;
            }
            this.date.day = 1;
            this.date.Alldays = this.countDays(this.date.year, this.date.month);
            var news = new Date(this.date.year + '/' + this.date.month + '/' + this.date.day);
            this.date.week = this.weeks[news.getDay()];
            this.createRight('left-animate');
            this.createLeft();
        },

        // 下个月
        nextMonth: function () {
            if (this.date.month < 12) {
                this.date.month = ~~(this.date.month) + 1;
            } else {
                this.date.year = ~~(this.date.year) + 1;
                this.date.month = 1;
            }
            this.date.day = 1;
            var news = new Date(this.date.year + '/' + this.date.month + '/' + this.date.day);
            this.date.week = this.weeks[news.getDay()];
            this.date.Alldays = this.countDays(this.date.year, this.date.month);
            this.createRight('right-animate');
            this.createLeft();
        },

        // 创建日历选择区
        createTable: function(animate) {
            var table = document.createElement('table');
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            // 创建表头
            for (var i = 0; i < 7; i++) {
                var th = document.createElement('th');
                th.innerHTML = this.weeks[i];
                tr.appendChild(th);
            }
            thead.appendChild(tr);
            table.appendChild(thead);
            table.className = animate ? animate : '';

            var tbody = document.createElement('tbody');
            var firstDay = new Date(this.date.year + "/" +  this.date.month + "/" + 1).getDay();
            var len = this.date.Alldays + firstDay;
            // 创建表格
            for (i = 0; i < len; i++) {
                var value = i - firstDay + 1;
                if (i === 0 || i % 7 === 0) {
                    var tr = document.createElement('tr');
                    tbody.appendChild(tr);
                }
                var td = document.createElement('td');
                if (i >= firstDay) {
                    var a = document.createElement('a');
                    a.innerHTML = value;
                    if (value === this.date.day) {
                        a.className = 'choose';
                    }
                    td.appendChild(a);
                }
                tr.appendChild(td);
            }
            table.appendChild(tbody);
            var self = this;
            table.addEventListener('click', function (ev) {
                var t = ev.target || ev.srcElement;
                if (t.tagName === 'A' || t.tagName === 'a') {
                    self.date.day = parseInt(t.innerHTML);
                    var news = new Date(self.date.year + '/' + self.date.month + '/' + self.date.day);
                    self.date.week = self.weeks[news.getDay()];
                    self.createRight();
                    self.createLeft();
                }
            });
            this.right.appendChild(table);
        },

        // 当前月份天数
        countDays: function(year, month) {
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    return 31;
                case 2:
                    if ((year % 4 ===  0 && year % 100 !== 0) || year % 400 === 0) {
                        return 29;
                    } else {
                        return 28;
                    }
            }
            return 30;
        }

    };

    window.Calendar = Calendar;
})(window, document);
