# @mosi/alpine-manage

> A lightweight Alpine.js plugin to safely access and validate `x-data` via TypeScript and Zod.

## ✨ Features

- 🔍 Find DOM elements by ID
- ⚠️ Throws errors for missing elements or invalid data
- 🔐 Strongly typed access to `x-data` using Zod
- 📦 Easy to integrate into Alpine.js

## 🚀 Installation

```bash
npm install @mosi/alpine-manage zod
```

## 📦 Usage

### 1. Register the Plugin

```ts
import Alpine from "alpinejs";
import managePlugin from "@mosi/alpine-manage";

Alpine.plugin(managePlugin);
Alpine.start();
```

### 2. Use `$manage` in Your Alpine App

**HTML**

```html
<div id="user" x-data='{"name": "Jane", "age": 30}'></div>
```

**JavaScript**

```ts
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const user = Alpine.magic.manage("user", userSchema);

console.log(user.name); // "Jane"
```

## 🧪 TypeScript Support

The plugin is fully typed. Pass a `ZodSchema<T>` and get a strongly typed result back.

## 📕 API

```ts
$manage<T>(elementId: string, schema: ZodSchema<T>): T
```

- **elementId**: The DOM element's ID.
- **schema**: A Zod schema for validating and typing the x-data content.

## 🛠 Error Handling

The plugin throws clear, helpful errors for:

- Missing DOM elements
- Missing `x-data` attributes
- Malformed JSON
- Zod validation failures

## 🧪 Run Tests

```bash
npm install
npm test
```

---

## 📄 License

MIT – see [LICENSE](./LICENSE)
