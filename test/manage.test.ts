import { describe, expect, test } from "vitest";
import alpineManagePlugin from "../src";
import { z } from "zod";

// Mocks Alpine
function mockAlpine() {
  const magicFns: Record<string, any> = {};
  return {
    magic: (name: string, fn: () => any) => {
      magicFns[name] = fn();
    },
    getMagic: (name: string) => magicFns[name],
  };
}

describe("alpineManagePlugin", () => {
  test("validates and parses x-data correctly", () => {
    document.body.innerHTML = `<div id="user" x-data='{"name":"Alice","age":25}'></div>`;

    const Alpine = mockAlpine();
    alpineManagePlugin(Alpine as any);

    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const $manage = Alpine.getMagic("manage");
    const result = $manage("user", userSchema);

    expect(result).toEqual({ name: "Alice", age: 25 });
  });

  test("throws if element is missing", () => {
    const Alpine = mockAlpine();
    alpineManagePlugin(Alpine as any);

    const schema = z.object({});

    const $manage = Alpine.getMagic("manage");

    expect(() => $manage("missing", schema)).toThrow(/not found/);
  });

  test("throws if x-data is missing", () => {
    document.body.innerHTML = `<div id="no-data"></div>`;

    const Alpine = mockAlpine();
    alpineManagePlugin(Alpine as any);

    const schema = z.object({});

    const $manage = Alpine.getMagic("manage");

    expect(() => $manage("no-data", schema)).toThrow(
      /does not have an "x-data"/
    );
  });

  test("throws if x-data is not valid JSON", () => {
    document.body.innerHTML = `<div id="invalid" x-data="{bad json}"></div>`;

    const Alpine = mockAlpine();
    alpineManagePlugin(Alpine as any);

    const schema = z.object({});

    const $manage = Alpine.getMagic("manage");

    expect(() => $manage("invalid", schema)).toThrow(/Failed to parse/);
  });

  test("throws if schema validation fails", () => {
    document.body.innerHTML = `<div id="user" x-data='{"name":"Alice"}'></div>`;

    const Alpine = mockAlpine();
    alpineManagePlugin(Alpine as any);

    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const $manage = Alpine.getMagic("manage");

    expect(() => $manage("user", schema)).toThrow(/Validation failed/);
  });
});
