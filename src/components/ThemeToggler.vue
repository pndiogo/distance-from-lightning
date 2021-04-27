<template>
  <div class="theme-toggler" @click="toggleState">
    <div class="theme-toggler__toggle" :class="[isDark ? 'dark' : 'light']">
      <span class="theme-toggler__hidden">
        {isDark ? "Enable Light Mode" : "Enable Dark Mode"}
      </span>
      <div class="theme-toggler__icons">
        <SunIcon />
        <MoonIcon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SunIcon from '@/components/SunIcon.vue';
import MoonIcon from '@/components/MoonIcon.vue';

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

@Component({
  components: {
    MoonIcon,
    SunIcon
  }
})
export default class ThemeToggler extends Vue {
  private isDark = true;

  protected created (): void {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
      document.body.classList.toggle('dark-theme');
      this.isDark = true;
    } else if (currentTheme === 'light') {
      document.body.classList.toggle('light-theme');
      this.isDark = false;
    }
  }

  private toggleState (): void {
    this.isDark = !this.isDark;
    this.updateTheme();
  }

  private updateTheme (): void {
    let theme: string;

    if (prefersDarkScheme.matches) {
      document.body.classList.toggle('light-theme');
      theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    } else {
      document.body.classList.toggle('dark-theme');
      theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    }

    localStorage.setItem('theme', theme);
  }
}
</script>

<style lang="scss" scoped>
.theme-toggler {
  display: inline-block;

  &__toggle {
    height: 32px;
    background: var(--theme-toggle-foreground);
    border-radius: 5px;
    padding: 5px 12px;
    position: relative;
    transition: background var(--transition-slow);
    cursor: pointer;

    &::before {
      content: "";
      display: block;
      height: 22px;
      width: 24px;
      border-radius: 30px;
      background: var(--theme-toggle-background);
      position: absolute;
      z-index: 2;
      transform: translate(0);
      transition: transform var(--transition-slow), background var(--transition-slow);
    }

    &.dark {
      &::before {
        transform: translateX(34px);
      }
    }
  }

  &__hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  &__icons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    height: 100%;

    svg {
      fill: var(--theme-toggle-background);
      height: 22px;
      width: 22px;
      z-index: 0;
    }
  }
}
</style>
