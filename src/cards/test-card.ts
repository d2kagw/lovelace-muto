import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from "custom-card-helpers";
import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../shared/base-card";
import "../shared/icon";

export type MutoTestCardConfig = LovelaceCardConfig & {
    cards: LovelaceCardConfig[];
    css?: Text;
};

@customElement("muto-test-card-row")
export class MTRowCard extends MutoBaseCard implements LovelaceCard {
    @property() private _cards: LovelaceCard[];
    private _config!: MutoTestCardConfig;

    constructor() {
        super();
        this._cards = [];
        this._config = this._config || {};
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        this._cards.forEach((card) => (card.hass = hass));
    }

    protected updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (this._cards.length == 0) return;
    }

    public setConfig(config: MutoTestCardConfig): void {
        if (!config.cards) {
            throw new Error(`No cards provided`);
        }

        this._config = {
            ...config,
        };

        this._createCards();
    }

    private async _createCards() {
        this._cards = await Promise.all(
            this._config!.cards.map(async (card) => this._createCard(card))
        );
    }

    protected render(): TemplateResult {
        if (!this._hass || !this._config) {
            return html``;
        }

        return html`
            <muto-test-row style=${this._config.css ?? ""}>
                ${this._cards.map((card) => card)}
            </muto-test-row>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                }
            `,
        ];
    }
}

@customElement("muto-test-card-button")
export class MTButtonCard extends MutoBaseCard implements LovelaceCard {
    private _config!: MutoTestCardConfig;

    constructor() {
        super();
        this._config = this._config || {};
    }

    public setConfig(config: MutoTestCardConfig): void {
        this._config = {
            ...config,
        };
    }

    protected render(): TemplateResult {
        if (!this._hass || !this._config) {
            return html``;
        }

        return html`
            <muto-test-button class="muto-panel">
                <h3 style="height: 100px;">label</h3>
            </muto-test-button>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                    background: #f00;
                    padding: var(--muto-spacing);
                }
                muto-test-button {
                    display: flex;
                }
                h3 {
                    padding: calc(var(--muto-spacing) / 2);
                    background: #0ff;
                }
            `,
        ];
    }
}
