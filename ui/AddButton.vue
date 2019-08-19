<template lang="pug">
    FormButton(color="green" type="router-link" :to="to")
        fa(icon="plus")
        |  Добавить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import FormButton from '../form/FormButton.vue'

@Component<AddButton>({
  components: {
    FormButton
  }
})
export default class AddButton extends Vue {
  @Prop({ type: String }) to!: string
}
</script>
