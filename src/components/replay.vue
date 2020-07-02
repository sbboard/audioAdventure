<template>
  <div>
      <template v-if="trackInfo != null">
      {{trackInfo.name}}<br>
      </template>
      <audio autoplay ref="audio" @timeupdate="timeCheck()">
      <source type="audio/mpeg">
      </audio>
      <!-- {{pathArray}}<br>
      {{localPlaylist[pathArray[currentTrackIndex]]}} -->
      <div id="controls">
      <img @click="togglePlay()" v-if="play" src="../assets/pause.png">
      <img @click="togglePlay()" v-if="!play" src="../assets/play.png">
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
    }
  },
  methods:{
      timeCheck(){
        if(this.$refs.audio.currentTime >= this.trackInfo.endTime){
            if(this.currentTrackIndex < this.pathArray.length - 1){
                this.currentTrackIndex++
                this.trackInfo = this.localPlaylist[this.pathArray[this.currentTrackIndex]]
                this.$refs.audio.src = "/audio/"+ this.trackInfo.source;
            }
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
        this.trackInfo = this.localPlaylist[this.pathArray[this.currentTrackIndex]]
        this.$refs.audio.src = "/audio/"+ this.trackInfo.source;
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
        this.trackInfo = this.localPlaylist[this.pathArray[this.currentTrackIndex]]
        this.$refs.audio.src = "/audio/"+ this.trackInfo.source;
        this.$refs.audio.play()
    },
  },
}
</script>

<style lang="sass">
#controls
    img
        display: black
        width: 50px
        cursor: pointer
</style>
