<h1 align="center">
 Smart Search App
</h1>

## Live Demo

<a href="https://smart-search-app.netlify.app/" target="_blank">Smart Search App</a>

## Tech Stack

- Typesense
- NextJS
- Typescript
- Sass
- TailwindCSS

## Project Setup

```shell
git clone https://github.com/jowiejurado/smart-search.git

cd smart-search

npm install

```

Set env variables to point the app to the Typesense Cluster

```env
NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY=xxx
NEXT_PUBLIC_TYPESENSE_HOST=xxx.typesense.net
NEXT_PUBLIC_TYPESENSE_PORT=443
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
TYPESENSE_ADMIN_API_KEY=xxx
```

Import data/collections to typesense server

```shell
npm run import:typesense
```

Start the dev web app

```shell
npm run dev
```

Open http://localhost:3000 to see the app ✌️
