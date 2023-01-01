# 🛠️ Muto for Home Assistant

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
![build][build-badge]

## TODO

-   UI Editor
-   Themeing
-   Components
    -   [] Muto-Layout, Muto-SideBar, Muto-Body
        -   [] 30/70 layout of sidebar and body
        -   [] mobile responsive to put a header and footer in place
    -   [x] Muto-FlexVertical, Muto-FlexHorizontal
        -   [x] Basic componentry to make complex layouts
        -   [] Vertical MTF’s scroll
    -   [] Muto-Button
        -   [x] has an aspect ratio of 1:1, can be disabled
        -   [] has a background and foreground status to represent state
        -   [] can show an icon, text, or both
        -   [] can show an image (filled)
        -   [] has a click state
    -   Muto-Label
        -   Heading and Sub-Heading label
            -   over two rows
        -   Left or Center Aligned
    -   Muto-Stat
        -   Larger labels
        -   Center Aligned
    -   Muto-RangeInput
        -   when dragged sets a value
        -   has a min and max which might not be 0-100
        -   has a visualisation of the selected range
        -   will require a default state
        -   can contain labels and stats
        -   could contain future complex states - i.e. an RGB gradient
    -   Muto-Combo
        -   brings together buttons, labels, stats, buttons
    -   Muto-Group
        -   removes unnecessary rounded corners from children
        -   should allow rows of buttons

## What is Muto?

Muto stands for Multi-Tool - a combination of basic UI elements that enable user interaction designed for tablet use.

The principles of Muto might look familiar for those with web-dev experience as the layouts are put in your hands through cards like "flexbox" and such.

Note: Muto has been built and designed for my personal use, so there are likely lots of bugs or edge cases not supported.

### Features

-   🛠 A basic set of components to build complete custom UIs
-   😍 tablet focused designs and interactions - with expectations of horizontal layouts, finger-control and scrolling
-   🖌 Consistent placement of Clocks, Alerts and Security cameras
-   🚀 0 dependencies : no need to install another card.
-   🌈 Themeable without external themes

## Installation

### Manual

1. Download `muto.js` file from the [latest-release].
2. Put `muto.js` file into your `config/www` folder.
3. Add reference to `muto.js` in Dashboard. There's two way to do that:
    - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/muto.js` → Set _Resource type_ as `JavaScript Module`.
      **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
    - **Using YAML:** Add following code to `lovelace` section.
        ```yaml
        resources:
            - url: /local/muto.js
              type: module
        ```

## Usage

TBC

### Cards

tbc

## Development server

### Home assistant demo

You can run a demo instance of Home Assistant with docker by running:

```sh
npm run start:hass
```

Once it's done, go to Home Assistant instance [http://localhost:8123](http://localhost:8123) and start configuration.

### Development

In another terminal, install dependencies and run development server:

```sh
npm install
npm start
```

Server will start on port `4000`.

### Home assistant configuration

Once both Home Assistant and muto are running, you have to add a resource to Home Assistant UI:

-   Enable `Advanced Mode` in your profile page
-   Go to Dashboard Resources and add the resource `http://localhost:4000/muto.js`:  
    _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _URL_ as `http://localhost:4000/muto.js` → Set _Resource type_ as `JavaScript Module`.

### Build

You can build the `muto.js` file in `dist` folder by running the build command.

```sh
npm run build
```

<!-- Badges -->

[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/d2kagw/lovelace-muto?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/d2kagw/lovelace-muto/total?style=flat-square
[build-badge]: https://img.shields.io/github/workflow/status/d2kagw/lovelace-muto/Build?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[home-assitant-theme-docs]: https://www.home-assistant.io/integrations/frontend/#defining-themes
[hacs]: https://hacs.xyz
[button-card]: https://github.com/custom-cards/button-card
[release-url]: https://github.com/d2kagw/lovelace-muto/releases
