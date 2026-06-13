Reveal.initialize({
  hash: true,
  history: true,
  controls: true,
  progress: true,
  transition: "none",
  width: 1920,
  height: 1080,

  cpmBroadcastdesign: {
    defaults: {
      tickertext: "Christian Prior-Mamulyan · License CC BY 4.0",
      visibility: "visible",
    },
  },

  plugins: [
    RatioSlider,
    cpmFooter,
    cpmBroadcastdesign,
    cpmCarousel,
    CustomSlideContent,
    JeopardyPlugin,
  ],
});
