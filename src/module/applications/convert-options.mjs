// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import { localize, MODULE_ID } from "../utils.mjs";

export class ConvertOptions extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "convert-options",
      title: localize("convertOptions.title"),
      template: `modules/${MODULE_ID}/templates/convert-options.hbs`,
      width: 320,
      height: "auto",
    });
  }
}
