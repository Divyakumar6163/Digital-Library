const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {
      screen: {
        // flexRow: "640px",
      },
    },
  },
  plugins: [require("flowbite/plugin"), flowbite.plugin()],
};
