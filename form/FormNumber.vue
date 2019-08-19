<template lang="pug">
    FormItem(:label="label" :loading="loading" :invalid="invalid || localInvalid" :info="info")
        input(type="number" :placeholder="placeholder" v-model="localValue" :required="required" @change="change($event)" :min="min" :max="max" :step="step")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component<FormNumber>({
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
export default class FormNumber extends Vue {
  @Prop({ type: [Number, String] }) value!: number | string;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: String }) info!: string;
  @Prop({ type: Boolean }) required!: boolean;
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: [String, Boolean], default: false }) invalid!: string | boolean;
  @Prop({ type: Number }) min!: number;
  @Prop({ type: Number }) max!: number;
  @Prop({ type: Number }) step!: number;

  get localValue () {
    return +this.value
  }
  set localValue (value: string | number) {
    this.$emit('input', +value)
  }

  get valid () {
    if (this.required && !this.value) return false
    if (this.min !== undefined && this.min > this.value) return false
    if (this.max !== undefined && this.max < this.value) return false
    return !this.invalid
  }

  localInvalid: boolean | string = false;

  validate () {
    if (this.valid) {
      this.localInvalid = false
    } else {
      if (this.min !== undefined && this.min > this.value) {
        this.localInvalid = `Не должно быть меньше ${this.min}`
      } else if (this.max !== undefined && this.max < this.value) {
        this.localInvalid = `Не должно быть больше ${this.max}`
      } else {
        this.localInvalid = 'Обязательно для заполнения'
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
