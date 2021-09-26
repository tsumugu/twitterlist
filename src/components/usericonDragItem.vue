<template>
  <div class="usericonDragItem" @dragstart="dragItem($event)" draggable>
    <div class="usericonDragItem__center">
      <!--<v-icon scale="5" name="folder"/>-->
      <img :src="profileImgUrlReplaced" :alt="screenName" loading="lazy">
      <p><a :href="profilePageUrl" target="_blank">{{screenName}}</a></p>
      <p>{{description}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'usericonDragItem',
  props: {
    index: 0,
    screenName: "",
    internalId: "",
    profileImgUrl: "",
    description: ""
  },
  data () {
    return {
      profileImgUrlReplaced: "",
      profilePageUrl: ""
    }
  },
  methods:{
    dragItem(event){
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('index-internalId', this.index+"-&-"+this.internalId)
    }
  },
  mounted() {
    this.profileImgUrlReplaced = this.profileImgUrl.replace("_normal", "_400x400")
    this.profilePageUrl = "https://twitter.com/intent/user?user_id="+this.internalId
  }
}
</script>
<style scoped>
img {
  width: 50px;
}
.usericonDragItem {
  margin: 0;
  padding: 5px;
  display: inline-block;
  width: 150px;
  height: 150px;
  background: white;
}
.usericonDragItem__center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.usericonDragItem__center > p {
  margin: 0;
  width: 100%;
  overflow-wrap: break-word;
  text-align: center;
}
</style>