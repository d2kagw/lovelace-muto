import { css, CSSResultGroup, html, LitElement, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../../shared/icon";
import { classMap } from "lit/directives/class-map.js";
import { ButtonCardConfig } from "./button-card-config";
import { LIGHT_BUTTON_CARD_NAME } from "./const";
import { colorForEntityState } from "../../shared/states";
import {
    createThing,
    fireEvent,
    HomeAssistant,
    LovelaceCard,
    LovelaceCardConfig,
} from "custom-card-helpers";
import { MutoBaseCard } from "../../shared/base-card";

@customElement(LIGHT_BUTTON_CARD_NAME)
export class LightButtonCard extends MutoBaseCard {
    constructor() {
        super();
        this.config = this.config || {};
    }

    updated(changedProps: PropertyValues): void {
        super.updated(changedProps);

        console.warn("updated", changedProps);
    }

    public setConfig(config: ButtonCardConfig): void {
        this.config = {
            aspect: "fixed",
            ...config,
        };
    }

    private _handleAction(): void {
        fireEvent(this, "hass-more-info", { entityId: this.config.entity });
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
                @click=${this._handleAction}
            >
                ${this.config.icon ? html`<muto-icon icon="${this.config.icon}"></muto-icon>` : ""}
                ${this.config.label ? html`<label>${this.config.label}</label>` : ""}
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
