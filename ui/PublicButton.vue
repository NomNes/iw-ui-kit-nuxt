<template lang="pug">
    FormButton(color="yellow" @click="toggle" :disabled="disabled" :loading="loading")
        fa(:icon="valueData.meta.public ? 'eye-slash' : 'eye'")
        |  {{ valueData.meta.public ? "Снять с публикации" : "Опубликовать" }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormButton from '../form/FormButton.vue'

interface IValue {
    [key: string]: any
    meta: {
        [key: string]: any
        public: boolean
    }
}

@Component({
  components: {
    FormButton
  }
})
export default class PublicButton extends Vue {
  @Prop({ type: Object }) value!: IValue;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: String, required: true }) action!: string;
  @Prop({ type: Object }) params!: {[key: string]: any};

  get valueData () {
    return this.value
  }
  set valueData (value: IValue) {
    this.$emit('input', value)
  }

  loading = false;

  async toggle () {
    if (!this.disabled && !this.loading) {
      this.loading = true
      this.valueData.meta.public = await this.$store.dispatch(this.action, Object.assign(this.params, { value: !this.valueData.meta.public }))
      this.loading = false
      this.$emit('public', this.valueData.meta.public)
    }
  }
}
</script>
