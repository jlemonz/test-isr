// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  routeRules: {
    // all routes (by default) will be revalidated every 60 seconds, in the background
    "/": { isr: 60 },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/supabase"],
  supabase: {
    redirect: false,
    // Options
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: undefined,
      exclude: ["/", "/confirm"],
      saveRedirectToCookie: false,
    },
  },
});
