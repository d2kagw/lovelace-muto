import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../../shared/icon";
import { classMap } from "lit/directives/class-map.js";
import { ButtonCardConfig } from "./button-card-config";
import { BUTTON_CARD_NAME } from "./const";
import { colorForEntityState } from "../../shared/states";
import { MutoBaseCard } from "../../shared/base-card";
import { iconForEntity } from "../../shared/helpers";

@customElement(BUTTON_CARD_NAME)
export class ButtonCard extends MutoBaseCard {
    // constructor() {
    //     super();
    //     this.config = this.config || {};
    // }

    // updated(changedProps: PropertyValues): void {
    //     super.updated(changedProps);
    // }

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
            ${this.config.icon || this.config.label
                ? ""
                : html`<muto-icon
                      icon="${iconForEntity(this.hass, this.config.entity)}"
                  ></muto-icon>`}
        `;
    }

    public clickAction(): Function {
        return this.moreInfoAction();
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        let cssColor: string = "";
        if (this.config.entity) {
            cssColor = colorForEntityState(this.hass.states[this.config.entity]);
        }

        return html`
            <muto-button
                class=${classMap({
                    muto: true,
                    "muto-panel": true,
                    "muto-button": true,
                    "muto-button-fixedaspect": this.config.aspect == "fixed",
                })}
                style="${cssColor} ${this.config.css ?? ""}"
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
                    aspect-ratio: 1 / 1;
                    display: block;
                }
                .muto-button {
                    background: var(--muto-card-background);

                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;

                    overflow: hidden;
                }
                .muto-button label {
                    text-align: center;
                }
                .muto-button.muto-button-fixedaspect {
                    /* aspect-ratio: 1 / 1; */
                }
            `,
        ];
    }
}
