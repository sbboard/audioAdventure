<template>
  <div id="root">
    <template v-if="loaded">
    <h1 id="topTitle"><a href="/">1000 Tapes of Fate</a></h1>
    <div id="wrap">
      <div id="casetteWrap">
      <img alt="casette player" src="../assets/player.png">
      </div>

      <audio autoplay ref="overlay" @ended='overlayLoop' v-if="overlayOn">
      <source :src="'/audio/'+this.albumLocation+'/'+this.audioInfo.key.overlaySound" type="audio/mpeg">
      </audio>

      <template v-if="audioInfo.name != 'Blank Tape'">
        <audio autoplay @ended='ended' ref="audio" @timeupdate="timeCheck()">
        <source :src="'/audio/'+albumLocation+'/'+audioInfo.source" type="audio/mpeg">
        </audio>
      </template>
      
      <template v-else>
        <audio autoplay @ended='ended' ref="audio" @timeupdate="timeCheck()">
        <source src='/audio/sys/404tape.mp3' type="audio/mpeg">
        </audio>
      </template>

      <audio ref="sfx">
      <source src="/audio/sys/press.mp3" type="audio/mpeg">
      </audio>

      <div id="controls">
      <i @click="togglePlay()" v-if="play" class="fas fa-4x fa-pause"></i>
      <i @click="togglePlay()" v-if="!play" class="fas fa-4x fa-play"></i>
      </div>
    </div>

    <div id="endMenu" :class="{hiddenSpot: !itsOver}">
      <a :href="'/replay/'+album+'/'+this.$route.params.path">Relisten to Adventure</a>
    </div>

    <footer><i class="fas fa-copyright"></i> <a href="http://www.theinvisiblesundial.com/">invisible sundial</a> x <a href="https://gang-fight.com/">gang fight</a></footer>
    </template>
    <template v-else>
      Loading...
      </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data(){
    return{
        loaded: false,
        localPlaylist: null,
        audioInfo: {
          "source": "",
          "name": "loading",
          "endTime": "",
          "f": "",
          "j": ""
        },
        play: true,
        album: this.$route.params.album,
        albumLocation: null,
        endhit: false,
        currentIndex: 0,
        altTriggered: false,
        trackList: null,
        overlayEnd: 0,
        overlayOn: false,
        itsOver: false,
    }
  },
  methods: {
    overlayLoop(){
      this.$refs.overlay.currentTime = 0
      this.$refs.overlay.play()
    },
    togglePlay(){
        this.$refs.sfx.src = "/audio/sys/press.mp3"
        this.$refs.sfx.play()
      if(this.play){
        this.$refs.audio.pause()
        if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null){this.$refs.overlay.pause()}
      }
      else{
        this.$refs.audio.play()
        if(this.audioInfo.key != null && this.audioInfo.key.overlaySound != null){this.$refs.overlay.play()}
      }
      this.play = !this.play
    },
      pushDoor(index){
        this.audioInfo = index

        if(this.localPlaylist[this.currentIndex].includes("overlay")){
          this.overlayEnd = this.localPlaylist[this.currentIndex].split("overlay")[1]
          this.overlayOn = true
        }
        else{
          this.overlayOn = false
        }

        if(this.localPlaylist[this.currentIndex].includes("alt")){
          this.audioInfo.source = this.audioInfo.altTrack.source
          this.altTriggered = true
        }
        else{
          this.$refs.audio.src = "/audio/"+this.albumLocation+'/'+this.audioInfo.source
          this.altTriggered = false
        }
      },
    ended(){
        this.endhit = true
        if(this.altTriggered == false){
          this.$refs.audio.currentTime = this.audioInfo.endTime
        }
        else{
          this.$refs.audio.currentTime = this.audioInfo.altTrack.endTime
        }
        this.$refs.audio.play()
        this.play = true
    },
    getAlbumInfo(){
      axios.get(`/audio/${this.$store.getters.getPlaylist.albums[this.album].folder}/info.json`)
      .then((response) => {
          this.loaded = true
          this.trackList = response.data.tracks
          this.albumLocation = this.$store.getters.getPlaylist.albums[this.album].folder
          this.audioInfo = this.trackList[this.localPlaylist[0]]
      })
    },
    timeCheck(){
      if(this.$refs.audio.currentTime > this.overlayEnd){
        this.overlayOn = false
      }
      //random jump check
      if(this.$refs.audio.currentTime > 3 && this.audioInfo.randomJump != null && this.audioInfo.randomJump > this.$refs.audio.currentTime){
        let random = Math.floor(Math.random() * 20);
        if(random == 0){
          this.$refs.audio.currentTime = this.audioInfo.randomJump
        }
      }
      if(this.currentIndex + 1 < this.localPlaylist.length){
      //activates optionTime / pushes door
      if(this.altTriggered == false){
          if(this.$refs.audio.currentTime >= this.audioInfo.endTime || this.$refs.audio.currentTime == this.$refs.audio.duration){
              this.currentIndex++
              this.pushDoor(this.trackList[this.localPlaylist[this.currentIndex][0]])
          }
        }
        else{
            if(this.$refs.audio.currentTime >= this.audioInfo.altTrack.endTime || this.$refs.audio.currentTime == this.$refs.audio.duration){
              this.currentIndex++
              this.pushDoor(this.trackList[this.localPlaylist[this.currentIndex][0]])
          }
        }
      }
      else{
        if(this.$refs.audio.currentTime > this.audioInfo.endTime){
          this.itsOver = true
        }
      }
      },
  },
  computed: {
    playlist() {
      return this.$store.getters.getPlaylist
    },
  },
  beforeMount(){
    if(this.playlist != null){this.getAlbumInfo()}
  },
  mounted(){
    this.localPlaylist = this.$route.params.path.split("+")
    let that = this
    window.addEventListener('keyup', function(ev) {
      let x = ev.key.toLowerCase()
      switch (x) {
        case ' ':
          that.togglePlay()
          break;
      }
    })
  },
  watch:{
    playlist(){
      if(this.album > this.$store.getters.getPlaylist.albums.length - 1){
        this.$router.push({ path: `/`})
      }
      else{
        this.getAlbumInfo()
      }
    },
    audioInfo(){
      if(this.$refs.audio != undefined){
        this.$refs.audio.pause();
        this.$refs.audio.src = "/audio/"+this.albumLocation+'/'+this.audioInfo.source;
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play()
        this.play = true
      }
    }
  },
}
</script>

<style lang="sass">
</style>
