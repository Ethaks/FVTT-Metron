// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

const prettier = require("prettier");

module.exports.readVersion = function (contents) {
	return JSON.parse(contents).version;
};

module.exports.writeVersion = function (contents, version) {
	const json = JSON.parse(contents);
	json.version = version;
	json.download = `https://github.com/Ethaks/FVTT-Metron/releases/download/v${version}/module.zip`;
	return prettier.format(JSON.stringify(json), {
		parser: "json",
	});
};
