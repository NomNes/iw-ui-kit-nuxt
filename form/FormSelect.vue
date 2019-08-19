<template lang="pug">
    FormItem.form-select(:label="label" :loading="loading" :invalid="invalid || localInvalid" :info="info" :disabled="disabled || loading")
        select(:placeholder="placeholder" v-model="localValue" :required="required" @change="change($event)" :disabled="disabled || loading")
            option(v-for="item in items" :key="item.value" :value="item.value") {{ item.title }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component<FormSelect>({
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
export default class FormSelect extends Vue {
  @Prop({ type: [String, Number] }) value!: string | number;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: String }) info!: string;
  @Prop({ type: Boolean }) required!: boolean;
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: [String, Boolean], default: false }) invalid!: string | boolean;
  @Prop({ type: Array, default: () => [] }) items!: Array<{value: string | number, title: string | number}>;

  get localValue () {
    return this.value
  }
  set localValue (value: string | number) {
    this.$emit('input', value)
  }

  get valid () {
    return !(this.required && !this.value) && !this.invalid
  }

  localInvalid: string | boolean = false;

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
