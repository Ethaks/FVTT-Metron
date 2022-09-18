// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { convertString } from "../src/module/strings.mjs";
import { convertDistance, UNITS } from "../src/module/utils.mjs";

describe("convertString", function () {
  it("should convert a simple number with a unit", function () {
    expect(convertString("5ft")).to.equal("1.5m");
    expect(convertString("5ft.")).to.equal("1.5m.");
    expect(convertString("5 ft")).to.equal("1.5 m");
    expect(convertString("5 ft.")).to.equal("1.5 m.");
  });

  it("should convert full-width numbers", function () {
    expect(convertString("５ft")).to.equal("1.5m");
    expect(convertString("1５ft.")).to.equal("4.5m.");
    expect(convertString("５ ft")).to.equal("1.5 m");
    expect(convertString("５ ft.")).to.equal("1.5 m.");
  });

  it("should leave metric units", function () {
    expect(convertString("5m")).to.equal("5m");
    expect(convertString("5m.")).to.equal("5m.");
    expect(convertString("5 m")).to.equal("5 m");
    expect(convertString("5 m.")).to.equal("5 m.");
  });

  it("should convert large numbers", function () {
    expect(convertString("5,000 ft")).to.equal("1500 m");
    expect(convertString("5,000 ft.")).to.equal("1500 m.");
    expect(convertString("5,000ft.")).to.equal("1500m.");
    expect(convertString("5,000ft")).to.equal("1500m");

    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(convertString(`${n} ft`)).to.equal(`${convertDistance(n, UNITS.FEET)} m`);
      }),
    );
  });

  it("should convert numbers in a sentence", function () {
    expect(convertString("I am 5ft tall.")).to.equal("I am 1.5m tall.");
    expect(convertString("I am 5ft tall")).to.equal("I am 1.5m tall");
    expect(convertString("I am 5 ft tall.")).to.equal("I am 1.5 m tall.");
    expect(convertString("I am 5 ft tall")).to.equal("I am 1.5 m tall");
    expect(convertString("I am 5 ft. tall.")).to.equal("I am 1.5 m. tall.");
    expect(convertString("I am 5 ft. tall")).to.equal("I am 1.5 m. tall");
    expect(convertString("I am 5ft. tall.")).to.equal("I am 1.5m. tall.");
    expect(convertString("I am ５ ft. tall")).to.equal("I am 1.5 m. tall");
    expect(convertString("I am ５ft. tall")).to.equal("I am 1.5m. tall");
  });

  it("should convert multiple numbers in a string", function () {
    expect(convertString("I am 5ft tall and I weigh 150lbs.")).to.equal(
      "I am 1.5m tall and I weigh 75kg.",
    );
    expect(convertString("5ft. tall I am. And I weigh 150lbs.")).to.equal(
      "1.5m. tall I am. And I weigh 75kg.",
    );
    expect(convertString("I am 5 ft.\nI weigh 150-lbs.")).to.equal("I am 1.5 m.\nI weigh 75-kg.");
  });
});
