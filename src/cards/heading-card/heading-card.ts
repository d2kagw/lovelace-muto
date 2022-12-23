import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import "../../shared/icon";
import { HeadingCardConfig } from "./heading-card-config";
import { HEADING_CARD_NAME } from "./const";
import { LovelaceCard } from "custom-card-helpers";

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
                tag = html`<h2 class="muto muto-heading" style="${this._config.css ?? ""}">
                    ${this.tagContent()}
                </h2>`;
                break;

            case "h3":
                tag = html`<h3 class="muto muto-heading" style="${this._config.css ?? ""}">
                    ${this.tagContent()}
                </h3>`;
                break;

            default: // or h1
                tag = html`<h1 class="muto muto-heading" style="${this._config.css ?? ""}">
                    ${this.tagContent()}
                </h1>`;
        }

        return tag;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                h1.muto-heading {
                    --mdc-icon-size: 1.5em;
                }
                h2.muto-heading {
                    --mdc-icon-size: 1.17em;
                }
                h3.muto-heading {
                    --mdc-icon-size: 1em;
                }
            `,
        ];
    }
}
