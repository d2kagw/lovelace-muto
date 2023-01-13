import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../icon";
import { classMap } from "lit/directives/class-map.js";
import { ButtonCardConfig } from "./button-card-config";
import { MutoBaseCard } from "../../shared/base-card";
import {
    colorForEntityState,
    deviceTypeForEntity,
    iconForClimateEntity,
    iconForEntity,
} from "../../shared/helpers";
import { property } from "lit/decorators.js";
import { BUTTON_CARD_NAME, SENSOR_BUTTON_CARD_NAME } from "../const";

@customElement(BUTTON_CARD_NAME)
export class ButtonCard extends MutoBaseCard {
    @property() config!: ButtonCardConfig;

    public setConfig(config: ButtonCardConfig): void {
        this.config = {
            ...config,
        };
    }

    public climateButtonContent(): TemplateResult {
        let icon: string = "mdi:help-circle-outline";
        if (this.entity()) {
            icon =
                iconForClimateEntity(this.entity()) != false
                    ? (iconForClimateEntity(this.entity()) as string)
                    : iconForEntity(this.entity());
        }
        return html` <muto-icon icon="${icon}"></muto-icon>`;
    }

    public defaultButtonContent(): TemplateResult {
        return html`
            ${this.config.icon ? html`<muto-icon icon="${this.config.icon}"></muto-icon>` : ""}
            ${this.config.label
                ? html`<label
                      >${(this.config.label as any) == true
                          ? this.entity().attributes.friendly_name
                          : this.config.label}</label
                  >`
                : ""}
            ${this.config.image || this.config.icon || this.config.label
                ? ""
                : html`<muto-icon icon="${iconForEntity(this.entity())}"></muto-icon>`}
        `;
    }

    public mediaPlayerButtonContent(): TemplateResult {
        return html``;
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

                case "media_player":
                    if (this.entity().attributes.is_volume_muted) {
                        label = "Muted";
                    } else if (this.entity().attributes.volume_level) {
                        label = `${this.entity().attributes.volume_level * 100}%`;
                    } else {
                        label = this.entity().state;
                    }
                    break;

                case "weather":
                    label =
                        this.entity().attributes.temperature +
                        (this.entity().attributes.temperature_unit ?? "");
                    break;

                default:
                    label =
                        this.entity().state + (this.entity().attributes.unit_of_measurement ?? "");
                    break;
            }
            return html`<label>${label}</label>`;
        } else {
            return html`<muto-icon icon="unknown"></muto-icon>`;
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

                case "media_player":
                    return this.mediaPlayerButtonContent();

                case "light":
                case "motion":
                case "moisture":
                case "switch":
                    return this.defaultButtonContent();

                case "weather":
                case "temperature":
                case "humidity":
                case "carbon_monoxide":
                case "carbon_dioxide":
                case "power":
                case "energy":
                case "gas":
                    return this.sensorButtonContent();

                default:
                    console.error(
                        `Unsupported device type: ${deviceType}`,
                        this.config,
                        this.entity()
                    );
                    return this.defaultButtonContent();
            }
        }
    }

    public cssColor(): string {
        let cssColor: string = "";
        if (this.entity()) {
            cssColor = `background-color: ${colorForEntityState(this.entity())};`;

            if (deviceTypeForEntity(this.entity()) == "light") {
                if (this.entity().attributes.rgb_color) {
                    cssColor = `background-color: rgb(${this.entity().attributes.rgb_color.join(
                        ","
                    )});`;
                }
            }
        }

        return cssColor;
    }

    public background(): string {
        let background: string = this.cssColor();
        if (this.config.image) {
            return `background-image:url(${this.config.image});`;
        }
        if (deviceTypeForEntity(this.entity()) == "media_player") {
            return `background-image:url(${this.entity().attributes.entity_picture});`;
        }

        return background;
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        let stateIsOff: boolean = false;
        if (this.entity() && "state" in this.entity()) {
            stateIsOff = this.entity().state == "off" || this.entity().state == "stopped";
        }

        let aspectRatio: string = `aspect-ratio: ${this.config.aspect_ratio};` ?? "";

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
                style="${this.background()} ${aspectRatio} ${this.config.css ?? ""}"
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
    public background(): string {
        return "";
    }
}
