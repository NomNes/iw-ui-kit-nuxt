<template lang="pug">
    FormItem(:label="label" :loading="loading" :invalid="invalid || localInvalid")
        textarea(:placeholder="placeholder" v-model="localValue" :required="required" @change="change($event)" :rows="rows")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component<FormText>({
  components: {
    FormItem
  },
  mounted () {
    this.$emit('validation', this.valid)
  }
})
export default class FormText extends Vue {
  @Prop({ type: String }) value!: string;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: Boolean }) required!: boolean;
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: [String, Boolean], default: false }) invalid!: string | boolean;
  @Prop({ type: Number, default: 3 }) rows!: number;

  get localValue () {
    return this.value
  }
  set localValue (value: string) {
    this.$emit('input', value)
  }

  get valid () {
    return !(this.required && !this.value) && !this.invalid
  }

  localInvalid: boolean | string = false;

  validate () {
    if (this.valid) {
      this.localInvalid = false
    } else {
      this.localInvalid = 'Обязательно для заполнения'
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
