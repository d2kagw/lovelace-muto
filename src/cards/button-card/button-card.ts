import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../../shared/icon";
import { classMap } from "lit/directives/class-map.js";
import { ButtonCardConfig } from "./button-card-config";
import { BUTTON_CARD_NAME } from "./const";
import { colorForEntityState } from "../../shared/states";
import { MutoBaseCard } from "../../shared/base-card";
import { deviceTypeForEntity, iconForEntity } from "../../shared/helpers";

@customElement(BUTTON_CARD_NAME)
export class ButtonCard extends MutoBaseCard {
    public setConfig(config: ButtonCardConfig): void {
        this.config = {
            aspect: "fixed",
            ...config,
        };
    }

    public buttonContent(): TemplateResult {
        return html`
            ${this.config.icon ? html`<muto-icon icon="${this.config.icon}"></muto-icon>` : ""}
            ${this.config.label ? html`<label>${this.config.label}</label>` : ""}
            ${this.config.image || this.config.icon || this.config.label
                ? ""
                : html`<muto-icon
                      icon="${iconForEntity(this.hass, this.config.entity)}"
                  ></muto-icon>`}
        `;
    }

    public clickAction(): Function {
        switch (deviceTypeForEntity(this.hass.states[this.config.entity])) {
            case "switch":
                return this.toggleSwitch();
            case "light":
                return this.toggleLight();
            default:
                return this.moreInfoAction();
        }
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        let cssColor: string = "";
        if (this.config.entity) {
            cssColor = colorForEntityState(this.hass.states[this.config.entity]);
        }

        let backgroundImage: string = "";
        if (this.config.image) {
            backgroundImage = `background-image:url(${this.config.image});`;
        }

        let stateIsOff: boolean = false;
        if (
            this.hass.states[this.config.entity] &&
            "state" in this.hass.states[this.config.entity]
        ) {
            stateIsOff = this.hass.states[this.config.entity].state == "off";
        }

        return html`
            <muto-button
                class=${classMap({
                    muto: true,
                    "muto-panel": true,
                    "muto-button": true,
                    "muto-button-state-off": stateIsOff,
                    "muto-button-image": this.config.image,
                    "muto-button-fit": this.config.width == "fit",
                })}
                style="${cssColor} ${backgroundImage} ${this.config.css ?? ""}"
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
