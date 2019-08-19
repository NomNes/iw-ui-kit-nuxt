<template lang="pug">
    FormString(v-model="currentSlug" @change="change($event)" :loading="loading" :invalid="invalid" :required="required" @validation="$emit('validation', $event)" label="Компонент URL" :info="uri")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormString from '../form/FormString.vue'

interface IValue {
    [key: string]: any
    meta: {
        [key: string]: any
        slug: string
    }
}

@Component<SlugInput>({
  components: {
    FormString
  },
  mounted () {
    this.currentSlug = this.value.meta.slug
    this.change()
  }
})
export default class SlugInput extends Vue {
  @Prop({ type: Object, required: true }) value!: IValue;
  @Prop({ type: Boolean }) required!: boolean;
  @Prop({ type: String, required: true }) action!: string;
  @Prop({ type: Object, default: () => ({}) }) params!: {[key: string]: any};
  @Prop() watchData!: any;

  get valueData () {
    return this.value
  }
  set valueData (value: IValue) {
    this.$emit('input', value)
  }

  currentSlug = '';
  loading = false;
  invalid = false;
  uri = '';

  async change (event?: any) {
    if (this.currentSlug) {
      this.loading = true
      this.$emit('loading', true)
      this.currentSlug = this.currentSlug.toLowerCase().replace(/[^a-z-_\d%]/ig, '')
      try {
        const url = await this.$store.dispatch(this.action, Object.assign(this.params, { slug: this.currentSlug }))
        this.valueData.meta.slug = this.currentSlug
        this.uri = url
        this.loading = false
        this.invalid = false
        this.$emit('loading', false)
      } catch (error) {
        this.invalid = error.message
        this.loading = false
        this.$emit('loading', false)
      }
    }
    this.$emit('change', event)
  }

  @Watch('data.meta.slug')
  onSlugChange (value: string, oldValue: string) {
    this.currentSlug = value
    if (value !== oldValue) this.change()
  }
  @Watch('watchData')
  onParamsChange () {
    this.change()
  }
}
</script>
