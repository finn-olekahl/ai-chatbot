const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    index: ["./src/chat.js"],
    auth: ["./src/auth.js"]
  },
  watch: true,
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
}
