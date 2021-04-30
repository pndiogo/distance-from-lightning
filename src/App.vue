<template>
  <div id="app" class="app">

    <app-settings></app-settings>

    <app-header></app-header>

    <main class="main container animate__animated animate__fadeIn">
      <section class="timer has-text-centered">
        <stop-watch :is-sound-active="isSoundActive" @timer-started="handleTimerStarted" @timer-stopped="handleTimerStopped"></stop-watch>
      </section>

      <section class="result has-text-centered">
        <div class="result__display">
          <h2 class="title is-2 result__title">{{ result }} {{ selectedUnit ? selectedUnit.abbr : '' }}</h2>
        </div>

        <div class="result__dropdown">
          <multiselect
            v-model="selectedUnit"
            :allow-empty="false"
            :custom-label="translatedLabel"
            label="label"
            openDirection="below"
            :options="units"
            :preselect-first="true"
            :searchable="false"
            :show-labels="false"
            track-by="id"
            >
          </multiselect>
        </div>
      </section>

      <sound-toggler @toggle-sound="isSoundActive = !isSoundActive"></sound-toggler>
    </main>

    <app-footer></app-footer>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppSettings from '@/components/AppSettings.vue';
import SoundToggler from '@/components/SoundToggler.vue';
import StopWatch from '@/components/StopWatch.vue';
import { Language, Unit } from '@/models/index';
import _debounce from 'lodash/debounce';
import Multiselect from 'vue-multiselect'

@Component({
  components: {
    AppFooter,
    AppHeader,
    AppSettings,
    Multiselect,
    SoundToggler,
    StopWatch
  }
})
export default class App extends Vue {
  private isSoundActive = true;
  private result = 0;
  private selectedUnit: Unit | null = null;
  private time = 0;

  get units (): Unit[] {
    return [
      {
        abbr: 'KM',
        id: 'km',
        label: `${this.$tc('units.km')}`,
        speedOfSound: 0.35
      },
      {
        abbr: `${this.$tc('units.miles')}`,
        id: 'miles',
        label: `${this.$tc('units.miles')}`,
        speedOfSound: 0.22
      }
    ];
  }

  private calculateDistance (): void {
    if (this.selectedUnit) {
      this.result = +(this.time * this.selectedUnit.speedOfSound).toFixed(2);
    }
  }

  private handleTimerStarted (): void {
    this.result = 0;
    this.time = 0;
  }

  private handleTimerStopped (seconds: number): void {
    this.time = seconds;
    this.calculateDistance();
  }

  private handleResize (): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  private translatedLabel (language: Language) {
    return this.$t(`units.${language.id}`);
  }

  created (): void {
    this.handleResize();
    window.addEventListener('resize', _debounce(this.handleResize, 200));
  }

  beforeDestroy (): void {
    window.removeEventListener('resize', _debounce(this.handleResize));
  }

  @Watch('$i18n.locale')
  onLanguageChange (): void {
    const unit = this.units.find(unit => unit.id === this.selectedUnit?.id);

    if (unit) {
      this.selectedUnit = unit;
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';

.app {
  position: relative;
  min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  min-height: calc(var(--vh, 1vh) * 100);
  max-width: 80%;
  margin: 0 auto;
  padding: 4rem 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (min-width: $tablet) {
    padding: 5rem 0;
  }

  .main {
    margin-bottom: 2rem;
    z-index: 1;

    @media (min-width: $tablet) {
      margin-bottom: 3rem;
    }

    .result {
      &__display {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2rem;
        font-family: sans-serif;
      }

      &__title {
        color: var(--text-color-primary);
        transition: var(--transition-text-color);
      }

      &__dropdown {
        max-width: 10rem;
        margin: 0 auto 2rem;
      }
    }
  }
}
</style>
