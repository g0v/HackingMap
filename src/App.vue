<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-header>
        <h3 style="color: #3a3a3a;">g0v Hacking Map <sub><i>Beta</i></sub> </h3>
      </el-header>
      <el-container>
        <el-aside>
          <TheList/>
        </el-aside>
        <el-main>
          <TheMap/>
        </el-main>
      </el-container>
      <el-dialog :visible="isEditing" :show-close="false">
        <ProjectEditor/>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TheList from '@/views/TheList'
import TheMap from '@/views/TheMap'
import ProjectEditor from '@/views/ProjectEditor'

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to g0v Hacking Map',
    }
  },
  computed: {
    ...mapState(['isEditing']),
  },
  methods: {
    showGuide() {
      this.$notify({
        title: '簡易 操作說明 🎅',
        message: '左側列表可編輯專案，並在地圖上 新增/刪除 該專案。地圖上的專案皆可自由拖移調整位置。',
        duration: 8500,
      })
    },
    showAnnouncement() {
      this.$notify({
        title: ' 這次大松為初次 Beta 測試 🎁',
        message: `
          <h4>後續規劃：</h4>
          <p>１ 開源至 g0v Github 。</p>
          <p>２ 確認需求（e.g. 更新底圖）。</p>
          <p>３ 優化整體 UI 🐳 。</p>
        `,
        duration: 12500,
        showClose: false,
        dangerouslyUseHTMLString: true,
        offset: 150,
      })
    },
  },
  components: {
    TheList,
    TheMap,
    ProjectEditor,
  },
  mounted() {
    this.$message(this.msg)

    this.showGuide()
    this.showAnnouncement()
  },
}
</script>

<style lang="scss">
html, body {
  margin: 0px;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.el-header {
  background-color: #B3C0D1;
}

.el-aside {
  background-color: #FFF;
  height: calc(100vh - 60px);
}

.el-main {
  padding: 0px;
  background-color: #E9EEF3;
  height: calc(100vh - 60px);
}

.el-button [class^=fa]+span {
  margin-left: 5px;
}

</style>
