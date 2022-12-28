import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../../shared/icon";
import { classMap } from "lit/directives/class-map.js";
import { ButtonCardConfig } from "./button-card-config";
import { BUTTON_CARD_NAME, SENSOR_BUTTON_CARD_NAME } from "./const";
import { colorForEntityState } from "../../shared/states";
import { MutoBaseCard } from "../../shared/base-card";
import { deviceTypeForEntity, iconForEntity } from "../../shared/helpers";
import { property } from "lit/decorators.js";

@customElement(BUTTON_CARD_NAME)
export class ButtonCard extends MutoBaseCard {
    @property() config!: ButtonCardConfig;

    constructor() {
        super();
        this.config = this.config || { action: "click" };
    }

    public setConfig(config: ButtonCardConfig): void {
        this.config = {
            action: "click",
            ...config,
        };
    }

    public climateButtonContent(): TemplateResult {
        let icon: string = "mdi:help-circle-outline";
        if (this.config.entity) {
            icon = iconForEntity(this.entity());
            if (this.entity()) {
                switch (this.entity().state) {
                    case "cool":
                        icon = "mdi:snowflake";
                        break;

                    case "heat":
                        icon = "mdi:fire";
                        break;

                    case "dry":
                        icon = "mdi:fan";
                        break;

                    case "fan_only":
                        icon = "mdi:fan";
                        break;

                    case "heat_dry":
                        icon = "mdi:fire";
                        break;

                    default:
                        break;
                }
            }
        }
        return html` <muto-icon icon="${icon}"></muto-icon>`;
    }

    public defaultButtonContent(): TemplateResult {
        return html`
            ${this.config.icon ? html`<muto-icon icon="${this.config.icon}"></muto-icon>` : ""}
            ${this.config.label ? html`<label>${this.config.label}</label>` : ""}
            ${this.config.image || this.config.icon || this.config.label
                ? ""
                : html`<muto-icon icon="${iconForEntity(this.entity())}"></muto-icon>`}
        `;
    }

    public sensorButtonContent(): TemplateResult {
        if (this.entity()) {
            let label: string = "Unknown";

            switch (deviceTypeForEntity(this.entity())) {
                case "light":
                    if (this.entity().attributes.brightness) {
                        label = `${Math.floor((this.entity().attributes.brightness / 255) * 100)}%`;
                    } else {
                        label = this.entity().state;
                    }

                    break;

                default:
                    label =
                        this.entity().state + (this.entity().attributes.unit_of_measurement ?? "");
                    break;
            }
            return html`<label>${label}</label>`;
        } else {
            return html` <muto-icon icon="unknown"></muto-icon>`;
        }
    }

    public buttonContent(): TemplateResult {
        if (this.config.icon || this.config.label || this.config.image) {
            return this.defaultButtonContent();
        } else {
            let deviceType: string = deviceTypeForEntity(this.entity());
            switch (deviceType) {
                case "climate":
                    return this.climateButtonContent();

                case "light":
                case "motion":
                case "moisture":
                case "switch":
                    return this.defaultButtonContent();

                case "temperature":
                case "humidity":
                case "carbon_monoxide":
                case "carbon_dioxide":
                case "power":
                    return this.sensorButtonContent();

                default:
                    console.error(`Unsupported device type: ${deviceType}`, this.config);
                    return this.defaultButtonContent();
            }
        }
    }

    public cssColor(): string {
        let cssColor: string = "";
        if (this.config.entity) {
            cssColor = colorForEntityState(this.entity());

            if (deviceTypeForEntity(this.entity()) == "light") {
                if (this.entity().attributes.rgb_color) {
                    cssColor = `background-color: rgb(${this.hass.states[
                        this.config.entity
                    ].attributes.rgb_color.join(",")})`;
                }
            }
        }

        return cssColor;
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        let background: string = this.cssColor();
        if (this.config.image) {
            background = `background-image:url(${this.config.image});`;
        }

        let stateIsOff: boolean = false;
        if (this.config.entity && this.entity() && "state" in this.entity()) {
            stateIsOff = this.entity().state == "off";
        }

        return html`
            <muto-button
                class=${classMap({
                    muto: true,
                    "muto-panel": true,
                    "muto-button": true,
                    "muto-button-state-off": stateIsOff,
                    "muto-button-image": this.config.image ?? false,
                    "muto-button-fit": this.config.width == "fit",
                })}
                style="${background} ${this.config.css ?? ""}"
                @click=${this.clickAction()}
            >
                ${this.buttonContent()}
            </muto-button>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                    width: 100%;
                    display: block;
                }

                .muto-button {
                    background-color: var(--muto-card-background);

                    font-family: var(--muto-font);
                    font-weight: var(--muto-font-weight-bold);
                    font-size: calc(var(--muto-unit) * 1.2);

                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;

                    min-width: var(--muto-row-height);
                    min-height: var(--muto-row-height);
                }
                .muto-button-fit {
                    min-width: auto;
                }

                .muto-button,
                .muto-button * {
                    cursor: pointer;
                }
                .muto-button:active {
                    filter: brightness(1.5);
                }
                .muto-button.muto-button-image.muto-button-state-off {
                    opacity: 0.5;
                    filter: saturate(0);
                }
                .muto-button label {
                    text-align: center;
                }
            `,
        ];
    }
}

@customElement(SENSOR_BUTTON_CARD_NAME)
export class SensorButtonCard extends ButtonCard {
    constructor() {
        super();
        this.config = this.config || { action: "more-info" };
    }
    public buttonContent(): TemplateResult {
        if (this.config.icon || this.config.label || this.config.image) {
            return this.defaultButtonContent();
        } else {
            return this.sensorButtonContent();
        }
    }
    public cssColor(): string {
        return "";
    }
}
