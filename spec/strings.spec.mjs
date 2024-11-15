// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { describe, it, expect, afterEach } from "vitest";
import fc from "fast-check";
import { convertString } from "../src/module/strings.mjs";
import { convertDistance, UNIT_SYSTEMS, UNITS } from "../src/module/utils.mjs";

afterEach(() => {
	game.i18n.lang = "en";
});

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

	it("should convert metric to imperial", function () {
		expect(convertString("1.5m", { target: UNIT_SYSTEMS.IMPERIAL })).to.equal("5ft");
		expect(convertString("1.5m.", { target: UNIT_SYSTEMS.IMPERIAL })).to.equal("5ft.");
		expect(convertString("1.5 m", { target: UNIT_SYSTEMS.IMPERIAL })).to.equal("5 ft");
		expect(convertString("1.5 m.", { target: UNIT_SYSTEMS.IMPERIAL })).to.equal("5 ft.");
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
		expect(convertString("I am 5 ft.\nI weigh 150-lbs.")).to.equal(
			"I am 1.5 m.\nI weigh 75-kg.",
		);
	});

	it("should convert multiple unit numbers, but leave non-unit numbers", function () {
		expect(convertString("I can run 10 miles and 50ft in 60 minutes.")).to.equal(
			"I can run 15 kilometers and 15m in 60 minutes.",
		);
		expect(
			convertString(
				"The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.",
			),
		).to.equal(
			"The target beast travels for the duration of the spell toward the specified location, covering about 75 kilometers per 24 hours for a flying messenger, or 37.5 kilometers for other animals.",
		);
		expect(
			convertString(
				"The target beast travels for the duration of the spell toward the specified location, covering about 75 kilometers per 24 hours for a flying messenger, or 37.5 kilometers for other animals.",
				{ target: UNIT_SYSTEMS.IMPERIAL },
			),
		).to.equal(
			"The target beast travels for the duration of the spell toward the specified location, covering about 50 miles per 24 hours for a flying messenger, or 25 miles for other animals.",
		);
	});

	it("should convert Japanese sentences", function () {
		game.i18n.lang = "ja";
		expect(convertString("5 ft.以内にいる目標を1体選択して1回の近接呪文攻撃を行う。")).to.equal(
			"1.5 m.以内にいる目標を1体選択して1回の近接呪文攻撃を行う。",
		);

		// Doubled string to check successive replacements
		expect(
			convertString(
				"半径20フィートの球形の範囲内にいるすべてのクリーチャー半径20フィートの球形の範囲内にいるすべてのクリーチャー",
			),
		).to.equal(
			"半径6メートルの球形の範囲内にいるすべてのクリーチャー半径6メートルの球形の範囲内にいるすべてのクリーチャー",
		);

		expect(convertString("半径20フィートの球形の範囲内にいるすべてのクリーチャー")).to.equal(
			"半径6メートルの球形の範囲内にいるすべてのクリーチャー",
		);

		expect(convertString("1辺15　フィートの立方体の中にいる各クリーチャー")).to.equal(
			"1辺4.5　メートルの立方体の中にいる各クリーチャー",
		);

		expect(convertString("君の5 フィート以内にいるクリーチャー")).to.equal(
			"君の1.5 メートル以内にいるクリーチャー",
		);
	});
});
