// SPDX-FileCopyrightText: 2023 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

/**
 * Wrap regular expression in `^` and `$` to require exact matches.
 * Changes are applied in-place.
 *
 * @param {UnitRegexes} regexObject - The object containing the regular expressions to modify
 * @param {boolean} [requireExactMatch=true] - Whether to require exact matches
 * @returns {UnitRegexes} The modified object
 */
export const applyExactMatchRequirement = (regexObject, requireExactMatch = true) => {
	if (requireExactMatch) {
		for (const [unit, regexes] of Object.entries(regexObject)) {
			regexObject[unit] = regexes.map((regex) => new RegExp(`^${regex.source}$`));
		}
	}
	return regexObject;
};
