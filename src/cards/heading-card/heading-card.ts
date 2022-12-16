import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LovelaceCard, LovelaceCardConfig, HomeAssistant } from "../../ha";
import { MutoBaseCard } from "../../ha/base-card";
import "../../shared/icon";
import { HeadingCardConfig } from "./heading-card-config";
import { HEADING_CARD_NAME } from "./const";

@customElement(HEADING_CARD_NAME)
export class HeadingCard extends MutoBaseCard implements LovelaceCard {
    private _config!: HeadingCardConfig;

    constructor() {
        super();
        this._config = this._config || {};
    }

    public setConfig(config: HeadingCardConfig): void {
        this._config = {
            size: "h1",
            ...config,
        };
    }

    public tagContent(): TemplateResult {
        return html`
            ${this._config.icon ? html`<muto-icon icon="${this._config.icon}"></muto-icon>` : ""}
            ${this._config.text ?? ""}
        `;
    }

    protected render(): TemplateResult {
        if (!this._hass || !this._config) {
            return html``;
        }

        let tag: TemplateResult;
        switch (this._config.size) {
            case "h2":
                tag = html`<h2
                    class="muto-heading muto-heading-${this._config.size}"
                    style="${this._config.css ?? ""}"
                >
                    ${this.tagContent()}
                </h2>`;
                break;

            case "h3":
                tag = html`<h3
                    class="muto-heading muto-heading-${this._config.size}"
                    style="${this._config.css ?? ""}"
                >
                    ${this.tagContent()}
                </h3>`;
                break;

            default: // or h1
                tag = html`<h1
                    class="muto-heading muto-heading-${this._config.size}"
                    style="${this._config.css ?? ""}"
                >
                    ${this.tagContent()}
                </h1>`;
        }

        //

        return tag;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                h1 {
                    --mdc-icon-size: 1.5em;
                }
                h2 {
                    --mdc-icon-size: 1.17em;
                }
                h3 {
                    --mdc-icon-size: 1em;
                }
            `,
        ];
    }
}
