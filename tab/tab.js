(function(window, document){
    function Tab(opts) {
        this.button = opts.btnSel || 'button';
        this.activeClass = opts.activeClass || 'active';
        this.tab = document.getElementById(opts.id || 'tab');
        this.tabBtn = this.tab.getElementsByTagName(this.button);
        this.tabCon = this.tab.getElementsByTagName(opts.conSel || 'div');
        this.length = this.tabBtn.length;
        // 切换选项卡时调用的函数
        if (opts.afterShow instanceof Function) {
            this.afterShow = opts.afterShow;
        }
        this.init();
    }

    Tab.prototype = {
        // 初始化
        init: function() {
            // 默认显示第一个标签
            this.tabBtn[0].className += this.activeClass;
            this.tabCon[0].style.display = 'block';
            // 为按钮添加索引
            for(var i = 0; i < this.length; i++) {
               this.tabBtn[i].index = i;
           }
           this._bindEvent();
        },

        // 为选项卡绑定点击事件
        _bindEvent: function() {
            var self = this;
            this.tab.addEventListener('click', function(ev) {
                var oEvent = ev || event;
                var target = oEvent.target || oEvent.srcElement;
                self.showTab(target);
            })
        },

        // 切换选项卡
        showTab: function(target) {
            if (target.nodeName.toLowerCase() === this.button && target.className.toLowerCase().indexOf(this.activeClass) === -1) {
                for ( i = 0; i < this.length; i++) {
                    if (this.tabBtn[i].className.indexOf(this.activeClass) !== -1) {
                        this.tabBtn[i].className = this.tabBtn[i].className.replace(this.activeClass, '');
                        this.tabCon[i].style.display = 'none';
                    }
                }
                target.className += this.activeClass;
                this.tabCon[target.index].style.display = 'block';
                if (this.afterShow) {
                    this.afterShow(target.index);
                }
            }
        }

        // // 销毁组件
        // destroy: function() {
        //     // 解除事件绑定
        //     // 删除DOM节点
        // }
    };

    window.Tab = Tab;
})(window, document);
