<template>
  <div>
      <router-link to="/tape/1">Start At Tape 1</router-link><br>
      Select Specific Tape: <input v-model="tapeInput"><router-link :to="'tape/'+tapeInput"><button>Insert Tape {{tapeInput}}</button></router-link>
  </div>
</template>

<script>
export default {
  data(){
    return{
      tapeInput: null
    }
  },
}
</script>

<style lang="sass">
</style>
