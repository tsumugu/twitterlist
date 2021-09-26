<template>
  <div class="home">
    <div id="notlogin" v-show="this.credentialInDB==null">
      <button v-on:click="signin">Twitter Sign in</button>
    </div>
    <div class="home__list-area">
      <userlistItem v-for="(list, index) in lists" :key="list.id" :index="index" :listName="list.name" :listId="list.id_str" @on-dragged="onDragEvent" />
    </div>
    <div class="home__icon-area">
      <usericonDragItem v-for="(user, index) in filteredUsers" :key="user.id_str" :index="index" :screenName="user.name" :internalId="user.id_str" :profileImgUrl="user.profile_image_url_https" :description="user.description" />
    </div>
    <button v-on:click="fetchFollows">フォローをロードする</button>
  </div>
</template>

<script>
import axios from "axios"
// https://firebase.google.com/docs/auth/web/twitter-login?hl=ja
import { getAuth, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, TwitterAuthProvider } from "firebase/auth"
// https://firebase.google.com/docs/database/web/read-and-write?hl=ja
import { getDatabase, ref, child, set, get } from "firebase/database"

import userlistItem from "./userlistItem"
import usericonDragItem from "./usericonDragItem"
export default {
  name: 'Home',
  components: {
    userlistItem,
    usericonDragItem
  },
  data () {
    return {
      db: null,
      auth: null,
      provider: null,
      twiClient: null,
      credentialInDB: null,
      lists: [],
      inlistusers: [],
      users: [],
      filteredUsers: [],
      nextCursor: null
    }
  },
  methods: {
    signin() {
      signInWithRedirect(this.auth, this.provider)
    },
    onDragEvent(info) {
      // リスインするリクエストを投げる
      let url = "https://tsumugu2626.xyz/twitterlist/createlistmembers.php?access_token="+this.credentialInDB.token+"&access_token_secret="+this.credentialInDB.secret+"&list_id="+info.listId+"&user_id="+info.internalId
      axios.get(url)
      .then((response)=>{
        // 消す
        if (response.data.error == undefined) {
          this.filteredUsers.splice(info.index, 1)
        } else {
          // error
          alert(response.data.error)
        }
      })
      .catch((error)=>{
        console.log(error)
      })
    },
    fetchAllTwitterLists() {
      // url
      var url = "https://tsumugu2626.xyz/twitterlist/fetchlistmembers.php?access_token="+this.credentialInDB.token+"&access_token_secret="+this.credentialInDB.secret
      axios.get(url)
      .then((response)=>{
        if (response.data.error == undefined) {
          var inListUsers = []
          response.data.lists.forEach((list, index)=>{
            Array.prototype.push.apply(inListUsers, list.users)
            this.$set(this.lists, index, list.about)
          })
          this.inlistusers = inListUsers.map(e=>e.id_str)
          // this.usersからthis.inlistusersに入っているものは消す
          this.filterFollows()
        } else {
          // error
          alert(response.data.error)
        }
        //
      })
      .catch((error)=>{
        console.log(error)
      })
    },
    fetchFollows() {
      if (this.nextCursor != 0) {
        // url
        var url = "https://tsumugu2626.xyz/twitterlist/fetchfollows.php?access_token="+this.credentialInDB.token+"&access_token_secret="+this.credentialInDB.secret
        if (this.nextCursor!=null) {
          url = url+"&cursor="+this.nextCursor
        }
        axios.get(url)
        .then((response)=>{
          if (response.data.error == undefined) {
            response.data.users.forEach((user, index)=>{
              this.$set(this.users, index, user)
            })
            this.nextCursor = response.data.nextcursor
            // this.usersからthis.inlistusersに入っているものは消す
            this.filterFollows()
          } else {
            // error
            alert(response.data.error)
          }
        })
        .catch((error)=>{
          console.log(error)
        })
      } else {
        alert("next cursorが0です");
      }
    },
    filterFollows() {
      this.filteredUsers = this.users.filter(e=>!this.inlistusers.includes(e.id_str))
    }
  },
  mounted() {
    this.db = getDatabase()
    this.auth = getAuth()
    this.provider = new TwitterAuthProvider()

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        get(child(ref(this.db), `twiauth/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            this.credentialInDB = snapshot.val()
            this.fetchAllTwitterLists()
            this.fetchFollows()
            // DEBUG
            /*
            const res_list = require("../secret/debug-fetchlistmembers.json")
            const res_follow = require("../secret/debug-fetchfollows.json")
            res_list.lists.forEach((list, index)=>{
              this.$set(this.lists, index, list.about)
            })
            this.filteredUsers = res_follow.users
            */
            //
          } else {
            signOut(this.auth)
          }
        }).catch((error) => {
          console.error(error)
        })
      }
    })

    getRedirectResult(this.auth).then((result) => {
      if (result) {
        const credential = TwitterAuthProvider.credentialFromResult(result)
        const user = result.user
        set(ref(this.db, 'twiauth/' + user.uid), {
          token: credential.accessToken,
          secret: credential.secret
        })
      }
    })

  }
}
</script>

<style scoped>
.home {
  margin: 0;
  width: 100%;
}
.home__list-area {
  position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
}
.home__icon-area {
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px);
}
</style>
