<template>
  <div class="settings">
    <language-toggler class="settings__item"></language-toggler>
    <theme-toggler class="settings__item"></theme-toggler>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LanguageToggler from '@/components/LanguageToggler.vue';
import ThemeToggler from '@/components/ThemeToggler.vue';

@Component({
  components: {
    LanguageToggler,
    ThemeToggler
  }
})

export default class AppSettings extends Vue {

}
</script>

<style lang="scss" scoped>
.settings {
  position: absolute;
  top: 1rem;
  right: 0;
  display: flex;
  align-items: center;

  &__item + .settings__item {
    margin-left: 1rem;
  }
}

</style>
