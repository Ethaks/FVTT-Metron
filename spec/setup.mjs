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
  translations = JSON.parse(fs.readFileSync("./public/lang/en.json", "utf8"));

  i18n = {
    format: (stringId, data = {}) => {
      let str = getProperty(this.translations, stringId);
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
}
setup();
