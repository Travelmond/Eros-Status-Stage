\# 02 — Configurações de Raiz + src/index.css

\> Parte 2/10. Código-fonte completo dos arquivos de configuração do projeto.

\---

\### `package.json`

\```json

{

  "name": "base44-app",

  "private": true,

  "version": "0.0.0",

  "type": "module",

  "scripts": {

​    "dev": "vite",

​    "build": "vite build",

​    "lint": "eslint . --quiet",

​    "lint:fix": "eslint . --fix",

​    "typecheck": "tsc -p ./jsconfig.json",

​    "preview": "vite preview"

  },

  "dependencies": {

​    "@base44/sdk": "^0.8.41",

​    "@base44/vite-plugin": "^1.0.30",

​    "@hello-pangea/dnd": "^17.0.0",

​    "@hookform/resolvers": "^4.1.2",

​    "@radix-ui/react-accordion": "^1.2.3",

​    "@radix-ui/react-alert-dialog": "^1.1.6",

​    "@radix-ui/react-aspect-ratio": "^1.1.2",

​    "@radix-ui/react-avatar": "^1.1.3",

​    "@radix-ui/react-checkbox": "^1.1.4",

​    "@radix-ui/react-collapsible": "^1.1.3",

​    "@radix-ui/react-context-menu": "^2.2.6",

​    "@radix-ui/react-dialog": "^1.1.6",

​    "@radix-ui/react-dropdown-menu": "^2.1.6",

​    "@radix-ui/react-hover-card": "^1.1.6",

​    "@radix-ui/react-label": "^2.1.2",

​    "@radix-ui/react-menubar": "^1.1.6",

​    "@radix-ui/react-navigation-menu": "^1.2.5",

​    "@radix-ui/react-popover": "^1.1.6",

​    "@radix-ui/react-progress": "^1.1.2",

​    "@radix-ui/react-radio-group": "^1.2.3",

​    "@radix-ui/react-scroll-area": "^1.2.3",

​    "@radix-ui/react-select": "^2.1.6",

​    "@radix-ui/react-separator": "^1.1.2",

​    "@radix-ui/react-slider": "^1.2.3",

​    "@radix-ui/react-slot": "^1.1.2",

​    "@radix-ui/react-switch": "^1.1.3",

​    "@radix-ui/react-tabs": "^1.1.3",

​    "@radix-ui/react-toast": "^1.2.2",

​    "@radix-ui/react-toggle": "^1.1.2",

​    "@radix-ui/react-toggle-group": "^1.1.2",

​    "@radix-ui/react-tooltip": "^1.1.8",

​    "@stripe/react-stripe-js": "^3.0.0",

​    "@stripe/stripe-js": "^5.2.0",

​    "@tanstack/react-query": "^5.84.1",

​    "canvas-confetti": "^1.9.4",

​    "class-variance-authority": "^0.7.1",

​    "clsx": "^2.1.1",

​    "cmdk": "^1.0.0",

​    "date-fns": "^3.6.0",

​    "embla-carousel-react": "^8.5.2",

​    "framer-motion": "^11.16.4",

​    "html2canvas": "^1.4.1",

​    "input-otp": "^1.4.2",

​    "jspdf": "^4.2.1",

​    "lodash": "^4.17.21",

​    "lucide-react": "^0.475.0",

​    "moment": "^2.30.1",

​    "next-themes": "^0.4.4",

​    "react": "^18.2.0",

​    "react-day-picker": "^8.10.1",

​    "react-dom": "^18.2.0",

​    "react-hook-form": "^7.54.2",

​    "react-hot-toast": "^2.6.0",

​    "react-leaflet": "^4.2.1",

​    "react-markdown": "^9.0.1",

​    "react-quill": "^2.0.0",

​    "react-resizable-panels": "^2.1.7",

​    "react-router-dom": "^6.26.0",

​    "recharts": "^2.15.4",

​    "sonner": "^2.0.1",

​    "tailwind-merge": "^3.0.2",

​    "tailwindcss-animate": "^1.0.7",

​    "three": "^0.171.0",

​    "vaul": "^1.1.2",

​    "zod": "^3.24.2"

  },

  "devDependencies": {

​    "@eslint/js": "^9.19.0",

​    "@types/node": "^22.13.5",

​    "@types/react": "^18.2.66",

​    "@types/react-dom": "^18.2.22",

​    "@vitejs/plugin-react": "^4.3.4",

​    "autoprefixer": "^10.4.20",

​    "baseline-browser-mapping": "^2.8.32",

​    "eslint": "^9.19.0",

​    "eslint-plugin-react": "^7.37.4",

​    "eslint-plugin-react-hooks": "^5.0.0",

​    "eslint-plugin-react-refresh": "^0.4.18",

​    "eslint-plugin-unused-imports": "^4.3.0",

​    "globals": "^15.14.0",

​    "postcss": "^8.5.3",

​    "tailwindcss": "^3.4.17",

​    "typescript": "^5.8.2",

​    "vite": "^6.1.0"

  }

}

\```

\### `vite.config.js`

\```js

import base44 from "@base44/vite-plugin"

import react from '@vitejs/plugin-react'

import { defineConfig } from 'vite'

export default defineConfig({

  logLevel: 'error',

  plugins: [

​    base44({

​      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',

​      hmrNotifier: true,

​      navigationNotifier: true,

​      analyticsTracker: true,

​      visualEditAgent: true

​    }),

​    react(),

  ]

});

\```

\### `tailwind.config.js`

\```js

/** @type {import('tailwindcss').Config} */

module.exports = {

​    darkMode: ["class"],

​    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

  theme: {

​    extend: {

​        fontFamily: {

​            mono: ['JetBrains Mono', 'Share Tech Mono', 'monospace'],

​        },

​        borderRadius: {

​            lg: 'var(--radius)',

​            md: 'calc(var(--radius) - 2px)',

​            sm: 'calc(var(--radius) - 4px)'

​        },

​        colors: {

​            background: 'hsl(var(--background))',

​            foreground: 'hsl(var(--foreground))',

​            card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },

​            popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },

​            primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },

​            secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },

​            muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },

​            accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },

​            destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },

​            border: 'hsl(var(--border))',

​            input: 'hsl(var(--input))',

​            ring: 'hsl(var(--ring))',

​            chart: {

​                '1': 'hsl(var(--chart-1))', '2': 'hsl(var(--chart-2))', '3': 'hsl(var(--chart-3))',

​                '4': 'hsl(var(--chart-4))', '5': 'hsl(var(--chart-5))'

​            },

​            neon: { cyan: '#00FFF5', pink: '#FF2D78', green: '#39FF14', purple: '#BF5FFF', gold: '#FFD700' },

​            terminal: { bg: '#0A0A0A', card: '#0D0D0D', panel: '#111111', border: '#00FFF530' }

​        },

​        keyframes: {

​            'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },

​            'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },

​            'pulse-neon': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.6 } },

​            'scan': { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } }

​        },

​        animation: {

​            'accordion-down': 'accordion-down 0.2s ease-out',

​            'accordion-up': 'accordion-up 0.2s ease-out',

​            'pulse-neon': 'pulse-neon 2s ease-in-out infinite',

​            'scan': 'scan 3s linear infinite',

​        }

​    }

  },

  plugins: [require("tailwindcss-animate")],

}

\```

\### `postcss.config.js`

\```js

export default {

  plugins: {

​    tailwindcss: {},

​    autoprefixer: {},

  },

}

\```

\### `jsconfig.json`

\```json

{

  "compilerOptions": {

​    "baseUrl": ".",

​    "paths": { "@/*": ["./src/*"] },

​    "jsx": "react-jsx",

​    "module": "esnext",

​    "moduleResolution": "bundler",

​    "lib": ["esnext", "dom"],

​    "target": "esnext",

​    "checkJs": true,

​    "skipLibCheck": true,

​    "allowSyntheticDefaultImports": true,

​    "esModuleInterop": true,

​    "resolveJsonModule": true,

​    "types": []

  },

  "include": ["src/components/**/*.js", "src/pages/**/*.jsx", "src/Layout.jsx"],

  "exclude": ["node_modules", "dist", "src/vite-plugins", "src/components/ui", "src/api", "src/lib"]

}

\```

\### `components.json`

\```json

{

  "$schema": "https://ui.shadcn.com/schema.json",

  "style": "new-york",

  "rsc": false,

  "tsx": false,

  "tailwind": { "config": "tailwind.config.js", "css": "src/index.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },

  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },

  "iconLibrary": "lucide"

}

\```

\### `eslint.config.js`

\```js

import globals from "globals";

import pluginJs from "@eslint/js";

import pluginReact from "eslint-plugin-react";

import pluginReactHooks from "eslint-plugin-react-hooks";

import pluginUnusedImports from "eslint-plugin-unused-imports";

export default [

  {

​    files: ["src/components/**/*.{js,mjs,cjs,jsx}", "src/pages/**/*.{js,mjs,cjs,jsx}", "src/Layout.jsx"],

​    ignores: ["src/lib/**/*", "src/components/ui/**/*"],

​    ...pluginJs.configs.recommended,

​    ...pluginReact.configs.flat.recommended,

​    languageOptions: {

​      globals: globals.browser,

​      parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },

​    },

​    settings: { react: { version: "detect" } },

​    plugins: { react: pluginReact, "react-hooks": pluginReactHooks, "unused-imports": pluginUnusedImports },

​    rules: {

​      "no-unused-vars": "off",

​      "react/jsx-uses-vars": "error",

​      "react/jsx-uses-react": "error",

​      "unused-imports/no-unused-imports": "error",

​      "unused-imports/no-unused-vars": ["warn", { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }],

​      "react/prop-types": "off",

​      "react/react-in-jsx-scope": "off",

​      "react/no-unknown-property": ["error", { ignore: ["cmdk-input-wrapper", "toast-close"] }],

​      "react-hooks/rules-of-hooks": "error",

​    },

  },

];

\```

\### `.gitignore`

\```text

\#env

.env

.env.*

\# Logs

/logs

*.log

npm-debug.log*

yarn-debug.log*

yarn-error.log*

pnpm-debug.log*

lerna-debug.log*

node_modules

dist

dist-ssr

*.local

\# Editor directories and files

.vscode/*

!.vscode/extensions.json

.idea

.DS_Store

*.suo

*.ntvs*

*.njsproj

*.sln

*.sw?

.env

.vite

base44/.app.jsonc

\```

\### `index.html`

\```html

<!doctype html>

<html lang="en">

  <head>

    <meta charset="UTF-8" />

​    <link rel="icon" type="image/svg+xml" href="https://base44.com/logo_v2.svg" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

​    <link rel="manifest" href="/manifest.json" />

​    <title>Base44 APP</title>

  </head>

  <body>

    <div id="root"></div>

    <script type="module" src="/src/main.jsx"></script>

  </body>

</html>

\```

\### `base44/config.jsonc`

\```jsonc

{

  "name": "New App",

  "site": {

​    "installCommand": "npm install",

​    "buildCommand": "npm run build",

​    "serveCommand": "npm run dev",

​    "outputDirectory": "./dist"

  }

}

\```

\### `README.md`

\````markdown

