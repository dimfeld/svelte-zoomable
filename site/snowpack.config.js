/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
    '../src': { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-svelte', '@snowpack/plugin-dotenv'],
  install: [
    /* ... */
  ],
  installOptions: {
    rollup: {
      dedupe: ['svelte'],
    },
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
};
