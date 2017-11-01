<template>
  <section class="ProjectEditorForm">

    <el-form 
      :model="form"
      label-position="right"
      label-width="5rem"
    >

      <!-- Name -->
      <el-form-item label="專案名稱" required>
        <el-input v-model="form.name" />
      </el-form-item>

      <!-- Description -->
      <el-form-item label="簡介">
        <el-input 
          v-model="form.desc" 
          type="textarea" 
          placeholder="50字內的簡單介紹。" 
          :autosize="{ minRows: 2, maxRows: 4}" 
        />
      </el-form-item>

      <!-- Keyword -->
      <el-form-item label="標籤">
        <dynamic-tags v-model="form.keywords" :max="3">+ 新增標籤</dynamic-tags>
      </el-form-item>

    </el-form>

    <el-button @click="$emit('cancel')">取 消</el-button>
    <el-button type="primary" @click="onSubmit">儲 存</el-button>

  </section>
</template>

<script>
import DynamicTags from '../components/DynamicTags/DynamicTags.vue'

export default {
  name: 'ProjectEditorForm',
  data() {
    return {
      form: {
        name: '',
        desc: '',
        keywords: [],
        position: {
          x: 0,
          y: 0,
        },
      },
      formLabelWidth: '120px',
    }
  },
  components: {
    DynamicTags,
  },
  computed: {},
  methods: {
    onSubmit() {
      // TODO: connect to Firebase
      alert('[ProjectEditor] Submitting ', this.form)
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
  //.ProjectEditorForm {}
</style>
