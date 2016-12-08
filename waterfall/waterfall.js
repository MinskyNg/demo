(function($) {
    function Waterfall(opts) {
        this.timer;
        this.page = opts.page || 1;
        this.num = opts.num || 10;

        this.checkShow();
        this.render();

        $(window).on('resize', this.render.bind(this));

        $(window).on('scroll', function() {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(this.checkShow.bind(this), 100);
        }.bind(this));
    }

    Waterfall.prototype = {
        render: function(){
            var wrapperWidth = $('.wrapper').width(),
                itemWidth = $('.item').outerWidth(true),
                colHeight = new Array(Math.floor(wrapperWidth / itemWidth));
            colHeight.fill(0);

            $('.item').each(function() {
                var $curItem = $(this);
                var index = 0;
                var minHeight = colHeight[0];

                for (var i = 0; i < colHeight.length; i++) {
                    if (colHeight[i] < minHeight) {
                        minHeight = colHeight[i];
                        index = i;
                    }
                }

                $curItem.css({
                    top: minHeight,
                    left: index * itemWidth
                });
                colHeight[index] += $curItem.outerHeight(true);
            });

            $('.container').css({
                height: Math.max.apply(null, colHeight)
            });
        },

        checkShow: function(){
            if ($('.load').offset().top < $(window).scrollTop() + $(window).height() + 400) {
                $.ajax({
                    url: 'http://platform.sina.com.cn/slide/album_tech',
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback',
                    data: {
                        app_key: '1271687855',
                        num: this.num,
                        page: this.page
                    }
                }).done(function(result) {
                    if (result && result.status && result.status.code === '0') {
                        this.renderData(result.data);
                        this.page++;
                    } else {
                        console.log('Load Error!');
                    }
                }.bind(this));
            }
        },

        renderData: function(items) {
            for (var i = 0; i < items.length; i++) {
                $('.container').append($(
                    '<li class="item"><a href="'+ items[i].url +'" class="link"><img src="' + items[i].img_url + '" alt=""></a><h4 class="header">'+ items[i].short_name +'</h4><p class="desp">'+items[i].short_intro+'</p></li>'
                )).animate(100);
            }
            $('.item').find('img').on('load', this.render.bind(this));
        },
    };

    window.Waterfall = Waterfall;
})(jQuery);