***\*Welcome to your Base44 project\**** 

***\*About\****

View and Edit  your app on [Base44.com](http://Base44.com) 

This project contains everything you need to run your app locally.

***\*Edit the code in your local development environment\****

Any change pushed to the repo will also be reflected in the Base44 Builder.

***\*Prerequisites:\**** 

1. Clone the repository using the project's Git URL 
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables 

\```

VITE_BASE44_APP_ID=your_app_id

VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.

VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6

VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app

\```

Run the app: `npm run dev`

***\*Publish your changes\****

Open [Base44.com](http://Base44.com) and click on Publish.

***\*Docs & Support\****

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)

\````

\### `src/index.css`

\```css

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');

@tailwind base;

@tailwind components;

@tailwind utilities;

@layer base {

  :root {

​    --background: 0 0% 5%;

​    --foreground: 180 100% 90%;

​    --card: 0 0% 7%;

​    --card-foreground: 180 100% 90%;

​    --popover: 0 0% 7%;

​    --popover-foreground: 180 100% 90%;

​    --primary: 180 100% 50%;

​    --primary-foreground: 0 0% 5%;

​    --secondary: 330 100% 55%;

​    --secondary-foreground: 0 0% 100%;

​    --muted: 0 0% 12%;

​    --muted-foreground: 180 30% 55%;

​    --accent: 180 100% 40%;

​    --accent-foreground: 0 0% 5%;

​    --destructive: 0 84% 60%;

​    --destructive-foreground: 0 0% 98%;

​    --border: 180 50% 18%;

​    --input: 0 0% 10%;

​    --ring: 180 100% 50%;

​    --radius: 0.25rem;

​    --neon-cyan: #00FFF5;

​    --neon-pink: #FF2D78;

​    --neon-green: #39FF14;

​    --neon-purple: #BF5FFF;

​    --neon-gold: #FFD700;

​    --terminal-bg: #0A0A0A;

​    --terminal-border: #00FFF540;

​    --font-mono: 'JetBrains Mono', 'Share Tech Mono', monospace;

  }

}

@layer base {

  \* {

​    @apply border-border outline-ring/50;

  }

  body {

​    @apply bg-background text-foreground;

​    font-family: var(--font-mono);

  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }

  ::-webkit-scrollbar-track { background: #0A0A0A; }

  ::-webkit-scrollbar-thumb { background: #00FFF540; border-radius: 2px; }

  ::-webkit-scrollbar-thumb:hover { background: #00FFF5AA; }

}

/* CRT scanline overlay */

.crt-overlay { position: relative; }

.crt-overlay::before {

  content: '';

  position: absolute;

  inset: 0;

  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 245, 0.015) 2px, rgba(0, 255, 245, 0.015) 4px);

  pointer-events: none;

  z-index: 1;

}

/* Neon glow effects */

.neon-cyan { color: #00FFF5; text-shadow: 0 0 8px #00FFF5, 0 0 20px #00FFF550; }

.neon-pink { color: #FF2D78; text-shadow: 0 0 8px #FF2D78, 0 0 20px #FF2D7850; }

.neon-green { color: #39FF14; text-shadow: 0 0 8px #39FF14, 0 0 20px #39FF1450; }

.neon-gold { color: #FFD700; text-shadow: 0 0 8px #FFD700, 0 0 20px #FFD70050; }

.neon-purple { color: #BF5FFF; text-shadow: 0 0 8px #BF5FFF, 0 0 20px #BF5FFF50; }

.border-neon-cyan { border-color: #00FFF540; }

.border-neon-pink { border-color: #FF2D7840; }

.bg-terminal { background: #0A0A0A; }

.bg-terminal-card { background: #0D0D0D; }

.bg-terminal-panel { background: #111111; }

/* Progress bar glow */

.progress-fill-cyan { background: linear-gradient(90deg, #00FFF5, #00BCD4); box-shadow: 0 0 6px #00FFF5, 0 0 12px #00FFF550; }

.progress-fill-pink { background: linear-gradient(90deg, #FF2D78, #FF6B9D); box-shadow: 0 0 6px #FF2D78, 0 0 12px #FF2D7850; }

.progress-fill-green { background: linear-gradient(90deg, #39FF14, #7FFF00); box-shadow: 0 0 6px #39FF14, 0 0 12px #39FF1450; }

.progress-fill-gold { background: linear-gradient(90deg, #FFD700, #FFA500); box-shadow: 0 0 6px #FFD700, 0 0 12px #FFD70050; }

.progress-fill-purple { background: linear-gradient(90deg, #BF5FFF, #8B5CF6); box-shadow: 0 0 6px #BF5FFF, 0 0 12px #BF5FFF50; }

/* Terminal box borders */

.terminal-box { border: 1px solid #00FFF530; background: #0D0D0D; position: relative; }

.terminal-box::before {

  content: '';

  position: absolute;

  inset: 0;

  border: 1px solid transparent;

  background: linear-gradient(135deg, #00FFF510, transparent 50%) border-box;

  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);

  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);

  -webkit-mask-composite: destination-out;

  mask-composite: exclude;

  pointer-events: none;

}

/* Glitch animation */

@keyframes glitch {

  0% { transform: translate(0); }

  20% { transform: translate(-2px, 2px); }

  40% { transform: translate(2px, -2px); }

  60% { transform: translate(-1px, 1px); }

  80% { transform: translate(1px, -1px); }

  100% { transform: translate(0); }

}

.glitch:hover { animation: glitch 0.3s ease-in-out; }

/* Blink cursor */

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.cursor-blink { animation: blink 1s step-end infinite; }

/* Fade in */

@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }

/* Tab active glow */

.tab-active { background: #00FFF510; border-bottom: 2px solid #00FFF5; color: #00FFF5; text-shadow: 0 0 8px #00FFF5; }

/* Matrix rain text bg */

.matrix-text-bg { background: linear-gradient(180deg, #00FFF508 0%, transparent 100%); }

/* Mermaid code block styles */

.mermaid-block { background: #0D0D0D; border: 1px solid #00FFF520; border-radius: 4px; padding: 16px; overflow-x: auto; font-family: var(--font-mono); font-size: 12px; color: #00FFF5; white-space: pre; }

\```

\---

**Próximo: `docs/03-PAGES.md` — `src/pages/` (Terminal, Demo, SRS).**