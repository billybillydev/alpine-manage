import { describe, expect, test } from "vitest";
import alpineManagerPlugin from "../src";
import { z } from "zod";

// Mocks Alpine
function mockAlpine() {
  const magicFns = {};
  return {
    magic: (
      name: string,
      fn: () => <T>(queryElement: string, schema: z.ZodType<T>) => T
    ) => {
      magicFns[name] = fn();
    },
    getMagic: (name: string) => magicFns[name],
    $data: (element: any) => {},
  };
}

const Alpine = mockAlpine();

alpineManagerPlugin(Alpine as any);

const $manage: <T>(queryElement: string, schema: z.ZodType<T>) => T =
  Alpine.getMagic("manage");

describe("alpineManagePlugin", () => {
  test("throws if element is missing", () => {
    const schema = z.object({});

    const missingElement = "missing";

    expect(() => $manage(missingElement, schema)).toThrow(
      `Query element ${missingElement} not found.`
    );
  });

  test("throws if x-data is missing", () => {
    const noXDataId = "no-data";
    document.body.innerHTML = `<div id="${noXDataId}"></div>`;

    const schema = z.object({});

    expect(() => $manage(`#${noXDataId}`, schema)).toThrow(
      `Query element #${noXDataId} does not have x-data attribute.`
    );
  });

  test("throws if schema validation fails", () => {
    document.body.innerHTML = `<div id="user" x-data='{"name":"Alice"}'></div>`;

    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    expect(() => $manage("#user", schema)).toThrow(/Validation failed/);
  });

  // test("validates and parses x-data correctly", () => {
  //   document.body.innerHTML = `<div id="user" x-data="{ name: 'Alice', age: 25 }"></div>`;

  //   const userSchema = z.object({
  //     name: z.string(),
  //     age: z.number(),
  //   });
  //   const result = $manage<{ name: string; age: number }>("#user", userSchema);

  //   expect(result).toEqual({ name: "Alice", age: 25 });
  // });
});
