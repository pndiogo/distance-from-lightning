<template>
  <div class="settings">
    <theme-toggler class="settings__item"></theme-toggler>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ThemeToggler from './ThemeToggler.vue';

@Component({
  components: {
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
}

</style>
