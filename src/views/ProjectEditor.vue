<template>
  <section class="ProjectEditor">

    <el-form 
      :model="form"
      ref="projectEditorForm"
      label-position="right"
      label-width="5rem"
    >

      <!-- Name -->
      <el-form-item 
        label="專案名稱" 
        prop="name"
        :rules="[
          { required: true, message: '此欄位為必填', trigger: 'change' },
          { min: 3, max: 20, message: '長度須介於 3 到 20 個字元', trigger: 'change' }
        ]" >
        <el-input v-model="form.name" />
      </el-form-item>

      <!-- Description -->
      <el-form-item 
        label="簡介" 
        prop="desc" 
        :rules="[
          { required: true, message: '此欄位為必填', trigger: 'change' },
          { min: 5, max: 50, message: '長度須介於 5 到 50 個字元', trigger: 'change' } 
        ]" >
        <el-input 
          v-model="form.desc" 
          type="textarea" 
          placeholder="50字內的簡單介紹。" 
          :autosize="{ minRows: 2, maxRows: 4}" />
      </el-form-item>

      <!-- Keyword -->
      <el-form-item label="標籤" prop="keywords">
        <dynamic-tags v-model="form.keywords" :max="3">+ 新增標籤</dynamic-tags>
      </el-form-item>

      <!-- Custom fields (Note, Slide ...) -->
      <el-form-item
        v-for="(item, key) in detailTypes" 
        :label="item.name"
        :key="key"
        :prop="'detail.' + key"
        :required="item.isRequired"
        :rules="{ validator: makeRegexValidator(item.format, item.formatErrorMessage, item.isRequired) }" >
        <el-input 
          v-model="form.detail[key]"
          :placeholder="item.description" 
        />
      </el-form-item>

      <!-- Submit button -->
      <el-form-item>
        <el-button @click="$emit('closeDialog')">取 消</el-button>
        <el-button type="primary" @click="submitForm('projectEditorForm')">儲 存</el-button>
      </el-form-item>

    </el-form>
  </section>
</template>

<script>
import DynamicTags from '@/components/DynamicTags'
import { db } from '@/service/firebase'
import { detailTypes } from '@/config/detailTypes.js'
import _ from 'lodash'

export default {
  name: 'ProjectEditor',
  components: {
    DynamicTags,
  },
  props: {
    editingProjectID: String,
  },
  firebase: {
    projects: db.ref('projects'),
  },
  data() {
    return {
      form: {
        name: '',
        desc: '',
        keywords: [],
        // Custom fields defined in config/detailTyoe.js
        detail: _.mapValues(detailTypes, () => ''),
      },
      formLabelWidth: '120px',
      detailTypes,
    }
  },
  watch: {
    editingProjectID(id) {
      // When dialog is open again
      this.initFields(id)
    },
  },
  mounted() {
    // When dialog open for the first time
    this.initFields(this.editingProjectID)
  },
  methods: {
    updateFirebaseDB(key, payload) {
      this.$firebaseRefs.projects
        .child(key)
        .update(payload)
        .then(() => {
          this.$message(`${payload.name} 更新成功`)
          this.$emit('closeDialog')
        })
        .catch(error => {
          this.$message.error('更新專案失敗：', error.message)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const key = this.isCreating
            ? this.$firebaseRefs.projects.push().key
            : this.restoreData['.key']
          const payload = {
            ...this.form,
            // Ignore empty detail fileds
            detail: _.omitBy(this.form.detail, value => value === ''),
          }
          this.updateFirebaseDB(key, payload)
        } else {
          this.$message.error('資料格式不符')
          return false
        }
      })
    },
    makeRegexValidator(regex, errorMessage, required) {
      return (rule, value, callback) => {
        const empty = !value

        if (empty && required) {
          callback('此欄位為必填')
        } else if (empty && !required) {
          callback()
        } else if (!empty && regex.test(value)) {
          callback()
        } else {
          callback(new Error(errorMessage))
        }
      }
    },
    initFields(projectID) {
      const oldData = this.projects.filter(p => p['.key'] === projectID)[0]
      if (oldData) {
        // Restore fields before editing existing project (preserve fields of empty string)
        this.form = _.defaultsDeep(_.omit(oldData, '.key'), this.form)
      } else {
        // Reset fields to blank for a new project
        this.$refs['projectEditorForm'].resetFields()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  //.ProjectEditor {}
</style>
