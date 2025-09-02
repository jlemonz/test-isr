// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  routeRules: {
    // all routes (by default) will be revalidated every 60 seconds, in the background
    "/**": { isr: 60 },
  },
});
