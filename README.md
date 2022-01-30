<img align="center" src="./images/banner.png" alt="Syncroc Banner" style="width:100%;height:100%"/>

<p align="center">Watch videos + listen to music with your favourite creators and support the original work.</p>

## 🎥 Demo

[![Sycroc Demo](https://img.youtube.com/vi/Ntz68zOcHBU/0.jpg)](http://www.youtube.com/watch?v=Ntz68zOcHBU)

## 💾 Install

Syncroc can be installed through the [GitHub build](https://github.com/alexandre-lavoie/syncroc/releases/tag/v0) or build using the instructions below.

## 🔗 Depedencies

- [NodeJS 15+](https://nodejs.org/en/)
    - [npm 7+](https://yarnpkg.com/)

## 🔨 Build

Install the depedencies:

```bash
npm install
```

Build the plugin (the contents will be in `/packages/plugin/dist`):

```bash
npm run build-plugin
```

Running the backend:

```bash
npm run start-backend
```

## 🗞 Project

This project is structure as a monorepo. There are currently 2 major components: plugin and backend. The plugin is made up of custom APIs to fetch content on the webpage and propagate the view across the app. The backend allows to share clips across clients, which should eventually use auth to prevent malicious clips.

## 👥 Contribution

This project was created by and is maintained by [Alexandre Lavoie](https://github.com/alexandre-lavoie). If you are interested in contributing to the project, feel free to communicate with the maintainer and/or make a PR!

## 🏆 Competition

This project was designed and prototyped during [ConUHacks VI](https://conuhacks.io/).

## 📃 License

`Syncroc` is free and open-source software licensed under the [MIT License](./LICENSE).
