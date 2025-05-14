import type { Alpine } from "alpinejs";
import { z } from "zod";

/**
 * This plugin safely accesses and validates `x-data` via TypeScript and Zod.
 * It's intended to be used for a specific element as Alpine.js can only retrieve `x-data` from parent elements.
 * So, with $manage magic, you can retrieve `x-data` from any element as long as query element has `x-data` and is in the DOM.
 * @example
 * const user = $manage("#user", z.object({name: z.string(), age: z.number()}));
 * console.log(user.name);
 */
export default function (Alpine: Alpine) {
  Alpine.magic("manage", () => {
    return <T extends Record<string, any>>(
      queryElement: string,
      schema: z.ZodType<T>
    ): T => {
      const element = document.querySelector(
        queryElement
      ) as HTMLElement | null;
      if (!element) {
        throw new Error(`Query element ${queryElement} not found.`);
      }
      if (!element.getAttribute("x-data")) {
        throw new Error(
          `Query element ${queryElement} does not have x-data attribute.`
        );
      }
      const result = Alpine.$data(element) as T;
      console.log({ result, element: element.getAttribute("x-data") });
      const parsed = schema.safeParse(result);
      console.log({ error: parsed.error?.format() });
      if (!parsed.success) {
        throw new Error(
          `Validation failed for element "${queryElement}": ${JSON.stringify(
            parsed?.error.format(),
            null,
            2
          )}`
        );
      }

      const proxy = new Proxy(Object.seal(parsed.data), {
        get(target, key) {
          return target[key as keyof T];
        },
        set(target, key, value) {
          target[key as keyof T] = value;
          result[key as keyof T] = value;
          return true;
        },
      });

      return proxy;
    };
  });
}
