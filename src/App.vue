<template>
  <div id="app" class="app">

      <header class="header has-text-centered">
        <h1 class="title is-2 is-size-1-tablet header__title has-text-light animate__animated animate__fadeInDown">Distance from Lightning <img class="thunder" src="./assets/images/lightning.gif" alt="Thunder"></h1>
        <p class="has-text-light animate__animated animate__fadeIn">Simple lightning distance calculator.</p>
        <p class="has-text-light animate__animated animate__fadeIn">Tap the button once to start the timer and a second time to stop and calculate the approximate distance in miles or kilometers.</p>
      </header>

      <main class="main container animate__animated animate__fadeIn">
        <section class="timer has-text-centered">
          <stop-watch :reset-timer="resetTimer" :run-timer="runTimer" @lapsed-seconds="handleLapsedSeconds" @timer-reseted="handleReset"></stop-watch>
        </section>

        <section class="action has-text-centered">
          <button class="action__button title is-3" @click="handleClick">{{ !runTimer ? 'Start' : 'Stop' }}</button>
          <div class="action__backlight"></div>
        </section>

        <section class="result has-text-centered">
          <div class="result__display">
            <h2 class="title is-2 has-text-light result__title">{{ result }} {{ selectedUnit.abbr }}</h2>
          </div>

          <div class="dropdown result__dropdown" :class="{'is-active': isUnitsSelectOpen }" v-on-clickaway="closeUnitSelect">
            <div class="dropdown-trigger" :disabled="runTimer">
              <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="toggleUnitSelect">
                <span>{{ selectedUnit.label }}</span>
                <span class="icon is-small">
                  <svg class="svg-inline--fa fa-angle-down fa-w-10" aria-hidden="true" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content" v-for="unit in units" :key="unit.id">
                <a  class="dropdown-item" :class="{ 'is-active': selectedUnit.id === unit.id}" @click="selectUnit(unit)">
                  {{ unit.label }}
                </a>
              </div>
            </div>
          </div>

        <!--   <div class="result__reset">
            <button class="button is-light is-outlined" :disabled="runTimer" @click="reset">Reset</button>
          </div> -->
        </section>
      </main>

      <footer class="footer animate__animated animate__fadeIn">
        <a class="footer__link" href="https://github.com/pndiogo/distance-from-lightning" target="_blank">
          <img class="footer__logo" src="../src/assets/images/github.png" alt="GitHub">
        </a>
        <a class="footer__link" href="https://www.linkedin.com/in/pndiogo/" target="_blank">
          <img class="footer__logo" src="../src/assets/images/linkedin.png" alt="LinkedIn">
        </a>
      </footer>

      <audio ref="audioPlayer">
        <source src="../src/assets/sounds/click.mp3" type="audio/mpeg" preload="auto">
      </audio>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import _debounce from 'lodash/debounce';
import StopWatch from './components/StopWatch.vue'
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
    StopWatch
  }
})
export default class App extends Vue {
  private isUnitsSelectOpen = false;
  private resetTimer = false;
  private result = 0;
  private runTimer = false;
  private units: Unit[] = [
    {
      abbr: 'Km',
      id: 'km',
      label: 'Kilometers',
      speedOfSound: 0.35
    },
    {
      abbr: 'Miles',
      id: 'miles',
      label: 'Miles',
      speedOfSound: 0.22
    }
  ];

  private selectedUnit: Unit = this.units[0];
  private time = 0;

  private handleClick () {
    (this.$refs.audioPlayer as HTMLAudioElement).play();

    if (this.runTimer) {
      this.runTimer = false;
    } else {
      this.reset();
      this.runTimer = true;
    }
  }

  private calculateDistance () {
    this.result = +(this.time * this.selectedUnit.speedOfSound).toFixed(2);
  }

  private closeUnitSelect () {
    if (this.isUnitsSelectOpen) {
      this.isUnitsSelectOpen = false;
    }
  }

  private handleLapsedSeconds (seconds: number) {
    this.time = seconds;
    this.calculateDistance();
  }

  private handleReset () {
    this.resetTimer = false;
  }

  private handleResize () {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  private reset () {
    this.result = 0;
    this.time = 0;
    this.resetTimer = true;
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

body {
  background-color: #010d1a;
  background-image: linear-gradient(180deg, #070336, #010d1a);
}

.app {
  min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  min-height: calc(var(--vh, 1vh) * 100);
  max-width: 80%;
  margin: 0 auto;
  padding: 2rem 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (min-width: $tablet) {
    padding: 5rem 0;
  }

  .header {
    margin-bottom: 2rem;

    @media (min-width: $tablet) {
      margin-bottom: 5rem;
    }

    .thunder {
      width: 5rem;
      height: 5rem;
      vertical-align: middle;
    }
  }

  .main {
    margin-bottom: 2rem;

    @media (min-width: $tablet) {
      margin-bottom: 5rem;
    }

    .action {
      position: relative;
      margin: 3rem 0;

      @media (min-width: $tablet) {
        margin: 5rem 0;
      }

      &__button {
        position: relative;
        height: 10rem;
        width: 10rem;
        margin-bottom: 0 !important;
        background: linear-gradient(131deg, #af40ff, #5b42f3 50%, #00ddeb);
        color: #fff;
        border-radius: 50%;
        border: none;
        box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
        cursor: pointer;
        transition: all ease 150ms;
        z-index: 2;
        -webkit-tap-highlight-color: transparent;

        &:hover {
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
          transform: scale(1.1);
        }

        &:focus {
          outline: 0;
        }

        &:active {
          transform: scale(0.98);
        }
      }

      &__backlight {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 12rem;
        width: 12rem;
        background-image: linear-gradient(131deg, #af40ff, #5b42f3 50%, #00ddeb);
        transform: translate(-50%, -50%);
        pointer-events: none;
        border-radius: 50%;
        opacity: 0.53;
        filter: blur(50px);
        z-index: 1;
      }
    }

    .result {
      &__display {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 2rem;
        font-family: sans-serif;
      }

      &__dropdown {
        margin-bottom: 1.5rem;

        .dropdown-trigger[disabled] {
          opacity: .5;
          pointer-events: none;
          cursor: not-allowed;
        }

        .dropdown-content + .dropdown-content {
          margin-top: .25rem;
        }

        .dropdown-item {
          &.is-active {
            background: linear-gradient(131deg, #af40ff, #5b42f3 50%, #00ddeb);
          }

          &:hover:not(.is-active) {
            color: #fff;
            background: #010d1a;
            background-image: linear-gradient(180deg, #070336, #010d1a);
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

  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    background-color: transparent;

    &__link {
      padding: 1rem;
    }

    &__logo {
      display: block;
      width: 4rem;

      @media (min-width: $tablet) {
        width: 5rem;
      }
    }
  }
}
</style>
