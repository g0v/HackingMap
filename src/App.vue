<template>
  <div id="app">
    <p>{{msg}}</p>

    <!-- TODO: move/positoin to right place -->
    <ProjectEditor/>

  </div>
</template>

<script>
import ProjectEditor from '@/views/ProjectEditor'
// import _ from 'lodash'

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  components: {
    ProjectEditor,
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
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
</style>
