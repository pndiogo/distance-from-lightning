<template>
  <header class="header has-text-centered">
    <h1 class="title is-2 is-size-1-tablet header__title has-text-light animate__animated animate__fadeInDown">Distance from Lightning <img class="thunder" src="../assets/images/lightning.gif" alt="Thunder"></h1>
    <p class="has-text-light animate__animated animate__fadeIn">Convenient and simple lightning distance calculator.</p>
    <p class="has-text-light animate__animated animate__fadeIn">Tap the button once to start the timer and a second time to stop and instantly calculate the approximate distance in miles or kilometers.</p>
  </header>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

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
</style>
