<template lang="pug">
    FormItem.form-upload(:label="label" :class="{multiple}")
        .preview(v-if="innerValue.length" v-for="(item, index) in innerValue" :key="index")
            slot(:filename="item")
                .file-preview
                    .icon
                        fa(:icon="fileIcon(item)")
                    a.name(:href="pathTemplate.replace('[name]', item)" target="_blank") {{ item }}
            .remove(v-if="item" @click="remove(index)")
                fa(icon="times")
            fa(icon="spinner" spin v-if="!item")
            .move(v-if="item && innerValue.length > 1")
                .arrow.left(@click="moveItem(index, index - 1)" v-if="index > 0")
                    fa(icon="arrow-left")
                .arrow.right(@click="moveItem(index, index + 1)" v-if="index + 1 < innerValue.length")
                    fa(icon="arrow-right")

        .preview.empty(v-if="!innerValue.length")
            slot(name="empty")

        label.select
            input(type="file" ref="file" @input="getFile" :multiple="multiple")
            fa(icon="plus")
            .label Добавить файл
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component({
  components: {
    FormItem
  }
})
export default class FormUpload extends Vue {
  @Prop({ type: [String, Array] }) value!: string | string[];
  @Prop({ type: String }) label!: string;
  @Prop({ type: Boolean }) multiple!: boolean;
  @Prop({ type: String, required: true }) action!: string;
  @Prop({ type: String, default: '[name]' }) pathTemplate!: string;

  get innerValue () {
    if (!this.value) return []
    if (Array.isArray(this.value)) return this.value
    return [this.value]
  }
  set innerValue (value: string[]) {
    if (Array.isArray(this.value)) {
      this.$emit('input', Object.assign([], value))
    } else {
      this.$emit('input', value.length ? value[0] : '')
    }
  }

  fileIcon = (name: string) => {
    switch (name.replace(/^.*\./, '')) {
      case 'png':
      case 'gif':
      case 'jpg':
      case 'jpeg':
      case 'webp':
        return 'file-image'
      case 'pdf':
        return 'file-pdf'
      case 'doc':
      case 'docx':
        return 'file-word'
      case 'xls':
      case 'xlsx':
        return 'file-excel'
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'file-audio'
      case 'zip':
      case 'rar':
      case 'gz':
      case '7z':
        return 'file-archive'
      case 'mp4':
      case 'avi':
        return 'file-video'
      default:
        return 'file'
    }
  };

  moveItem (oldIndex: number, newIndex: number) {
    this.innerValue.splice(newIndex, 0, this.innerValue.splice(oldIndex, 1)[0])
    this.$emit('change')
  }
  remove (index: number) {
    const items = Object.assign([], this.innerValue)
    items.splice(index, 1)
    this.innerValue = items
    this.$emit('change')
  }
  async getFile () {
    this.$emit('loading', true)
    // @ts-ignore
    const files = this.$refs.file.files
    if (files && files.length) {
      const promises = []
      let items: Array<string> = Object.assign([], this.innerValue)
      if (!this.multiple) items = []
      const itemsLength = items.length
      for (let i = 0; i < files.length; i++) {
        const index = itemsLength + i
        items[index] = ''
        this.innerValue = items
        promises.push(new Promise(resolve => {
          return this.$store.dispatch(this.action, files[i]).then(file => {
            items[index] = file
            this.innerValue = Object.assign([], items)
            return resolve()
          }).catch(error => {
            console.error(error)
            return resolve()
          })
        }))
      }
      await Promise.all(promises)
      items = items.filter(item => !!item)
      this.innerValue = Object.assign([], items)
      this.$emit('loading', false)
      this.$emit('change')
    }
  }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .form-upload
        width 100%
        .form-element
            position relative
            border 0
        .preview
            width 100%
            position relative
            border-radius 5px
            display flex
            justify-content flex-start
            align-items center
            font-size 25px
            .remove
                font-size 16px
                position absolute
                z-index 2
                top 0
                right 0
                width 20px
                height 20px
                border-radius 5px
                background color_red
                color #fff
                display flex
                justify-content center
                align-items center
                cursor pointer
            .move
                .arrow
                    position absolute
                    bottom 0
                    width 20px
                    height 20px
                    display flex
                    justify-content center
                    align-items center
                    cursor pointer
                    color #fff
                    background color_green
                    border-radius 5px
                    font-size 16px
                    &.left
                        left 0
                    &.right
                        right 0
            .file-preview
                height 30px
                display flex
                align-items center
                .icon
                    margin-right 10px
                    width 30px
                .name
                    font-size 16px
                    width calc(100% - 40px)
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
        .select
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            z-index 1
            cursor pointer
            input
                display none
            svg
                display none
            .label
                display none
        .preview.empty
            height 30px
            & + .select
                display flex
                align-items center
                justify-content center
                background #ccc
                border-radius 5px
                svg
                    display block
                .label
                    display block
                    margin-left 5px
        &.multiple
            width auto
            .form-element
                display flex
                flex-wrap wrap
                align-items center
            .preview
                margin-bottom 10px
            .select
                position static
                height 30px
                display flex
                align-items center
                justify-content center
                background #ccc
                border-radius 5px
                svg
                    display block
                .label
                    display block
                    margin-left 5px
</style>
