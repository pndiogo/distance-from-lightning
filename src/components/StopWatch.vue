<template>
  <div>
    <section class="timer has-text-centered">
      <h2 class="timer__title title is-2">{{ formatTime(lapsedMilliseconds) }}</h2>
    </section>

    <section class="action has-text-centered">
      <button class="action__button title is-3" @click="handleClick">{{ !isTimerRunning ? $t('action.start') : $t('action.stop') }}</button>
      <div class="action__backlight"></div>
    </section>

    <audio ref="audioPlayer">
      <source src="../assets/sounds/click.mp3" type="audio/mpeg" preload="auto">
    </audio>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class StopWatch extends Vue {
  @Prop({ type: Boolean, required: true })
  private isSoundActive!: boolean;

  private currentTime = Date.now();
  private interval: null | number = null;
  private intervalUpdateTime = 10;
  private isTimerRunning = false;
  private pausedTime = 0;
  private pauses = [];
  private millisecondsDigitAmount = 1;
  private millisecondsSeparator = ':';
  private startTime = Date.now();
  private state = 'paused';

  get lapsedMilliseconds (): number {
    return this.currentTime - this.startTime - this.pausedTime > 0
      ? this.currentTime - this.startTime - this.pausedTime
      : 0;
  }

  destroyed (): void {
    this.stopUpdateInterval();
  }

  private formatHours (lapsed: number): number|string {
    const hrs = Math.floor((lapsed / 1000 / 60 / 60));
    return hrs >= 10 ? hrs : '0' + hrs;
  }

  private formatMinutes (lapsed: number): number|string {
    const min = Math.floor((lapsed / 1000 / 60) % 60);
    return min >= 10 ? min : '0' + min;
  }

  private formatMilliseconds (lapsed: number): number|string {
    const mil = Math.ceil(lapsed % 1000);
    if (mil < 10) {
      return '00' + mil;
    } else if (mil < 100) {
      return '0' + mil;
    } else {
      return '' + mil;
    }
  }

  private formatSeconds (lapsed: number): number|string {
    const sec = Math.floor((lapsed / 1000) % 60);
    return sec >= 10 ? sec : '0' + sec;
  }

  private formatTime (lapsed: number): string {
    if (lapsed === undefined || lapsed === null) {
      lapsed = this.lapsedMilliseconds;
    }
    let time = this.formatMinutes(lapsed) +
              ':' + this.formatSeconds(lapsed);
    if (this.millisecondsDigitAmount > 0) {
      time += this.millisecondsSeparator +
                this.formatMilliseconds(lapsed).substring(0, this.millisecondsDigitAmount);
    }
    return time;
  }

  private handleClick () {
    if (this.isSoundActive) {
      (this.$refs.audioPlayer as HTMLAudioElement).play();
    }

    this.isTimerRunning = !this.isTimerRunning;

    this.isTimerRunning ? this.start() : this.pause();
  }

  private pause () {
    this.stopUpdateInterval();
    this.state = 'paused';
    this.pauses.push({
      pauseStart: Date.now(),
      pauseEnd: null,
      pauseLength: null
    });

    this.$emit('timer-stopped', this.lapsedMilliseconds / 1000);
  }

  private start (): void {
    this.startTime = Date.now();
    this.state = 'started';
    this.startUpdateInterval();

    this.$emit('timer-started');
  }

  /** Start updating of current time */
  private startUpdateInterval (): void {
    this.interval = setInterval(this.updateCurrentTime, this.intervalUpdateTime);
  }

  /** Stop updating of current time */
  private stopUpdateInterval (): void {
    clearInterval(this.interval);
  }

  private updateCurrentTime (): void {
    this.currentTime = Date.now();
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

.timer {
  font-family: sans-serif;

  &__title {
    color: var(--text-color-primary);
    transition: var(--transition-text-color);
  }
}

.action {
  position: relative;
  margin: 2rem 0;

  @media (min-width: $tablet) {
    margin: 3rem 0;
  }

  &__button {
    position: relative;
    height: 10rem;
    width: 10rem;
    margin-bottom: 0 !important;
    background: var(--action-background);
    color: var(--action-text-color);
    text-shadow: 4px 2px 18px black;
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
    background-image: var(--action-backlight);
    transform: translate(-50%, -50%);
    pointer-events: none;
    border-radius: 50%;
    opacity: 0.53;
    filter: blur(50px);
    z-index: 1;
  }
}
</style>
