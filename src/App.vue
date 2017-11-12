<template>
  <div id="app">
    <p>{{msg}}</p>

    <!-- TODO: move/positoin to right place -->
    <CreateProjectButton />

  </div>
</template>

<script>
import CreateProjectButton from '@/views/CreateProjectButton'
// import _ from 'lodash'

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    }
  },
  components: {
    CreateProjectButton,
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
