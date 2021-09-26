<template>
  <div class="userlistItem" v-bind:class="{ active: isActive }" @drop="dropItem($event)" @dragover="dragOver" @dragover.prevent @dragenter.prevent>
    <div class="userlistItem__center">
      <v-icon :color="color" scale="5" name="folder"/>
      <p>{{listName}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'userlistItem',
  props: {
    index: 0,
    listName: "",
    listId: ""
  },
  data () {
    return {
      timeoutId: null,
      isActive: false,
      color: null
    }
  },
  methods:{
    dropItem(event){
      let index_internalId = event.dataTransfer.getData('index-internalId')
      let splited_index_internalId = index_internalId.split("-&-")
      let index = splited_index_internalId[0]
      let internalId = splited_index_internalId[1]
      this.$emit("on-dragged", {"listId": this.listId, "index": index, "internalId": internalId})
    },
    dragOver() {
      if (this.timeoutId != null) {
        clearTimeout(this.timeoutId)
      }
      this.isActive = true
      this.color = "#ba1000"
      this.timeoutId = setTimeout(()=>{
        this.isActive = false
        this.color = null
	    }, 100)
    }
  }
}
</script>
<style scoped>
.userlistItem {
  margin: 0;
  padding: 5px;
  display: inline-block;
  width: 150px;
  height: 150px;
  background-color: white;
}
.userlistItem__center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.userlistItem__center > p {
  margin: 0;
  width: 100%;
  overflow-wrap: break-word;
  text-align: center;
}
.active {
  transform: scale(1.2, 1.2);
}
</style>