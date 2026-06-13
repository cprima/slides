export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.ignores.add("src/assets");

  return {
    pathPrefix: process.env.PATHPREFIX || "/",
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts",
    },
  };
}
