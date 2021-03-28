<template>
  <div id="app" class="app">
      <header class="has-text-centered header">
        <h1 class="title is-1 header__title">Distance from lightning 🌩️</h1>
      </header>

      <main class="container">
        <section class="has-text-centered timer">
          <h2 class="title is-2 timer__title">{{ time }} s</h2>
        </section>
        <section class="has-text-centered action">
          <button class="action__button" @click="handleClick">Start</button>
        </section>
        <section class="has-text-centered result">
          <div class="result__display">
            <h2 class="title is-2 result__title">{{ result }}</h2>
            <div class="dropdown" :class="{'is-active': isUnitsSelectOpen }">
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="toggleUnitSelect">
                  <span>{{ selectedUnit.label }}</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
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
          </div>
          <div class="result__reset">
            <button class="button" @click="reset">Reset</button>
          </div>
        </section>
      </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import _debounce from 'lodash/debounce';
import { mixin as VueTimers } from 'vue-timers';

@Component({
  mixins: [VueTimers]
})
export default class App extends Vue {
  constructor () {
    super();
    (this.$options as any).timers = {
      countTime: { time: 1000, autostart: false, repeat: true }
    };
  }

  private isUnitsSelectOpen = false;

  private units = [
    {
      id: 'km',
      label: 'Km',
      speedOfSound: 0.35
    },
    {
      id: 'miles',
      label: 'Miles',
      speedOfSound: 0.22
    }
  ];

  private result = 0;
  private selectedUnit = this.units[0];
  private time = 0;

  countTime (): void {
    ++this.time;
  }

  private handleClick () {
    if (this.isTimerRunning) {
      this.stoptTimer();
      this.calculateDistance();
    } else {
      this.reset();
      this.startTimer();
    }
  }

  private calculateDistance () {
    this.result = +(this.time * this.selectedUnit.speedOfSound).toFixed(2);
  }

  private handleResize () {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  private reset (): void {
    this.result = 0;
    this.time = 0;
  }

  private selectUnit (unit) {
    this.selectedUnit = unit;
    this.toggleUnitSelect();

    if (this.time) {
      this.calculateDistance();
    }
  }

  private startTimer (): void {
    this.$timer.start('countTime');
  }

  private stoptTimer (): void {
    this.$timer.stop('countTime');
  }

  private toggleUnitSelect (): void {
    this.isUnitsSelectOpen = !this.isUnitsSelectOpen;
  }

  get isTimerRunning () {
    return this.timers.countTime.isRunning;
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
.app {
  min-height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  min-height: calc(var(--vh, 1vh) * 100);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .header {
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .action {
    padding: 5rem 0;
    &__button {
      height: 10rem;
      width: 10rem;
      background: #000b76;
      color: #fff;
      border-radius: 50%;
      border: none;
      box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
        rgba(0, 0, 0, 0.22) 0px 15px 12px;
      cursor: pointer;
      transition: all ease 150ms;

      &:hover {
        box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
          rgba(0, 0, 0, 0.22) 0px 10px 10px;
      }

      &:focus {
        outline: 0;
      }

      &:active {
        transform: scale(0.98);
      }
    }
  }

  .result {
    &__display {
      display: flex;
      justify-content: center;
      align-items: center;

      .dropdown {
        margin: 0 0 1.4rem 1rem;
      }
    }
  }
}
</style>
