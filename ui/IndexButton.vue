<template lang="pug">
    FormButton(color="blue" @click="toggle" :disabled="disabled" :loading="loading")
        fa(icon="globe")
        |  {{ valueData.meta.indexed ? "Закрыть от индексации" : "Индексировать" }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormButton from '../form/FormButton.vue'

interface IValue {
    [key: string]: any
    meta: {
        [key: string]: any
        indexed: boolean
    }
}

@Component<IndexButton>({
  components: {
    FormButton
  }
})
export default class IndexButton extends Vue {
  @Prop({ type: Object }) value!: IValue;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: String, required: true }) action!: string;
  @Prop({ type: Object }) params!: {[key: string]: any};

  loading = false;

  get valueData () {
    return this.value
  }
  set valueData (value: IValue) {
    this.$emit('input', value)
  }

  async toggle () {
    if (!this.disabled && !this.loading) {
      this.loading = true
      this.valueData.meta.indexed = await this.$store.dispatch(this.action, Object.assign(this.params, { value: !this.valueData.meta.indexed }))
      this.loading = false
    }
  }
}
</script>
