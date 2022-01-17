export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'TestJob',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
      '@/assets/css/main.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
      '~/plugins/validateEmail.js',
      '~/plugins/humanFileSize.js',
      '~/plugins/stripTags.js',
      '~/plugins/dateToString.js',
      '~/plugins/timeConverter.js',
      { src: '~/plugins/tiny', mode: 'client' },
      { src: '~/plugins/inputMask', mode: 'client' },
      { src: '~/plugins/timePicker', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['nuxt-i18n', {
        locales: [
         {
            name: 'English',
            code: 'en',
            iso: 'en',
            file: 'en'
          },
          {
            name: 'Russian',
            code: 'ru',
            iso: 'ru',
            file: 'ru'
          },
        ],
        langDir: 'locales/',
        defaultLocale: 'ru',
      }]
  ],
  /*
   ** proxy
   */
  proxy: {
    "/api": {
        target: "http://127.0.0.1:8001/api/",
        pathRewrite: { "^/api/": "" }
    }
  },
  
  axios: {
    baseURL: 'http://127.0.0.1:8001/',
    proxy: false
  },
  
  env: {
     host: 'http://127.0.0.1:8001/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
      vendor: ["axios"]
  },
  
  //target: 'static' // default is 'server'
}

