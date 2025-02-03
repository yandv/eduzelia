import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/lib/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    themes: ["nord"],
  },
  plugins: [
    require('daisyui'),
  ],
} satisfies Config;
