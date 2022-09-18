<!--
SPDX-FileCopyrightText: 2022 Ethaks

SPDX-License-Identifier: MIT
-->

# Metron

Metron is a dnd5e-specific module converting actors, items, their descriptions and text fields, as well as scenes and journal entries from imperial to metric units.

**IMPORTANT:** While the module aims to reliably convert documents in place, it is _heavily_ recommended to make a backup of all data to be converted.

To convert a document, click on the `Convert` button in the document's sheet's header buttons.
This will convert that particular document, as well as all documents embedded in it (e.g. Items in an Actor) to the unit system selected in the module's settings.
Converting in the reverse direction is possible by Shift-Clicking the `Convert` button.
Scenes and compendiums have their `Convert` button in their right-click menu.

The used conversion rates do not strictly follow real word ones, but adhere to the simplified rules, e.g. 5 feet are converted to 1.5 meters.

## Installation

Install the module from the Foundry VTT module browser or by pasting the following URL in the module installation's manifest URL field:

```html
https://github.com/Ethaks/FVTT-Metron/releases/latest/download/module.json
```

## Development

### Prerequisites

In order to build this module, recent versions of `node` and `npm` are
required. Most likely, using `yarn` also works, but only `npm` is officially
supported. We recommend using the latest lts version of `node`.
You also need to install the project's dependencies. To do so, run

```bash
npm ci
```

### Building

You can build the project by running

```bash
npm run build
```

Alternatively, you can run

```bash
npm run build:serve
```

to start a development server available at `http://localhost:30001`.

### Testing

You can run the tests by running

```bash
npm test
```

## Licensing

This project is being developed under the terms of the
[LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT](https://foundryvtt.com/article/license/) for Foundry Virtual Tabletop.
Its code is available under the MIT license.
