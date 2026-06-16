
# 🎨 NeoPop-Gradation Lab

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://yuyudaodevlab.github.io/NeoPop-GradationLab/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## 📖 What the project does

**NeoPop-Gradation Lab** is an interactive, highly-visual web application that generates vibrant, Neo-Pop inspired CSS color gradients. By selecting a single base color, the application's underlying engine mathematically calculates harmonious Hue, Saturation, and Lightness (HSL) shifts to curate beautiful, smooth gradients. 

The application categorizes these palettes into three distinct themes:
* **鮮やかポップ (Vivid Pop)**: High saturation, bright and energetic.
* **鮮やかクール (Vivid Cool)**: Shifted into the cool spectrum for a sleek, modern look.
* **アースカラー (Earth Colors)**: Misted, mid-tone palettes with reduced saturation.

**Live Demo:** [https://yuyudaodevlab.github.io/NeoPop-GradationLab/](https://yuyudaodevlab.github.io/NeoPop-GradationLab/)

## ✨ Why the project is useful

Whether you are a developer, UI/UX designer, or digital artist, creating the perfect CSS gradient from scratch can be tedious. This tool accelerates the design process by offering:

* **⚡ Instant Palette Generation**: Automatically extrapolates 9 unique gradients from a single hex code input.
* **📋 One-Click Clipboard Copy**: Click any liquid blob to instantly copy its `linear-gradient` CSS rule to your clipboard.
* **🎲 Interactive & Accessible**: Press the `Spacebar` to quickly randomize the color palette. 
* **🌊 Fluid Visual Feedback**: Utilizes Framer Motion and custom CSS math to animate liquid blob shapes with dynamic border-radii, making the selection process visually engaging.
* **🏷️ Cute Naming Engine**: Each gradient is programmatically assigned a cute, descriptive Japanese name (e.g., "ぷにぷに・ピーチ" or "サイバー・ミント") based on its Hue value.

## 🚀 How users can get started

### Prerequisites
Ensure you have **Node.js** (v20 or higher) and `npm` installed on your local machine. 

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yuyudaodevlab/NeoPop-GradationLab.git](https://github.com/yuyudaodevlab/NeoPop-GradationLab.git)
   cd NeoPop-GradationLab

```

2. Install the project dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```


4. Open your browser and navigate to `http://localhost:3000`.

### Usage

* **Select a base color**: Click the palette icon `🎨` or type a Hex code into the input field.
* **Randomize**: Click the `🎲 おまかせ` button or simply press the **Spacebar** on your keyboard.
* **Export**: Hover over any generated color blob and click to copy the background CSS property directly to your clipboard.

## 🆘 Where users can get help

If you encounter any bugs, have feature requests, or need general support:

* **Issue Tracker**: Please open an issue on our [GitHub Issues](https://github.com/yuyudaodevlab/NeoPop-GradationLab/issues) page.
* **Documentation**: For Next.js specific framework changes utilized in this project (v16.2.9), refer to the Next.js official documentation or the internal `node_modules/next/dist/docs/` guide as noted in our repository.

## 🤝 Who maintains and contributes

This project is actively maintained by **yuyudaodevlab**.

We welcome contributions from the open-source community! If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

*Note for Contributors: Please review `AGENTS.md` and `CLAUDE.md` in the repository root for repository-specific AI-assisted development rules and Next.js versioning notices before submitting large structural changes.*

```

---

### Key Takeaways
* **Clear Purpose**: The README immediately establishes the project's identity, live URL, and core functionality right at the top.
* **Structured Accessibility**: Adhering to the *What, Why, How, Where, Who* model ensures potential contributors and users can parse the document rapidly.
* **Technical Accuracy**: The instructions strictly align with the `package.json` scripts (`dev`, `build`, `start`, `lint`) and correctly recognize the Next.js 16 / React 19 stack.

### Architecture Analysis (Pros & Cons)
* **Pros**: Utilizing Next.js App Router alongside Tailwind CSS v4 and Framer Motion offers excellent developer ergonomics, high performance out-of-the-box, and a highly polished, interactive UI. The mathematical color generation (`@/lib/colors.ts`) abstracts complex logic cleanly away from the UI components.
* **Cons**: Depending heavily on client-side state (`"use client"`) for the primary page (`page.tsx`) sacrifices some Server-Side Rendering (SSR) SEO benefits. Additionally, Framer Motion can add a non-trivial amount of JavaScript bundle size to the initial page load.

```
