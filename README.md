<!--
SPDX-FileCopyrightText: 2022 Ethaks

SPDX-License-Identifier: MIT
-->

<h1 style="text-align: center" align="center">
  Metron
</h1>

<p style="text-align: center" align="center">
  <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/Ethaks/FVTT-Metron/Checks?label=Checks&logo=github">
  <a href="https://github.com/Ethaks/FVTT-Metron/releases/latest">
    <img src="https://img.shields.io/github/downloads/Ethaks/FVTT-Metron/latest/module.zip" alt="Downloads" />
  </a>
  <a href="https://forge-vtt.com/bazaar#package=metron">
    <img src="https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fmetron&colorB=4aa94a" alt="Forge Install %" />
  </a>
  <br />
  <a href="https://www.foundryvtt-hub.com/package/metron/">
    <img src="https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Fmetron%2Fshield%2Fendorsements" alt="Foundry Hub Endorsements" />
  </a>
  <img src="https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/Ethaks/FVTT-Metron/releases/latest/download/module.json" alt="Supported Foundry Versions" />
<a href="https://codecov.io/gh/Ethaks/FVTT-Metron" >
 <img src="https://codecov.io/gh/Ethaks/FVTT-Metron/branch/main/graph/badge.svg?token=IOKNVR240G" alt="Coverage %"/>
 </a>
</p>

Metron is a dnd5e-specific module converting actors, items, their descriptions and text fields, as well as scenes and journal entries from imperial to metric units.

**IMPORTANT:** While the module aims to reliably convert documents in place, it is _heavily_ recommended to make a backup of all data to be converted.

To convert a document, click on the `Convert` button in the document's sheet's header buttons.
This will convert that particular document, as well as all documents embedded in it (e.g. Items in an Actor) to the unit system selected in the module's settings.
Converting in the reverse direction is possible by Shift-Clicking the `Convert` button.
Scenes and compendiums have their `Convert` button in their right-click menu.

The used conversion rates do not strictly follow real word ones, but adhere to the simplified rules, e.g. 5 feet are converted to 1.5 meters.

## Supported Languages

By default, Metron always converts units written in English (e.g. `5 ft`, or `2 miles`).
Additional languages are added dependent on the currently active language of FoundryVTT.

- English (always active)
- Japanese

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

Alternatively, after having built the module at least once and having linked its `dist` directory, you can run

```bash
npm run serve
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
