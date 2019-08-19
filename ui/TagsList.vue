<template lang="pug">
    FormItem.tags-list(:loading="loading" :label="label")
        .tags(v-if="tagsList.length")
            .tag(v-for="tag in tagsList" :key="tag._id")
                .value {{ tag.title }}
                .remove(@click="removeTag(tag)")
                    fa(icon="times")
        Autocomplete(:getHandler="getHandler" :addHandler="addHandler" @select="addTag")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from '../form/FormItem.vue'
import Autocomplete from './Autocomplete.vue'

interface ITag {
    _id: string
    title: string
}

@Component<TagsList>({
  components: {
    Autocomplete,
    FormItem
  }
})
export default class TagsList extends Vue {
  @Prop({ type: Array }) value!: Array<any>;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String, required: true }) addAction!: string;
  @Prop({ type: String, required: true }) getAction!: string;

  get tags () {
    return this.value
  }
  set tags (value: Array<any>) {
    this.$emit('input', value)
  }

  tagsList: Array<ITag> = [];
  loading = false;

  async getHandler (value: string) {
    const { tags } = await this.$store.dispatch(this.getAction, { title: value || undefined, excludeId: this.tags.length ? this.tags : undefined })
    return tags
  }

  async addHandler (title: string) {
    this.loading = true
    const { result } = await this.$store.dispatch(this.addAction, title)
    this.loading = false
    return { value: result._id, title }
  }
  async getTags () {
    const inputList = [...new Set(this.tags)]
    const hasTags: {[key: string]: ITag} = {}
    for (let tag of this.tagsList) {
      if (this.tags.includes(tag._id)) hasTags[tag._id] = tag
    }
    const toAdd = []
    for (let tag of inputList) {
      if (!hasTags[tag]) toAdd.push(tag)
    }
    if (toAdd.length) {
      this.loading = true
      const { tags } = await this.$store.dispatch(this.getAction, { limit: 0, id: toAdd })
      this.loading = false
      for (let tag of tags) {
        hasTags[tag._id] = tag
      }
    }
    const result = []
    for (let tag of inputList) {
      if (hasTags[tag]) result.push(hasTags[tag])
    }
    this.tagsList = result
  }
  addTag (tag: {value: string, title: string}) {
    this.tagsList.push({ _id: tag.value, title: tag.title })
  }
  removeTag (tag: ITag) {
    const list = this.tagsList.map(t => t._id)
    const index = list.indexOf(tag._id)
    if (index >= 0) {
      this.tagsList.splice(index, 1)
    }
  }

  mounted () {
    this.getTags()
  }

  @Watch('value')
  onValueChange () {
    this.getTags()
  }
  @Watch('tagsList')
  onTagsListChange (value: Array<ITag>) {
    const tags = value.map(v => v._id)
    if (tags.join(',') !== this.tags.join(',')) {
      this.tags = tags
    }
  }
}
</script>

<style lang="stylus">
    @require "../assets/VAR.styl"

    .tags-list
        & > .form-element
            border 0
            border-radius 0
            display block
        .tags
            margin-bottom 5px
            display flex
            flex-wrap wrap
            .tag
                background color_green
                color #fff
                font-size 12px
                line-height 20px
                height 20px
                padding 0 0 0 5px
                margin 0 5px 3px 0
                border-top-left-radius 3px
                border-bottom-left-radius 3px
                border-top-right-radius 10px
                border-bottom-right-radius 10px
                display flex
                .remove
                    height 20px
                    border-top-left-radius 10px
                    border-bottom-left-radius 10px
                    width 20px
                    display flex
                    justify-content center
                    align-items center

    @media screen and (min-width: desktop_width)
        .tags-list
            .tags
                .tag
                    .remove
                        cursor pointer
</style>
