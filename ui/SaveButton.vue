<template lang="pug">
    FormButton(color="green" :disabled="disabled" :loading="loading" @click="save")
        fa(icon="save")
        |  Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormButton from '../form/FormButton.vue'

interface IValue {
    [key: string]: any,
    id: string
}

@Component<SaveButton>({
  components: {
    FormButton
  }
})
export default class SaveButton extends Vue {
  @Prop({ type: Object }) value!: IValue;
  @Prop({ type: String }) itemLink!: string;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: String, required: true }) action!: string;
  @Prop({ type: Object, default: () => ({}) }) params!: {[key: string]: any};

  loading = false;

  save () {
    this.loading = true
    return setTimeout(async () => {
      if (!this.disabled) {
        const resultId = await this.$store.dispatch(this.action, Object.assign(this.params, { data: this.value }))
        this.loading = false
        if (resultId && this.itemLink && this.value.id !== resultId) this.$router.push(this.itemLink.replace('[id]', resultId))
      }
    }, 50)
  }
}
</script>
