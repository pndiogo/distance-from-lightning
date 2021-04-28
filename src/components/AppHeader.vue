<template>
  <header class="header has-text-centered">
    <h1 class="title is-2 is-size-1-tablet header__title animate__animated animate__fadeInDown">Distance from Lightning <img class="header__icon" src="../assets/images/lightning.gif" alt="Thunder"></h1>
    <p class="header__text animate__animated animate__fadeIn">{{ $t('header.description') }}</p>
    <p class="header__text animate__animated animate__fadeIn">{{ $t('header.instructions') }}</p>
  </header>
</template>

<style lang="scss">
@import '@/assets/scss/main.scss';

.header {
  margin-bottom: 2rem;

  @media (min-width: $tablet) {
    margin-bottom: 3rem;
  }

  &__icon {
    width: 5rem;
    height: 5rem;
    vertical-align: middle;
  }

  &__text,
  &__title {
    color: var(--text-color-primary) !important;
    transition: var(--transition-text-color);
  }
}
</style>
