<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-header>
        Header
        <p>{{msg}}</p>
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
  methods: {},
  components: {
    TheList,
    TheMap,
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
