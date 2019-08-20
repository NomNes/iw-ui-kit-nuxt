<template lang="pug">
  main
    FormButton(color="red" @click="openPopup" :disabled="disabled" :loading="loading")
      fa(icon="trash-alt")
      |  Удалить
    ConfirmPopup(v-if="open" @close="closePopup" @cancel="closePopup" @confirm="remove")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormButton from '../form/FormButton.vue'
import ConfirmPopup from '../elements/ConfirmPopup.vue'

@Component<RemoveButton>({
  components: {
    FormButton,
    ConfirmPopup
  }
})
export default class RemoveButton extends Vue {
  @Prop({ type: String }) listLink!: string;
  @Prop({ type: Boolean }) disabled!: boolean;
  @Prop({ type: String, required: true }) action!: string;
  @Prop({ type: Object }) params!: {[key: string]: any};

  loading = false;
  open = false;

  async remove () {
    if (!this.disabled && !this.loading) {
      this.loading = true
      const result = await this.$store.dispatch(this.action, this.params)
      if (result) {
        this.loading = false
        this.open = false
        if (this.listLink) return this.$router.push(this.listLink)
      }
    }
  }

  openPopup () {
    this.open = true
  }
  closePopup () {
    this.open = false
  }
}
</script>
