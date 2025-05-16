# Tonnetz Webapp

A browser-based interactive music theory tool for visualizing triadic transformations on a Tonnetz grid.

🔗 **Live site**: [amusictheorist-tonnetz-webapp.netlify.app](https://amusictheorist-tonnetz-webapp.netlify.app/)

---

## 🎯 What It Does

This web app visualizes a tiling of major and minor triads based on PLR voice-leading transformations. It supports:

- Interactive navigation on a triangular grid of chords
- Zooming and panning
- Selection highlighting
- “Draw Path” mode: trace a path on the Tonnetz by selecting triangles
- “Shortest Path” mode: visualize the most efficient PLR transformation sequence between two triads
- Handy legend and modal info display

---

## 🧭 How to Use

- Click on any triangle to select a chord
- Use the zoom slider and drag the grid to explore
- Activate **Draw Path mode** from the controls panel to find the shortest PLR path between two chords
- Activate **Shortest Path mode** from the controls panel to find the shortest PLR path between two chords
- Use the legend and modal windows to understand color mappings and navigation options

This tool is designed primarily for music theorists, composers, and students interested in transformational theory and the Tonnetz.

---

## 🔍 Technologies Used

- **React + TypeScript**
- **CSS** for UI styling
- **Custom Canvas rendering** for efficient grid drawing
- Hosted on **Netlify**

---

## 💡 Inspiration

This project is inspired by transformational theory, particularly the PLR operations in neo-Riemannian theory. The triangle grid presents an infinite (wrapped) Tonnetz for exploring tonal space interactively. It is meant as an interactive approach for visualizing and researching transformations on the Tonnetz. Future implementations will allow exporting images for creating figures ad charts.

---

## 🙋‍♂️ Maintainer

Developed by [@amusictheorist](https://github.com/amusictheorist).  
This is a personal project — feedback or suggestions are always welcome via GitHub issues.

---

## 📝 License

[MIT License](./LICENSE)