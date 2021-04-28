<template>
  <div class="language-toggler">
    <multiselect
      v-model="selectedLanguage"
      :allow-empty="false"
      label="label"
      openDirection="below"
      :options="languages"
      :searchable="false"
      :show-labels="false"
      track-by="id"
      @select="languageSelected"
      >
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Language } from '@/models/index';
import Multiselect from 'vue-multiselect'

@Component({
  components: {
    Multiselect
  }
})
export default class LanguageToggler extends Vue {
  private languages = [
    {
      id: 'de',
      label: 'DE'
    },
    {
      id: 'en',
      label: 'EN'
    },
    {
      id: 'es',
      label: 'ES'
    },
    {
      id: 'fr',
      label: 'FR'
    },
    {
      id: 'it',
      label: 'IT'
    },
    {
      id: 'pt',
      label: 'PT'
    }
  ];

  private selectedLanguage: Language | undefined = '';

  protected created () {
    const language = this.languages.find(language => { return language.id === this.$i18n.locale });

    if (language) {
      this.selectedLanguage = language;
    }
  }

  private languageSelected (language: Language) {
    this.$i18n.locale = language.id;
    localStorage.setItem('lang', language.id);
  }
}
</script>

<style lang="scss">
.language-toggler {
  min-width: 5rem;

  .multiselect {
    min-height: 32px;

    &__select {
      height: 31px;
      padding-top: 4px;

      &::before {
        top: 68%;
      }
    }

    &__tags {
      min-height: 32px;
      padding-top: 5px;
    }

    &__single {
      margin-bottom: 0;
    }
  }
}
</style>
