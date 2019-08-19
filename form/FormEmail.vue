<template lang="pug">
    FormItem(:label="label" icon="envelope")
        input(type="email" :placeholder="placeholder" v-model="localValue" :required="required")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormItem from './FormItem.vue'

@Component<FormEmail>({
  components: {
    FormItem
  }
})
export default class FormEmail extends Vue {
  @Prop({ type: String }) value!: string;
  @Prop({ type: String }) label!: string;
  @Prop({ type: String }) placeholder!: string;
  @Prop({ type: Boolean }) required!: boolean;

  get localValue () {
    return this.value
  }
  set localValue (value: string) {
    this.$emit('input', value)
  }
}
</script>
