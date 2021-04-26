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
          <h2 class="title is-2 result__title">{{ result }} {{ selectedUnit.abbr }}</h2>
        </div>

        <div class="dropdown result__dropdown" :class="{'is-active': isUnitsSelectOpen }" v-on-clickaway="closeUnitSelect">
          <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="toggleUnitSelect">
              <span>{{ selectedUnit.label }}</span>
              <span class="icon is-small">
                <svg class="svg-inline--fa fa-angle-down fa-w-10" aria-hidden="true" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content" v-for="unit in units" :key="unit.id" :class="{ 'is-active': selectedUnit.id === unit.id}">
              <a  class="dropdown-item" :class="{ 'is-active': selectedUnit.id === unit.id}" @click="selectUnit(unit)">
                {{ unit.label }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <sound-toggler @toggle-sound="isSoundActive = !isSoundActive"></sound-toggler>
    </main>

    <app-footer></app-footer>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import _debounce from 'lodash/debounce';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import AppSettings from './components/AppSettings.vue';
import SoundToggler from './components/SoundToggler.vue';
import StopWatch from './components/StopWatch.vue';
import { directive as onClickaway } from 'vue-clickaway';

interface Unit {
  abbr: string;
  id: string;
  label: string;
  speedOfSound: number;
}

@Component({
  directives: {
    onClickaway
  },
  components: {
    AppFooter,
    AppHeader,
    AppSettings,
    SoundToggler,
    StopWatch
  }
})
export default class App extends Vue {
  private isSoundActive = true;
  private isUnitsSelectOpen = false;
  private result = 0;
  private units: Unit[] = [
    {
      abbr: 'km',
      id: 'km',
      label: 'Kilometers',
      speedOfSound: 0.35
    },
    {
      abbr: 'miles',
      id: 'miles',
      label: 'Miles',
      speedOfSound: 0.22
    }
  ];

  private selectedUnit: Unit = this.units[0];
  private time = 0;

  private calculateDistance () {
    this.result = +(this.time * this.selectedUnit.speedOfSound).toFixed(2);
  }

  private closeUnitSelect () {
    if (this.isUnitsSelectOpen) {
      this.isUnitsSelectOpen = false;
    }
  }

  private handleTimerStarted () {
    this.result = 0;
    this.time = 0;
  }

  private handleTimerStopped (seconds: number) {
    this.time = seconds;
    this.calculateDistance();
  }

  private handleResize () {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  private selectUnit (unit: Unit) {
    this.selectedUnit = unit;
    this.toggleUnitSelect();

    if (this.time) {
      this.calculateDistance();
    }
  }

  private toggleUnitSelect (): void {
    this.isUnitsSelectOpen = !this.isUnitsSelectOpen;
  }

  created (): void {
    this.handleResize();
    window.addEventListener('resize', _debounce(this.handleResize, 200));
  }

  beforeDestroy (): void {
    window.removeEventListener('resize', _debounce(this.handleResize));
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
        margin-bottom: 2rem;

        .dropdown-trigger[disabled] {
          opacity: .5;
          pointer-events: none;
          cursor: not-allowed;
        }

        .dropdown-content.is-active {
          background: #cecece;
        }

        .dropdown-content + .dropdown-content {
          margin-top: .25rem;
        }

        .dropdown-item {
          &.is-active {
            background: #cecece;
            color: #4a4a4a;
          }

          &:hover:not(.is-active) {
            background: #cecece;
          }
        }

        .icon {
          > svg {
            display: inline-block;
            width: .625em;
            height: 1em;
            max-width: 100%;
            max-height: 100%;
            margin-left: .5rem;
            font-size: inherit;
            overflow: visible;
            vertical-align: -.125em;
          }
        }

        &.is-active {
          .icon {
            > svg {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
  }
}
</style>
