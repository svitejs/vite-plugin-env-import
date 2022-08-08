# @svitejs/vite-plugin-env-import

Import env vars

## Installation

```bash
pnpm i -D @svitejs/vite-plugin-env-import
```

## Usage

### add plugin to vite config

```ts
// vite config
import { defineConfig } from 'vite';
import { envImport } from '@svitejs/vite-plugin-env-import';

export default defineConfig({
	plugins: [envImport()]
});
```

### import from virtual modules

#### virtual:env

Contains all env variables that do not start with a public prefix with their value as static strings.

```js
import { SUPER_SECRET } from 'virtual:env';
```

> imports from 'virtual:env' only work in ssr code, if you do this in client code, an error is thrown

##### virtual:env:runtime

Same as `virtual:env` but instead of static value replacement at buildtime, it uses `process.env.XXX` so the actual runtime value at time of ssr is used

#### virtual:env:public

Contains all env variables that start with a public prefix with their value as static strings.

```js
import { VITE_TITLE } from 'virtual:env:public';
```

> imports from 'virtual:env:public' work in client and ssr code

##### virtual:env:public:runtime

Same as `virtual:env:public` but instead of static value replacement at buildtime, it uses `process.env.XXX` so the actual runtime value at time of ssr is used

> imports from 'virtual:env:public:runtime' only work in ssr code, if you do thing in client code, an error is thrown
>
> This is due to the fact that clientside code cannot access the ssr runtime env

## License

[MIT](./LICENSE)
