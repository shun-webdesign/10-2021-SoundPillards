<template>
    <div class="loadingScreen" ref="loadingScreen">
      <p class="loadingScreenText">Loading...{{progress}}%</p>
    </div>
</template>

<script>
import LoadingController from '../classes/LoadingController';
export default {
    name: "LoadingScreen",
    data(){
      return{
        progress:0,
      };
    },
    mounted() {
      LoadingController.onProgress = this.onProgress;
      LoadingController.onLoad = this.onLoad;
    },
    methods:{
      onProgress(url,loaded,total) {
      this.progress = (loaded / total) *100;
      },
      onLoad(){
        this.$refs.loadingScreen.classList.add('finished');
      },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .loadingScreen{
    width: 100vw;
    height: 100vh;
    background: #333333;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    color:#fff;
    font-size:2em;
    transition: all 0.6s;

    &.finished{
      opacity: 0;
      pointer-events: none;
    }
    .loadingScreenText{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
