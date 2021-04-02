
<template>
  <div>
    <h2 class="timer title is-2 has-text-light">{{ formatTime(lapsedMilliseconds) }}</h2>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class StopWatch extends Vue {
  @Prop({ type: Boolean, required: true }) private resetTimer: boolean;
  @Prop({ type: Boolean, required: true }) private runTimer: boolean;

  private currentTime = Date.now();
  private interval: null | number = null;
  private intervalUpdateTime = 10;
  private pausedTime = 0;
  private pauses = [];
  private millisecondsDigitAmount = 1;
  private millisecondsSeparator = ':';
  private startTime = Date.now();
  private state = 'reset';

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

  private pause () {
    this.stopUpdateInterval();
    this.state = 'paused';
    this.pauses.push({
      pauseStart: Date.now(),
      pauseEnd: null,
      pauseLength: null
    });

    this.$emit('lapsed-seconds', this.lapsedMilliseconds / 1000);
  }

  private reset (): void {
    this.stopUpdateInterval();
    this.state = 'reset';
    this.startTime = Date.now();
    this.currentTime = Date.now();
    this.pauses = [];
    this.pausedTime = 0;
    this.$emit('timer-reseted');
  }

  private restart (): void {
    this.reset();
    this.start();
  }

  private resume (): void {
    const end = Date.now();
    const start = this.pauses[this.pauses.length - 1].pauseStart;
    const length = end - start;
    this.pausedTime += length;
    this.pauses[this.pauses.length - 1].pauseEnd = end;
    this.pauses[this.pauses.length - 1].pauseLength = length;
    this.state = 'started';
    this.startUpdateInterval();
  }

  private start (): void {
    this.startTime = Date.now();
    this.state = 'started';
    this.startUpdateInterval();
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

  @Watch('resetTimer')
  onResetTimerChanged (val: string): void {
    if (val) {
      this.reset();
    }
  }

  @Watch('runTimer')
  onRunTimerChanged (val: string): void {
    if (val) {
      this.start();
    } else {
      this.pause();
    }
  }
}
</script>

<style lang="scss" scoped>
.timer {
  font-family: sans-serif;
}
</style>
