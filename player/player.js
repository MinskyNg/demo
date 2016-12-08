window.onload = function() {
    function Player() {
        this.audio = document.getElementById('audio'), // 音乐
        this.sourceList = audio.getElementsByTagName('source'), // 音乐列表
        this.play = document.getElementById('play'), // 播放按钮
        this.prev = document.getElementById('prev'), // 上一曲
        this.next = document.getElementById('next'), // 下一曲
        this.mute = document.getElementById('mute'), // 静音
        this.voiceBar = document.getElementById('voice-bar'), // 音量调节
        this.musicBar = document.getElementById('music-bar'), // 播放进度控制
        this.playedBar = document.getElementById('played-bar'), // 已播放进度条
        this.voicedBar = document.getElementById('voiced-bar'), // 已播放进度条
        this.musicTitle = document.getElementById('music-title'), // 音乐标题
        this.loadBar = document.getElementById('load-bar'), // 加载进度条
        this.currentTime = document.getElementById('current-time'), // 当前音乐时间
        this.totalTime = document.getElementById('total-time'), // 当前音乐时间
        this.musicImg = document.getElementById('music-img'), // 音乐封面
        this.loop = document.getElementById('loop'); // 循环按钮
        this.currentSrcIndex = 0,
        this.keyword = document.getElementById('music-keyword'), // 搜索歌名
        this.searchButton = document.getElementById('search-button'), // 搜索按钮
        this.result = document.getElementById('music-result'), // 结果区
        this.toPlay = document.getElementById('music-play'); // 立即播放按钮

        this.init();
    };

    Player.prototype = {
        init: function() {
            // 是否循环播放
            this.audio.loop = false;
            // 是否自动播放
            this.audio.autoplay = false;
            // 初始化音量
            this.audio.volume = 0.5;
            this.voicedBar.style.width = (this.audio.volume / 1) * this.voiceBar.clientWidth + 'px';
            // 是否自动缓冲加载
            this.audio.autobuffer = false;

            // 显示第一首歌曲时长
            var minute = parseInt(this.audio.duration / 60);
            var second = parseInt(this.audio.duration % 60);
            if (second < 10) {
                second = '0'+ second;
            }
            this.totalTime.innerHTML = minute + ':' + second;

            // 播放 暂停
            this.play.onclick = this.handlePlay(this);

            // 音量调节
            this.voiceBar.onclick = this.handleVoice.bind(this);

            // 播放进度控制
            this.musicBar.onclick = this.handleProgress.bind(this);

            // 静音
            this.mute.onclick = this.handleMute.bind(this);

            // 单曲循环
            this.loop.onclick = this.handleLoop(this);

            // 下一曲
            this.next.onclick = this.changeMusic(this, 'next');

            // 上一曲
            this.prev.onclick = this.changeMusic(this, 'prev');

            // 播放进度实时更新
            setInterval(this.updatePlayedBar.bind(this), 1000);

            // 判断文件缓冲进度
            setInterval(this.updateCache.bind(this), 1000);

            // 搜索音乐
            this.searchButton.addEventListener('click', this.handleSearch.bind(this));

            // 播放搜索结果
            this.result.addEventListener('click', this.handleResult.bind(this));
        },

        handlePlay: function(self) {
            return function() {
                if (self.audio.paused) {
                    self.audio.play();
                    this.innerHTML = 'Pause';
                    self.musicImg.style.animation = 'rotate 5s linear infinite';
                } else {
                    self.audio.pause();
                    this.innerHTML = 'Play';
                    self.musicImg.removeAttribute('style');
                }
                self.musicTime();
            }
        },

        handleVoice: function(event) {
            // 音量大小更新
            this.audio.volume = (event.offsetX / this.voiceBar.clientWidth);
            this.voicedBar.style.width = (this.audio.volume / 1) * this.voiceBar.clientWidth + 'px';
        },

        handleProgress: function(event) {
            var musicBarWidth = this.musicBar.clientWidth;
            this.audio.currentTime = (event.offsetX / musicBarWidth) * this.audio.duration;
            this.playedBar.style.width = (this.audio.currentTime / this.audio.duration) * musicBarWidth + 'px';
        },

        handleMute: function() {
            if (!this.audio.muted) {
                this.audio.muted = true;
                this.voicedBar.style.width = 0 +'px';
            } else {
                this.audio.muted = false;
                // 音量大小更新
                this.voicedBar.style.width = (this.audio.volume / 1) * this.voiceBar.clientWidth + 'px';
            }
        },

        handleLoop: function(self) {
            return function() {
                if (self.audio.loop) {
                    self.audio.loop = false;
                    this.innerHTML = '循环';
                } else {
                    self.audio.loop = true;
                    this.innerHTML = '单曲';
                }
            }
        },

        // 切换歌曲
        changeMusic: function(self, direct) {
            return function() {
                if (direct === 'next') {
                    ++self.currentSrcIndex > self.sourceList.length - 1 && (self.currentSrcIndex = 0); // 下一曲
                } else {
                    --self.currentSrcIndex < 0 && (self.currentSrcIndex = self.sourceList.length -1); // 上一曲
                }
                self.currentSrc = self.sourceList[self.currentSrcIndex].getAttribute('src');
                self.currentImg = self.sourceList[self.currentSrcIndex].getAttribute('data-img')
                self.musicImg.setAttribute('src', self.currentImg);
                self.audio.setAttribute('src', self.currentSrc);
                self.audio.play();
                self.play.innerHTML = 'Pause';
                self.musicImg.style.animation = 'rotate 5s linear infinite';
                self.musicTime();
            }
        },

        // 计算音乐时间
        musicTime: function() {
            // 更换播放歌曲
            this.musicTitle.innerHTML = this.sourceList[this.currentSrcIndex].title;
            // 播放时间显示
            this.audio.addEventListener('canplay', function(){
                var duration = this.audio.duration;
                var minute = parseInt(duration / 60);
                var second = parseInt(duration % 60);
                if (second < 10) {
                    this.totalTime.innerHTML = minute + ':0' + second;
                } else {
                    this.totalTime.innerHTML = minute + ':' + second;
                }
            }.bind(this));
        },

        updatePlayedBar: function() {
            this.playedBar.style.width = (this.audio.currentTime / this.audio.duration) * this.musicBar.clientWidth + 'px';
            if (this.audio.currentTime % 60 < 10) {
                this.currentTime.innerHTML = parseInt(this.audio.currentTime / 60) + ':0' + parseInt(this.audio.currentTime % 60);
            } else {
                this.currentTime.innerHTML = parseInt(this.audio.currentTime / 60) + ':' + parseInt(this.audio.currentTime % 60);
            }
            //如果是时间结束，并且是非单曲循环，自动下一曲
            if (this.audio.currentTime === this.audio.duration && !this.audio.loop) {
                this.next.onclick();
            }
        },

        updateCache: function() {
            var buffered,
                percent;
            // 已缓冲部分
            this.audio.readyState === 4 && (buffered = this.audio.buffered.end(0));
            // 已缓冲百分百
            this.audio.readyState === 4 && (percent = Math.round(buffered / this.audio.duration * 100) + '%');
            this.loadBar.style.width = (Math.round(buffered / this.audio.duration * 100) * this.musicBar.clientWidth * 0.01) + 'px';
        },

        handleSearch: function() {
            var value = this.keyword.value;
            if (!value) {
                alert('关键词不能为空');
                return;
            }
            var url = 'http://s.music.163.com/search/get/';
            var data = {
                'type': 1,
                'limit': 1,
                's': value,
                'callback': 'jsonpcallback'
            };
            var queryKey = [];
            for (var key in data) {
                queryKey.push(key + '=' + encodeURIComponent(data[key]));
            }
            var fullpath = url + '?' + queryKey.join('&');
            this.createJsonp(fullpath);
        },

        createJsonp: function(src) {
            var script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        },

        handleResult: function(ev) {
            var t = ev.target || ev.srcElement;
            if (t.tagName === 'A' || t.tagName === 'a') {
                var oMusicSrc = this.result.getAttribute('data-audio');
                var oMusicImg = this.result.getAttribute('data-img');
                var oMusicName = this.result.getAttribute('data-music');
                var oSinger = this.result.getAttribute('data-singer');
                this.musicImg.setAttribute('src',oMusicImg);
                this.musicTitle.innerHTML = oMusicName + ' - ' + oSinger;
                this.audio.setAttribute('src', oMusicSrc);
                this.audio.play();
                this.play.innerHTML = 'Pause';
                this.musicImg.style.animation = 'rotate 5s linear infinite';
            }
        }
    };

    window.Player = Player;

    var player = new Player();
};
