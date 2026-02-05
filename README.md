# alpine-zod-manage

> A lightweight Alpine.js plugin to safely access and validate `x-data` via TypeScript and Zod.

## ✨ Features

- 🔍 Find DOM elements with query selector (ID, class or other selectors)
- ⚠️ Throws errors for missing elements or invalid data
- 🔐 Strongly typed access to `x-data` using Zod
- 📦 Easy to integrate into Alpine.js

## 🚀 Installation

```bash
npm install @mosi/alpine-zod-manage zod
```

## 📦 Usage

### 1. Register the Plugin

```ts
import Alpine from "alpinejs";
import managePlugin from "@mosi/alpine-zod-manage";

Alpine.plugin(managePlugin);
Alpine.start();
```

### 2. Use `$manage` in Your Alpine App

**HTML**

```html
<!-- In traditional way -->
<div id="user" x-data='{ "name": "Jane", "age": 30, "schema": z.object({ "name": z.string(), "age": z.number() }) }'>
  <p x-effect='console.log($manage("#user", schema)'></p>
</div>
```

**JavaScript**

```ts
// In an alpine data function
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

export function myData() {
  return {
    init() {
      const userData = this.$manage("#user", userSchema);
      console.log(userData);
    }
  }
}

// Don't forget to plug the function data to Alpine.js
Alpine.data("myData", myData);
```

## 🧪 TypeScript Support

The plugin is fully typed. Pass a `ZodSchema<T>` and get a strongly typed result back.

## 📕 API

```ts
$manage<T>(queryElement: string, schema: ZodSchema<T>): T
```

- **queryElement**: The DOM query element (ID, class or other elector combination).
- **schema**: A Zod schema for validating and typing the x-data content.

## 🛠 Error Handling

The plugin throws clear, helpful errors for:

- Missing DOM elements
- Missing `x-data` attributes
- Zod validation failures

## 🧪 Run Tests

```bash
npm install
npm test
```

---

## 📄 License

MIT – see [LICENSE](./LICENSE)
