<template>
  <footer class="footer animate__animated animate__fadeIn">
    <a class="footer__link" href="https://github.com/pndiogo/distance-from-lightning" target="_blank">
      <img class="footer__logo" src="../assets/images/github.png" alt="GitHub">
    </a>
    <a class="footer__link" href="https://www.linkedin.com/in/pndiogo/" target="_blank">
      <img class="footer__logo" src="../assets/images/linkedin.png" alt="LinkedIn">
    </a>
  </footer>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/main.scss';

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
</style>
