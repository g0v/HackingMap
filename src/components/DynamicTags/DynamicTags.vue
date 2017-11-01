<template>
  <div class="DynamicTags">

    <el-tag
      :key="tag"
      v-for="tag in value"
      :closable="allowClose"
      :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <span v-if="allowInput">
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        <slot>+ New Tag</slot>
      </el-button>
    </span>

  </div>
</template>

<script>
export default {
  name: 'DynamicTag',
  props: {
    // v-model biding value for the tags.
    value: {
      type: Array,
      required: true,
      validator: items => {
        const isString = val => typeof val === 'string'
        return items.filter(isString).length === items.length
      },
    },

    // Maximun number of tags. Hide input box when length of `value` exceed it.
    max: {
      type: Number,
      default: null,
    },

    // Maximun number of tags. If specified, close icons of tags only show when length of `value` is greater then it.
    min: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
    }
  },
  computed: {
    allowInput() {
      return !this.max || this.value.length < this.max
    },
    allowClose() {
      return !this.min || this.value.length > this.min
    },
  },
  methods: {
    handleClose(tag) {
      this.$emit('input', this.value.filter(item => item !== tag))
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.$emit('input', [...this.value, inputValue])
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.DynamicTags {

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
