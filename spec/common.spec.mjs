// SPDX-FileCopyrightText: 2024 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { describe, it, expect } from "vitest";
import { convertDistanceField } from "../src/module/documents/common.mjs";

describe("convertDistanceField", function () {
	it("should return an empty object if the field is already in the target system", function () {
		const field = { units: "ft", walk: 5 };
		expect(convertDistanceField(field, "imperial")).to.deep.equal({});
	});

	it("should throw an error if the unit cannot be recognised", function () {
		const field = { units: "foo", walk: 5 };
		expect(() => convertDistanceField(field, "imperial")).to.throw(Error);
	});

	it("should consider null/automatic to be feet and not convert to imperial", function () {
		const field = { walk: 5, units: null };
		expect(convertDistanceField(field, "imperial")).to.deep.equal({});
	});

	it("should consider null/automatic to be feet and convert to metric", function () {
		const field = { walk: 5, units: null };
		expect(convertDistanceField(field, "metric")).to.deep.equal({
			units: "m",
			walk: 1.5,
		});
	});

	it("should convert feet to meters", function () {
		const field = { walk: 5, units: "ft", run: 10 };
		expect(convertDistanceField(field, "metric")).to.deep.equal({
			units: "m",
			walk: 1.5,
			run: 3,
		});
	});

	it("should convert meters to feet", function () {
		const field = { walk: 1.5, units: "m" };
		expect(convertDistanceField(field, "imperial")).to.deep.equal({
			units: "ft",
			walk: 5,
		});
	});

	it("should not touch non-unit non-number fields", function () {
		const field = { walk: "foo", units: "ft" };
		expect(convertDistanceField(field, "metric")).to.deep.equal({
			units: "m",
		});
	});
});
