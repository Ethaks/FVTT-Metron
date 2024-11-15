// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import fs from "node:fs";

function getProperty(object, key) {
  if (!key) return undefined;
  let target = object;
  for (let p of key.split(".")) {
    const t = getType(target);
    if (!(t === "Object" || t === "Array")) return undefined;
    if (p in target) target = target[p];
    else return undefined;
  }
  return target;
}

function setProperty(object, key, value) {
  let target = object;
  let changed = false;

  // Convert the key to an object reference if it contains dot notation
  if (key.indexOf(".") !== -1) {
    let parts = key.split(".");
    key = parts.pop();
    target = parts.reduce((o, i) => {
      if (!Object.hasOwn(o, i)) o[i] = {};
      return o[i];
    }, object);
  }

  // Update the target
  if (target[key] !== value) {
    changed = true;
    target[key] = value;
  }

  // Return changed status
  return changed;
}

function getType(variable) {
  // Primitive types, handled with simple typeof check
  const typeOf = typeof variable;
  if (typeOf !== "object") return typeOf;

  // Special cases of object
  if (variable === null) return "null";
  if (!variable.constructor) return "Object"; // Object with the null prototype.
  if (variable.constructor.name === "Object") return "Object"; // simple objects

  // Match prototype instances
  const prototypes = [
    [Array, "Array"],
    [Set, "Set"],
    [Map, "Map"],
    [Promise, "Promise"],
    [Error, "Error"],
  ];
  if ("HTMLElement" in globalThis) prototypes.push([globalThis.HTMLElement, "HTMLElement"]);
  for (const [cls, type] of prototypes) {
    if (variable instanceof cls) return type;
  }

  // Unknown Object type
  return "Object";
}

class Game {
  release = { generation: 10 };
  translations = {
    en: JSON.parse(fs.readFileSync("./public/lang/en.json", "utf8")),
    ja: JSON.parse(fs.readFileSync("./public/lang/ja.json", "utf8")),
  };

  i18n = {
    lang: "en",
    format: (stringId, data = {}) => {
      let str =
        getProperty(this.translations[game.i18n.lang], stringId) ??
        getProperty(this.translations.en, stringId) ??
        "";
      const fmt = /{[^}]+}/g;
      str = str.replace(fmt, (k) => {
        return data[k.slice(1, -1)];
      });
      return str;
    },
  };
}

export default function setup() {
  globalThis.game = new Game();
  globalThis.foundry = {
    utils: {
      getProperty,
      setProperty,
    },
  };
  globalThis.CONFIG = { DND5E: { movementUnits: { ft: "ft" } } };
}
setup();
