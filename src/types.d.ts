// SPDX-FileCopyrightText: 2024 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

export {};

import * as _CONST from "@foundry/common/constants.mjs";

declare global {
	// Add types whose contents gets lost otherwise
	var CONST: typeof _CONST;

	type ImperialUnit = "lb" | "ft" | "mi";
	type MetricUnit = "kg" | "m" | "km";

	type Unit = ImperialUnit | MetricUnit;

	type DistanceUnit = "ft" | "mi" | "m" | "km";
	type WeightUnit = "lb" | "kg";

	type UnitSystem = "imperial" | "metric";

	interface ConversionOptions {
		/**
		 * The unit system to convert to; if null, convert to the other system;
		 * if defined, values already belonging to that system will not be converted.
		 */
		target: UnitSystem | null;
		/** The unit to convert to; if null, convert from the other system. */
		current: UnitSystem | null;
	}
}
