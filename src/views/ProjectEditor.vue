<template>
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
        required
        :rules="{ validator: composeValidator(validRequire(true, '專案名稱為必填'), composeValidator(validChineseLength(3, 20))) }" >
        <el-input v-model="form.name" />
      </el-form-item>

      <!-- Description -->
      <el-form-item 
        label="簡介" 
        prop="desc"
        required
        :rules="{ validator: composeValidator(validRequire(true), validChineseLength(5, 50)) }" >
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
        :rules="{ validator: composeValidator(validRegex(item.format, item.formatErrorMessage), validRequire(item.isRequired)) }" >
        <el-input 
          v-model="form.detail[key]"
          :placeholder="item.description" 
        />
      </el-form-item>

      <!-- Submit button -->
      <el-form-item>
        <el-button
          icon="el-icon-delete" type="danger" plain
          class="float-right"
          @click="deleteProject(form['.key'], $event)"
        >刪 除</el-button>
        <el-button
          icon="el-icon-upload2" type="primary" 
          class="float-left"
          @click="submitForm('projectEditorForm')" :loading="loadingSubmit"
        >儲 存</el-button>
        <el-button icon="el-icon-close" class="float-left" @click="cancelEditing">取 消</el-button>
      </el-form-item>

    </el-form>
</template>

<script>
import { mapState } from 'vuex'
import DynamicTags from '@/components/DynamicTags'
import { db } from '@/service/firebase'
import { detailTypes } from '@/config/detailTypes.js'
import _ from 'lodash'

export default {
  name: 'ProjectEditor',
  components: {
    DynamicTags,
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
      loadingSubmit: false,
      formLabelWidth: '120px',
      detailTypes,
    }
  },
  computed: {
    ...mapState(['editingProject']),
  },
  mounted() {
    this.restoreForm()
  },
  watch: {
    editingProject(project) {
      if (project) {
        this.restoreForm()
      }
    },
  },
  methods: {
    restoreForm() {
      console.log('Restoring')
      this.$refs['projectEditorForm'].resetFields()
      this.$nextTick(function() {
        let copy = _.cloneDeep(this.editingProject)
        _.defaultsDeep(copy, this.form)
        this.form = copy
      })
    },
    cancelEditing() {
      this.$store.commit('setEditingProject', null)
    },
    composeValidator(...validators) {
      // Validator function signature of <el-form-item>
      return (rules, value, callback) => {
        validators.forEach(validator => {
          validator(null, value, err => (err ? callback(err) : null))
        })
        // all validator pass!
        callback()
      }
    },
    validRequire: (isRequired, message) => (_, value, callback) => {
      isRequired && !value
        ? callback(new Error(message || '此欄為必填'))
        : callback()
    },
    validRegex: (regex, message) => (_, value, callback) => {
      regex.test(value) || !value
        ? callback()
        : callback(new Error(message || `格式錯誤（${regex}）`))
    },
    validChineseLength: (min, max) => (_, value, callback) => {
      const len = value.replace(/[^\x00-\xff]/g, 'XX').length / 2
      const valid = len >= min && len <= max
      if (valid || !value) {
        callback()
      } else {
        len < min
          ? callback(new Error(`輸入過短（${len}/${min}字）`))
          : callback(new Error(`輸入過長（${len}/${max}字）`))
      }
    },
    updateFirebaseDB(key, payload) {
      // console.log('[ProjectEditor] updateFirebaseDB ', key, payload)
      payload = _.omit(payload, '.key')
      this.loadingSubmit = true
      this.$firebaseRefs.projects
        .child(key)
        .update(payload)
        .then(() => {
          this.loadingSubmit = false
          this.$message(`${payload.name} 更新成功`)
          this.cancelEditing()
        })
        .catch(error => {
          this.loadingSubmit = false
          this.$message.error('更新專案失敗：', error.message)
        })
    },
    deleteProject(key, $event) {
      if (!$event.shiftKey) {
        return this.askShiftKey()
      }

      this.$firebaseRefs.projects
        .child(key)
        .set(null)
        .then(() => {
          this.$message(`刪除成功`)
          this.cancelEditing()
        })
        .catch(error => {
          this.$message.error('刪除專案失敗：', error.message)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const payload = {
            ...this.form,
            // Ignore empty detail fileds aka ""
            detail: _.omitBy(this.form.detail, _.isEmpty),
          }
          this.updateFirebaseDB(this.editingProject['.key'], payload)
        } else {
          this.$message.error('格式有誤')
          return false
        }
      })
    },
    askShiftKey() {
      this.$message.error('請按著 Shift 鍵')
    },
  },
}
</script>

<style lang="scss" scoped>
.float-right {
  float: right;
}

.float-left {
  float: left;
}
</style>
