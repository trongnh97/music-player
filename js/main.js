const player = document.querySelector(".player");
const playList = document.querySelector(".playlist");
const cd = document.querySelector(".cd");
const cdWidth = cd.offsetWidth;
const heading = document.querySelector("header h2");
const cdThumb = document.querySelector(".cd-thumb");
const audio = document.querySelector("#audio");
const playBtn = document.querySelector(".btn-toggle-play");
const progress = document.querySelector("#progress");
const nextBtn = document.querySelector(".btn-next");
const prevBtn = document.querySelector(".btn-prev");
const randomBtn = document.querySelector(".btn-random");
const repeatBtn = document.querySelector(".btn-repeat");


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Ái Nộ",
      singer: "Masew",
      path: "./music/song1.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "Nỗi đau xót xa",
      singer: "Minh Vương",
      path: "./music/song2.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "Đúng cũng thành sai",
      singer: "Mỹ Tâm",
      path: "./music/song3.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "ALL KILL",
      singer: "TARA",
      path: "./music/song4.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "La la la",
      singer: "Naughty Boy, Sam Smith",
      path: "./music/song5.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "Ai chung tình được mãi",
      singer: "Út Nhị",
      path: "./music/song6.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "Con đường hạnh phúc",
      singer: "Thùy Chi",
      path: "./music/song7.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "International Love",
      singer: "Pitbull",
      path: "./music/song8.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "Levels",
      singer: "Avicii",
      path: "./music/song9.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "Reality",
      singer: " Lost Frequencies Janieck Devy",
      path: "./music/song10.mp3",
      image: "./img/rabbit.png",
    },
    {
      name: "Unstoppable",
      singer: "Sia",
      path: "./music/song11.mp3",
      image: "./img/rabbit.png",
    },
  ],
  
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `;
    });
    playList.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;

    // xử lý cd quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý phóng to / thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xử lý bật / tắt random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
      console.log('ok random')
    };

    //xử lý repeat 1 song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
      console.log('ok repeat')
    };

    // xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // lắng nghe hành vi click vào palylist
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      document.querySelector(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // lắng nghe / xử lý các sự kiện
    this.handleEvents();

    // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // render playlist
    this.render();

  },
};

app.start();
