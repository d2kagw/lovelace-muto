import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import "../../shared/icon";
import { classMap } from "lit/directives/class-map.js";
import { ButtonCardConfig } from "./button-card-config";
import { BUTTON_CARD_NAME } from "./const";
import { colorForEntityState } from "../../shared/states";
import { fireEvent, handleClick, LovelaceCard } from "custom-card-helpers";

@customElement(BUTTON_CARD_NAME)
export class ButtonCard extends MutoBaseCard implements LovelaceCard {
    private _config!: ButtonCardConfig;

    constructor() {
        super();
        this._config = this._config || {};
    }

    public setConfig(config: ButtonCardConfig): void {
        this._config = {
            aspect: "fixed",
            ...config,
        };
    }

    private _handleAction(): void {
        fireEvent(this, "hass-more-info", { entityId: this._config.entity });
    }

    protected render(): TemplateResult {
        if (!this._hass || !this._config) {
            return html``;
        }

        let cssColor: string = "";
        if (this._config.entity) {
            cssColor = colorForEntityState(this._hass.states[this._config.entity]);
        }

        return html`
            <muto-button
                class=${classMap({
                    muto: true,
                    "muto-panel": true,
                    "muto-button": true,
                    "muto-button-fixedaspect": this._config.aspect == "fixed",
                })}
                style="${cssColor} ${this._config.css ?? ""}"
                @click=${this._handleAction}
            >
                ${this._config.icon
                    ? html`<muto-icon icon="${this._config.icon}"></muto-icon>`
                    : ""}
                ${this._config.label ? html`<label>${this._config.label}</label>` : ""}
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
