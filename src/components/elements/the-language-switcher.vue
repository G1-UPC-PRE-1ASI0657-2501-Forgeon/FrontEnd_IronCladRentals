<template>
  <div>
    <pv-selectButton v-model="selectedLanguage" :options="languageOptions" aria-label="Change language" option-label="label" @click="changeLanguage(selectedLanguage)" />
  </div>
</template>

<script>
export default {
  name: "LanguageSwitcher",
  data() {
    return {
      selectedLanguage: null,
      languageOptions: [
        {label: 'English', value: 'en'},
        {label: 'Español', value: 'es'}
      ]
    };
  },
  methods: {
    changeLanguage(selectedOption) {
      this.$i18n.locale = 'en';
      if (selectedOption.label === 'English') {
        this.$i18n.locale = 'en';
      }
      if (selectedOption.label === 'Español') {
        this.$i18n.locale = 'es';
      }
    }
  }
};
</script>

<style scoped>
</style>
