<template>
  <div>
      <template v-if="trackInfo != null">
      {{trackInfo.name}}<br>
      </template>
      <audio autoplay ref="audio" @timeupdate="timeCheck()">
      <source type="audio/mpeg">
      </audio>
      <div id="controls">
      <!--<img @click="togglePlay()" v-if="play" src="../assets/pause.png">
      <img @click="togglePlay()" v-if="!play" src="../assets/play.png">-->
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      album: this.$route.params.album,
      currentTrackIndex: 0,
      localPlaylist: null,
      trackInfo: null,
      play: true,
      altPlaying: false
    }
  },
  methods:{
      timeCheck(){
        if(this.altPlaying == false){
          if(this.$refs.audio.currentTime >= this.trackInfo.endTime){
            this.changeTrack()
          }
        }
        else{
          if(this.$refs.audio.currentTime >= this.trackInfo.altEnd){
            this.changeTrack()
          }
        }
      },
      setAlt(){
        if(this.pathArray[this.currentTrackIndex].includes("alt")){
          let trackGuy = this.pathArray[this.currentTrackIndex].split("alt")[0]
          this.trackInfo = this.localPlaylist[trackGuy]
          this.$refs.audio.src = `/audio/${this.album}/${this.trackInfo.altTrack}`;
          this.altPlaying = true
        }
        else{
          this.trackInfo = this.localPlaylist[this.pathArray[this.currentTrackIndex]]
          this.$refs.audio.src = `/audio/${this.album}/${this.trackInfo.source}`;
          this.altPlaying = false
        }
      },
      changeTrack(){
                if(this.currentTrackIndex < this.pathArray.length - 1){
                  this.currentTrackIndex++
                  this.setAlt()
                }
      },
        togglePlay(){
        if(this.play){
            this.$refs.audio.pause()
        }
        else{
            this.$refs.audio.play()
        }
        this.play = !this.play
        }
  },
  mounted(){
    if(this.playlist != null){
        this.localPlaylist = this.playlist.albums[this.album].tracks
        this.setAlt()
        this.$refs.audio.play()
    }

    let that = this
    window.addEventListener('keyup', function(ev) {
        let x = ev.key.toLowerCase()
        if(x==' '){that.togglePlay()}
    });
  },
  computed: {
    pathArray() {
        let path = this.$route.params.path
        return path.split("+")
    },
    playlist() {
      return this.$store.getters.getPlaylist
    }
  },
  watch:{
    playlist(){
        this.localPlaylist = this.playlist.albums[this.album].tracks
        this.trackInfo = this.localPlaylist[this.pathArray[this.currentTrackIndex].split("alt")[0]]
        this.$refs.audio.src = `/audio/${this.album}/${this.trackInfo.source}`;
        this.$refs.audio.play()
    },
  },
}
</script>

<style lang="sass">
</style>
