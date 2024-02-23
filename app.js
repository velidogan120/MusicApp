const container = document.querySelector(".container");
const musicImage = document.querySelector("#music_image");
const audio = document.querySelector("#music_audio");
const musicTitle = document.querySelector("#music_title");
const musicSinger = document.querySelector("#music_singer");
const progressBar = document.querySelector("#progress_bar");
const currentTime = document.querySelector("#current_time");
const duration = document.querySelector("#duration");
const prev = document.querySelector("#prev");
const play = document.querySelector("#play");
const next = document.querySelector("#next");
const music_list = document.querySelector("#music_list");
const volumeIcon = document.querySelector("#volume_icon");
const volumeBar = document.querySelector("#volume_bar");

const player = new MusicPlayer(musiclist);

window.addEventListener("load",function(){
    displayMusic(player.getMusic());
    musicList(player.musiclist);
    musicPlayingNow();
});

const displayMusic = (music) => {
    musicTitle.innerText = music.getName();
    musicSinger.innerText = music.singer;
    musicImage.src = "img/" + music.image;
    audio.src = "mp3/" + music.file; 
}

play.addEventListener("click",function(){
    isMusicPlaying = container.classList.contains("playing");
    isMusicPlaying ? pauseMusic():playMusic(); 
});

const pauseMusic = () => {
    container.classList.remove("playing");
    play.querySelector("i").className = "fa-solid fa-play fa-xl";
    audio.pause();
}

const playMusic = () => {
    container.classList.add("playing");
    play.querySelector("i").className = "fa-solid fa-pause fa-xl";
    audio.play();
}

prev.addEventListener("click",function(){
    prevMusic();
});

next.addEventListener("click",function(){
    nextMusic();
});

const prevMusic = () => {
    player.prev();
    displayMusic(player.getMusic());
    playMusic();
    musicPlayingNow();
}

const nextMusic = () => {
    player.next();
    displayMusic(player.getMusic());
    playMusic();
    musicPlayingNow();
}

const calculateTime = (time) => {
    let dakika = Math.floor(time / 60);
    let saniye = Math.floor(time % 60);
    let güncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye}`;
    return `${dakika}:${güncellenenSaniye}`;
}

audio.addEventListener("loadedmetadata",function(){
    duration.innerText = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate",function(){
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.innerText = calculateTime(audio.currentTime);
})

progressBar.addEventListener("input",function(e){
    currentTime.innerText = calculateTime(e.target.value);
    audio.currentTime = e.target.value;
});

let sesDurumu = "sesli";
volumeIcon.addEventListener("click",function(){
    if(sesDurumu == "sesli"){
        audio.muted = true;
        volumeIcon.querySelector("i").className = `fa-solid fa-volume-xmark fa-sm`;
        sesDurumu = "sessiz";
        volumeBar.value = 0;
    }else{
        audio.muted = false;
        volumeIcon.querySelector("i").className = `fa-solid fa-volume-high fa-sm`;
        sesDurumu = "sesli";
        volumeBar.value = sesSeviyesi;
    }
});

let sesSeviyesi;
volumeBar.addEventListener("input",function(e){
    if(volumeBar.value == 0){
        volumeIcon.querySelector("i").className = `fa-solid fa-volume-xmark fa-sm`;
        audio.volume = e.target.value / 100;
    }else{
        volumeIcon.querySelector("i").className = `fa-solid fa-volume-high fa-sm`;
        audio.volume = e.target.value / 100;
        sesSeviyesi = e.target.value;
    }
});

const musicList = (musiclist) => {
    for(let i in musiclist){
        let li = `
            <li li-index="${i}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between">
                <div class="fw-medium">${musiclist[i].getName()}</div>
                <div id="music-${i}" class="badge bg-danger"></div>
                <audio class="music-${i}" src="mp3/${musiclist[i].file}"></audio>
            </li>
        `;
        music_list.querySelector("ul").insertAdjacentHTML("beforeend",li);

        let liAudioDuration = document.querySelector(`#music-${i}`);
        let liAudioTag = document.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata",function(){
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        });
    }
}

const selectedMusic = (music) => {
    let li = music.getAttribute("li-index");
    for(let i in player.musiclist){
        if(li == i){
            player.index = li;
            displayMusic(player.getMusic());
            playMusic();
            musicPlayingNow();
        }
    }
}

const musicPlayingNow = () => {
    for(let li of music_list.querySelector("ul").children){
        li.classList.remove("active");

        if(li.getAttribute("li-index") == player.index){
            li.classList.add("active");
        }
    }
}