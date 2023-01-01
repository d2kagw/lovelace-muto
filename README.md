# 🛠️ Muto for Home Assistant

[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
![build][build-badge]

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
4. _(Optional)_ Install the `Barlow` font from Google Fonts using one of the two methods mentioned in step 3

    - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&display=swap` → Set _Resource type_ as `Stylesheet`.
      **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
    - **Using YAML:** Add following code to `lovelace` section.
        ```yaml
        resources:
            - url: https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&display=swap
              type: stylesheet
        ```

5. Reload themes by restarting home assistant, or using the keyboard shortcut `c`, then type `reload themes`
6. Set the `Muto` theme for all users by going to _Developer Tools_ → _Services_. Select the service `Home Assistant Frontend: Set theme`. Select `Muto` from the list of themes, and press _Call Service_.

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
[build-badge]: https://img.shields.io/github/actions/workflow/status/d2kagw/lovelace-muto/build.yml?branch=main&style=flat-square

<!-- References -->

[hacs]: https://hacs.xyz
[release-url]: https://github.com/d2kagw/lovelace-muto/releases
