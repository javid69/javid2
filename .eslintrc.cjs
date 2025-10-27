module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "next/typescript", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "lf",
      },
    ],
  },
  ignorePatterns: [".next/", "out/", "build/", "node_modules/", "next-env.d.ts"],
};
