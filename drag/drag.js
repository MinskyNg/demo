(function($) {
    function Drag($tar, opts) {
        this.$tar = $tar;
        this.dragItem = $.makeArray($tar);
        this.dragLen = this.dragItem.length;
        this.activeClass = opts.activeClass;
        this.dragWidth = opts.dragWidth;
        this.dragZindex = opts.dragZindex;
        this.aniTime = opts.aniTime;
        this.dragPos = [];
        this.init();
    }

    Drag.prototype = {
        init: function() {
            var i = 0;
            // 存储li初始位置的坐标
            for (i = 0; i < this.dragLen; i++) {
                this.dragPos[i] = {
                    left: this.dragItem[i].offsetLeft,
                    top: this.dragItem[i].offsetTop
                };
            }
            // 将li的布局转换为绝对定位
            for (i = 0; i < this.dragLen; i++) {
                this.dragItem[i].style.position = 'absolute';
                this.dragItem[i].style.left = this.dragPos[i].left+'px';
                this.dragItem[i].style.top = this.dragPos[i].top+'px';
                this.dragItem[i].style.margin = 0;
                this.dragItem[i].index = i;
            }
            // 绑定拖拽事件
            for (i = 0; i < this.dragLen; i++) {
                this._bindEvent(this.dragItem[i]);
            }
        },

        // 绑定鼠标拖拽事件
        _bindEvent: function(item) {
            var self = this;
            item.onmousedown = function(ev) {
                var oEvent = ev||event;
                // 使拖拽物体显示在最上方
                item.style.zIndex = self.dragZindex++;
                // 物体相对距离
                var disX = oEvent.clientX - item.offsetLeft;
                var disY = oEvent.clientY - item.offsetTop;
                // 鼠标移动时
                document.onmousemove = function(ev) {
                    var oEvent = ev||event;
                    // 设置新位置
                    item.style.left = oEvent.clientX - disX + 'px';
                    item.style.top = oEvent.clientY - disY + 'px';

                    for (i = 0; i < self.dragLen; i++) {
                        self.dragItem[i].className = '';
                    }
                    // 寻找距离最近的碰撞物体
                    var nearestItem = self.findNearest(item);
                    if (nearestItem) {
                        nearestItem.className = self.activeClass;
                    }
                };
                // 鼠标松开时
                document.onmouseup = function() {
                    // 解除事件绑定
                    document.onmousemove = null;
                    document.onmouseup = null;
                    var nearestItem = self.findNearest(item);
                    // 碰到物体时
                    if (nearestItem) {
                        nearestItem.className = '';
                        nearestItem.style.zIndex = self.dragZindex++;
                        item.style.zIndex = self.dragZindex++;
                        // 被碰物体移动到拖拽物体位置上
                        self.startMove(nearestItem, self.dragPos[item.index]);
                        // 拖拽物体移动到被碰物体位置上
                        self.startMove(item, self.dragPos[nearestItem.index]);
                        // 交换索引值
                        var tmp = 0;
                        tmp = item.index;
                        item.index = nearestItem.index;
                        nearestItem.index = tmp;
                        // 事件广播
                        $(document).trigger('exchanged', [item, nearestItem]);
                    } else {
                        // 没有碰撞时恢复到原来的位置
                        self.startMove(item, self.dragPos[item.index]);
                    }
                };
                // 终止事件
                oEvent.preventDefault();
            };
        },

        // 寻找最近碰到的物体
        findNearest: function(item) {
            // 预定义最大值 比较中小于的就赋值给它 直到求得最小值
            var minDis = 9999999;
            var minDisIndex = -1;

            for (i = 0; i < this.dragLen; i++) {
                if (item === this.dragItem[i]) continue;
                // 碰撞检测
                if (this.collideTest(item, this.dragItem[i])) {
                    // 求出距离
                    var dis = this.getDis(item, this.dragItem[i]);
                    // 把最小值赋给minDis，并记录位置
                    if (minDis>dis) {
                        minDis = dis;
                        minDisIndex=i;
                    }
                }
            }
            // 没有碰撞
            if (minDisIndex === -1) {
                return null;
            } else {
                // 返回最近的物体
                return this.dragItem[minDisIndex];
            }
        },

        // 碰撞检测
        collideTest: function(item1, item2) {
            // 取上下左右四个边线位置
            var l1 = item1.offsetLeft;
            var r1 = item1.offsetLeft + this.dragWidth;
            var t1 = item1.offsetTop;
            var b1 = item1.offsetTop + this.dragWidth;

            var l2 = item2.offsetLeft;
            var r2 = item2.offsetLeft + this.dragWidth;
            var t2 = item2.offsetTop;
            var b2 = item2.offsetTop + this.dragWidth;
            // 上下左右的碰撞情况，有一边接触就算碰到
            if (r1<l2 || l1>r2 || b1<t2 || t1>b2) {
                return false;
            } else {
                return true;
            }
        },

        // 计算物体距离
        getDis: function(item1, item2) {
            var x = item1.offsetLeft - item2.offsetLeft;
            var y = item1.offsetTop - item2.offsetTop;
            return Math.sqrt(x*x + y*y);
        },

        // 改变位置
        startMove: function(item, pos) {
            $(item).animate({
                left: '' + pos.left,
                top: '' + pos.top
            }, this.aniTime);
        },

        destroy: function() {
            for (i = 0; i < this.dragLen; i++) {
                this.dragItem[i].onmousedown = null;
            }
        }
    };


    $.fn.drag = function(options) {
        // 参数为对象则新建组件
        if ($.type(options) === 'object' || $.type(options) === 'undefined') {
            var defaults = {
                dragWidth: 200,
                dragZindex: 2,
                activeClass: 'active',
                aniTime: 400
            };
            var drag = new Drag(this, $.extend({}, defaults, options));
            this.data('drag', drag);
        // 参数为其他则调用方法
        } else {
            var drag = this.data('drag');
            var returnVal;
            if (drag[options] && $.isFunction(drag[options])) {
                returnVal = drag[options].call(drag, Array.prototype.slice.call(arguments, 1));
            }
            if (returnVal) return returnVal;
        }
        return this;
    };
})(jQuery);
