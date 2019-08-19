<template lang="pug">
    FormItem(:label="label" :loading="loading" :invalid="invalid || localInvalid" :info="info" :disabled="disabled")
        input(:placeholder="placeholder" v-model="localValue" :required="required" @change="change($event)" @keydown="$emit('keydown', $event)" :disabled="disabled || loading")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component<FormString>({
  components: {
    FormItem
  },
  mounted () {
    this.$emit('validation', this.valid)
  },
  beforeDestroy () {
    this.$emit('validation', true)
  }
})
export default class FormString extends Vue {
  @Prop({ type: String }) value!: string;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: String }) info!: string;
  @Prop({ type: Boolean }) required!: boolean;
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: [String, Boolean], default: false }) invalid!: string | boolean;
  @Prop({ type: String }) match!: string;

  get localValue () {
    return this.value
  }
  set localValue (value: string) {
    this.$emit('input', value)
  }

  get matched () {
    if (!this.match) return true
    const re = new RegExp(this.match)
    return re.test(this.localValue)
  }

  get valid () {
    return !(this.required && !this.value) && !this.invalid && this.matched
  }

  localInvalid: boolean | string = false;

  validate () {
    if (this.valid) {
      this.localInvalid = false
    } else {
      if (!this.localValue) {
        this.localInvalid = 'Обязательно для заполнения'
      } else {
        if (!this.matched) {
          this.localInvalid = 'Неверный формат'
        }
      }
    }
  }
  change (event: any) {
    this.validate()
    this.$emit('change', event)
  }

  @Watch('valid')
  onValidChange () {
    this.$emit('validation', this.valid)
  }
}
</script>
