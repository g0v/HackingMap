<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-header>
        <h3>g0v Hacking Map</h3>
      </el-header>
      <el-container>
        <el-aside>
          <TheList/>
        </el-aside>
        <el-main>
          <TheMap/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TheList from '@/views/TheList'
import TheMap from '@/views/TheMap'

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to g0v Hacking Map',
    }
  },
  computed: {},
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
          <p>１ 開源至 g0v Github</p>
          <p>２ 開始調整 UI 設計 </p>
          <p>３ 申請 domain </p>
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
