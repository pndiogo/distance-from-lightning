<template>
  <section class="sound-toggler">
    <svg @click="toggleSound" class="sound-icon sound-icon__mute" :class="{'sound-icon--is-visible': !isSoundActive}" id="Layer" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m457.941 256 47.029-47.029c9.372-9.373 9.372-24.568 0-33.941-9.373-9.373-24.568-9.373-33.941 0l-47.029 47.029-47.029-47.029c-9.373-9.373-24.568-9.373-33.941 0-9.372 9.373-9.372 24.568 0 33.941l47.029 47.029-47.029 47.029c-9.372 9.373-9.372 24.568 0 33.941 4.686 4.687 10.827 7.03 16.97 7.03s12.284-2.343 16.971-7.029l47.029-47.03 47.029 47.029c4.687 4.687 10.828 7.03 16.971 7.03s12.284-2.343 16.971-7.029c9.372-9.373 9.372-24.568 0-33.941z"/><path d="m99 160h-55c-24.301 0-44 19.699-44 44v104c0 24.301 19.699 44 44 44h55c2.761 0 5-2.239 5-5v-182c0-2.761-2.239-5-5-5z"/><path d="m280 56h-24c-5.269 0-10.392 1.734-14.578 4.935l-103.459 79.116c-1.237.946-1.963 2.414-1.963 3.972v223.955c0 1.557.726 3.026 1.963 3.972l103.459 79.115c4.186 3.201 9.309 4.936 14.579 4.936h23.999c13.255 0 24-10.745 24-24v-352.001c0-13.255-10.745-24-24-24z"/></svg>
    <svg @click="toggleSound" class="sound-icon sound-icon__volume" :class="{'sound-icon--is-visible': isSoundActive}" id="Layer" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m357.934 366.94c-5.834 0-11.682-2.114-16.3-6.391-9.726-9.005-10.31-24.19-1.304-33.916 17.843-19.269 27.67-44.354 27.67-70.633s-9.827-51.364-27.67-70.634c-9.006-9.726-8.422-24.911 1.304-33.916 9.726-9.007 24.91-8.421 33.916 1.303 26.084 28.17 40.45 64.838 40.45 103.247s-14.366 75.077-40.45 103.247c-4.73 5.107-11.164 7.693-17.616 7.693z"/><path d="m422.19 438.59c-6.154 0-12.306-2.352-16.994-7.053-9.36-9.385-9.339-24.581.046-33.94 37.891-37.788 58.758-88.075 58.758-141.597s-20.867-103.809-58.758-141.597c-9.385-9.359-9.406-24.556-.046-33.94 9.359-9.387 24.555-9.406 33.941-.047 46.987 46.859 72.863 109.216 72.863 175.584s-25.876 128.725-72.863 175.584c-4.684 4.671-10.816 7.006-16.947 7.006z"/><path d="m99 160h-55c-24.301 0-44 19.699-44 44v104c0 24.301 19.699 44 44 44h55c2.761 0 5-2.239 5-5v-182c0-2.761-2.239-5-5-5z"/><path d="m280 56h-24c-5.269 0-10.392 1.734-14.578 4.935l-103.459 79.116c-1.237.946-1.963 2.414-1.963 3.972v223.955c0 1.557.726 3.026 1.963 3.972l103.459 79.115c4.186 3.201 9.309 4.936 14.579 4.936h23.999c13.255 0 24-10.745 24-24v-352.001c0-13.255-10.745-24-24-24z"/></svg>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class SoundToggler extends Vue {
  private isSoundActive = true;

  protected created () {
    const currentAudioSetting = localStorage.getItem('sound');

    if (currentAudioSetting) {
      this.isSoundActive = (currentAudioSetting === 'true');

      this.emitSoundState();
    }
  }

  private toggleSound (): void {
    this.isSoundActive = !this.isSoundActive;

    localStorage.setItem('sound', this.isSoundActive.toString());

    this.emitSoundState();
  }

  private emitSoundState (): void {
    this.$emit('toggle-sound', this.isSoundActive);
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.sound-toggler {
  position: relative;
  height: 32px;

  .sound-icon {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2rem;
    height: auto;
    fill: var(--text-color-primary);
    opacity: 0;
    transform: translate(-50%, 0);
    cursor: pointer;
    transition: opacity 200ms ease-in-out, fill 180ms ease-in, transform 150ms ease;
    z-index: -1;

    &--is-visible {
      opacity: 1;
      z-index: 1;
    }

    &:hover {
      transform: translate(-50%, 0) scale(1.1);
    }
  }

}
</style>
