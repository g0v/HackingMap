<template>
  <section class="FireAuth">

    <!-- Dialog toggle button -->
    <el-button type="text" @click="dialogVisible = true">
      {{ !user ? '登入' : user.displayName }}
    </el-button>

    <!-- Dialog -->
    <el-dialog title="登入" :visible.sync="dialogVisible">
      <!-- Loading FirebaseUI Widget -->
      <p v-if="isLoading">Loading...</p>
      <div v-if="!user" id="firebaseui"></div>
      <div v-else>
        <img :src="user.photoURL" :alt="user.displayName" width="48">
        <p>{{ user.displayName }}</p>
        <p>{{ user.email }}</p>
        <el-button @click="signOutHandler" plain>登出</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
import firebaseui from 'firebaseui'
import { auth, signInOptions } from '@/service/firebase'

export default {
  name: 'FireAuth',
  data() {
    return {
      user: null,
      dialogVisible: false,
      isLoading: true,
      uiConfig: {
        signInFlow: 'popup',
        // Allowed sign in options (e.g. Google, Facebook, GitHub ...)
        signInOptions,
        callbacks: {
          signInSuccess: (currentUser, credential, redirectUrl) => {
            this.onSignInSuccess(currentUser)
          },
          uiShown: () => {
            this.isLoading = false
          },
        },
      },
    }
  },
  watch: {
    // mount/unmount FirebaseUI Widget upon toggling dialog
    dialogVisible(newValue, oldValue) {
      if (newValue === true && !this.user) {
        this.mountFirebaseUiWidget(auth, this.uiConfig, '#firebaseui')
      } else {
        this.firebaseUiWidget.reset()
      }
    },
  },
  methods: {
    mountFirebaseUiWidget(appAuth, config, elementId) {
      this.$nextTick(function() {
        this.firebaseUiWidget =
          firebaseui.auth.AuthUI.getInstance() ||
          new firebaseui.auth.AuthUI(appAuth)
        this.firebaseUiWidget.reset()
        this.firebaseUiWidget.start(elementId, config)
      })
    },
    onSignInSuccess(currentUser) {
      this.user = currentUser
      this.$message('歡迎登入' + this.user.displayName)
      this.dialogVisible = false
    },
    signOutHandler() {
      auth
        .signOut()
        .then(() => {
          this.user = null
          this.$message('登出成功')
          this.mountFirebaseUiWidget(auth, this.uiConfig, '#firebaseui')
        })
        .catch(error => {
          this.$message.error(`登出失敗：${error.message} (${error.code})`)
        })
    },
  },
}
</script>

<style scoped>
  /* .FireAuth {} */
</style>
