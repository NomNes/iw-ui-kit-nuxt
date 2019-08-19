<template lang="pug">
    FormItem.link-change(:disabled="disabled" :loading="loading")
        FormString(v-model="innerValue.title" label="Заголовок" :disabled="disabled" required @validation="validation('title', $event)")
        Columns
            FormSelect(slot="left" v-model="innerValue.collection" :items="collections" :disabled="disabled" @validation="validation('collection', $event)")
            FormSelect(v-if="idList[innerValue.collection]" slot="right" v-model="innerValue.id" :items="idList[innerValue.collection].map(i => ({value: i.id, title: i.title}))")
            FormString(v-if="innerValue.collection === 'ExternalLink'" slot="right" v-model="innerValue.id" required @validation="validation('id', $event)")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from '../form/FormItem.vue'
import FormSelect from '../form/FormSelect.vue'
import Columns from '../elements/Columns.vue'
import FormString from '../form/FormString.vue'

interface IVaulue {
    title: string,
    collection: string,
    id: string
}
interface ICollection {
    value: string,
    title: string
}

@Component<LinkChanger>({
  components: {
    FormString,
    Columns,
    FormSelect,
    FormItem
  }
})
export default class LinkChanger extends Vue {
  @Prop({ type: Object }) value!: IVaulue;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: String }) action!: string;

  get innerValue () {
    return this.value
  }
  set innerValue (value: IVaulue) {
    this.$emit('input', value)
  }

  loading = false;
  collections: Array<ICollection> = [];
  idList: {[key: string]: Array<{id: string, title: string}>} = {};
  collectionsData: {[key: string]: {hasRoot?: boolean, hasChildren?: boolean}} = {};

  async getData () {
    const { linksData } = await this.$store.dispatch(this.action)
    this.collections = [{ value: 'ExternalLink', title: 'Внешняя ссылка' }]
    const values = ['ExternalLink']
    this.collectionsData = linksData
    for (let collection of Object.keys(linksData)) {
      this.collections.push({ value: collection, title: linksData[collection].title })
      values.push(collection)
    }
    if (!values.includes(this.innerValue.collection)) this.innerValue.collection = values[0]
  }

  async loadIdList () {
    if (!this.idList[this.innerValue.collection] && this.collectionsData[this.innerValue.collection] && this.collectionsData[this.innerValue.collection].hasChildren) {
      const { linksData } = await this.$store.dispatch(this.action, this.innerValue.collection)
      this.idList[this.innerValue.collection] = linksData[this.innerValue.collection] && linksData[this.innerValue.collection].children ? linksData[this.innerValue.collection].children : []
      if (this.collectionsData[this.innerValue.collection].hasRoot) this.idList[this.innerValue.collection] = [{ id: '', title: '[Корень раздела]' }].concat(this.idList[this.innerValue.collection])
      this.idList = Object.assign({}, this.idList)
      const values = this.idList[this.innerValue.collection].map(i => i.id)
      if (!values.includes(this.innerValue.id)) this.innerValue.id = values[0]
    }
  }

  validation (field: string, value: boolean) {
    this.$emit('validation', { field, value })
  }

  mounted () {
    this.getData()
  }

  @Watch('innerValue.collection')
  onCollectionChange (value: string, oldValue: string) {
    if (value !== oldValue) this.innerValue.id = ''
    this.loadIdList()
  }
}
</script>

<style lang="stylus">
    .link-change
        & > .form-element
            display block
            padding 5px 10px 0
</style>
