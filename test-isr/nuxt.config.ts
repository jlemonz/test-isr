// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  routeRules: {
    // revalidated every 60 seconds, in the background
    "/**": { isr: 60 },
    // this page will be always fresh
    "/dynamic": { isr: false },
    // this page will be generated on demand and then cached permanently
    "/static": { isr: true },
    // this page is generated at build time and cached permanently
    "/prerendered": { prerender: true },
    // you can do lots more with route rules too!
    "/redirect": { redirect: "/static" },
    "/headers": { headers: { "x-magic-of": "nuxt and vercel" } },
    "/spa": { ssr: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  // modules: ["@nuxtjs/supabase"],
  // supabase: {
  //   redirect: false,
  //   // Options
  //   redirectOptions: {
  //     login: "/login",
  //     callback: "/confirm",
  //     include: undefined,
  //     exclude: ["/", "/confirm"],
  //     saveRedirectToCookie: false,
  //   },
  // },
});
