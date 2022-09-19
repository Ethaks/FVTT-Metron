// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { describe, it, expect, afterEach } from "vitest";
import {
  convertDistance,
  convertWeight,
  getOtherUnit,
  getUnitFromString,
  UNITS,
} from "../src/module/utils.mjs";

afterEach(() => {
  game.i18n.lang = "en";
});

describe("getUnitFromString", function () {
  it("should recognise feet", function () {
    expect(getUnitFromString("ft")).to.equal(UNITS.FEET);
    expect(getUnitFromString("foot")).to.equal(UNITS.FEET);
    expect(getUnitFromString("feet")).to.equal(UNITS.FEET);
  });

  it("should recognise meter", function () {
    expect(getUnitFromString("m")).to.equal(UNITS.METER);
    expect(getUnitFromString("meter")).to.equal(UNITS.METER);
    expect(getUnitFromString("meters")).to.equal(UNITS.METER);
  });

  it("should recognise miles", function () {
    expect(getUnitFromString("mi")).to.equal(UNITS.MILE);
    expect(getUnitFromString("mile")).to.equal(UNITS.MILE);
    expect(getUnitFromString("miles")).to.equal(UNITS.MILE);
  });

  it("should recognise km", function () {
    expect(getUnitFromString("km")).to.equal(UNITS.KM);
    expect(getUnitFromString("kilometer")).to.equal(UNITS.KM);
    expect(getUnitFromString("kilometre")).to.equal(UNITS.KM);
    expect(getUnitFromString("kilometers")).to.equal(UNITS.KM);
    expect(getUnitFromString("kilometres")).to.equal(UNITS.KM);
  });

  it("should recognise lb", function () {
    expect(getUnitFromString("lb")).to.equal(UNITS.LBS);
    expect(getUnitFromString("lbs")).to.equal(UNITS.LBS);
    expect(getUnitFromString("pound")).to.equal(UNITS.LBS);
    expect(getUnitFromString("pounds")).to.equal(UNITS.LBS);
  });

  it("should recognise kg", function () {
    expect(getUnitFromString("kg")).to.equal(UNITS.KG);
    expect(getUnitFromString("kgs")).to.equal(UNITS.KG);
    expect(getUnitFromString("kilogram")).to.equal(UNITS.KG);
    expect(getUnitFromString("kilograms")).to.equal(UNITS.KG);
  });

  it("should recognise Japanese units", function () {
    game.i18n.lang = "ja";
    expect(getUnitFromString("フィート")).to.equal(UNITS.FEET);
    expect(getUnitFromString("メートル")).to.equal(UNITS.METER);
    expect(getUnitFromString("マイル")).to.equal(UNITS.MILE);
    expect(getUnitFromString("キロメートル")).to.equal(UNITS.KM);
    expect(getUnitFromString("ポンド")).to.equal(UNITS.LBS);
    expect(getUnitFromString("キログラム")).to.equal(UNITS.KG);
  });
});

describe("convertDistance", function () {
  it("should convert feet to meter", function () {
    expect(convertDistance(5, UNITS.FEET)).to.equal(1.5);
    expect(convertDistance(100, UNITS.FEET)).to.equal(30);
  });
  it("should convert meter to feet", function () {
    expect(convertDistance(1.5, UNITS.METER)).to.equal(5);
    expect(convertDistance(30, UNITS.METER)).to.equal(100);
  });

  it("should convert miles to km", function () {
    expect(convertDistance(1, UNITS.MILE)).to.equal(1.5);
    expect(convertDistance(20, UNITS.MILE)).to.equal(30);
  });
  it("should convert km to miles", function () {
    expect(convertDistance(1.5, UNITS.KM)).to.equal(1);
    expect(convertDistance(30, UNITS.KM)).to.equal(20);
  });

  it("should throw an error when no valid unit is given", function () {
    expect(() => convertDistance(1, "")).to.throw(Error);
    expect(() => convertDistance(1, "foo")).to.throw(Error);
    expect(() => convertDistance(1, UNITS.KG)).to.throw(Error);
  });
});

describe("convertWeight", function () {
  it("should convert lbs to kg", function () {
    expect(convertWeight(5, UNITS.LBS)).to.equal(2.5);
    expect(convertWeight(1, UNITS.LBS)).to.equal(0.5);
  });
  it("should convert kg to lb", function () {
    expect(convertWeight(2.5, UNITS.KG)).to.equal(5);
    expect(convertWeight(0.5, UNITS.KG)).to.equal(1);
  });

  it("should throw an error when no valid unit is given", function () {
    expect(() => convertWeight(1, "")).to.throw(Error);
    expect(() => convertWeight(1, "foo")).to.throw(Error);
    expect(() => convertWeight(1, UNITS.METER)).to.throw(Error);
  });
});

describe("getOtherUnit", function () {
  it("should return correct counter parts for imperial units", function () {
    expect(getOtherUnit(UNITS.FEET)).to.equal(UNITS.METER);
    expect(getOtherUnit(UNITS.MILE)).to.equal(UNITS.KM);
    expect(getOtherUnit(UNITS.LBS)).to.equal(UNITS.KG);
  });
  it("should return correct counter parts for metric units", function () {
    expect(getOtherUnit(UNITS.METER)).to.equal(UNITS.FEET);
    expect(getOtherUnit(UNITS.KM)).to.equal(UNITS.MILE);
    expect(getOtherUnit(UNITS.KG)).to.equal(UNITS.LBS);
  });
});
