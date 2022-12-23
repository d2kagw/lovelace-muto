import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import { LayoutCardConfig } from "./layout-card-config";
import { LAYOUT_CARD_NAME } from "./const";
import { HomeAssistant, LovelaceCard } from "custom-card-helpers";

@customElement(LAYOUT_CARD_NAME)
export class LayoutCard extends MutoBaseCard implements LovelaceCard {
    @property() private _cards: LovelaceCard[];
    // private config!: LayoutCardConfig;

    constructor() {
        super();
        this._cards = [];
        this.config = this.config || {};
    }

    public hassChanged(): void {
        this._cards.forEach((card) => (card.hass = this.hass));
    }

    updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (this._cards.length == 0) return;
    }

    public setConfig(config: LayoutCardConfig): void {
        if (!config.cards) {
            throw new Error(`No cards provided`);
        }

        this.config = {
            ...config,
        };

        this._createCards();
    }

    private async _createCards() {
        this._cards = await Promise.all(
            this.config!.cards.map(async (card) => this._createCard(card))
        );
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        return html`
            <div class="muto muto-layout" style=${this.config.css ?? ""}>
                ${this._cards.map((card) => card)}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-layout {
                    padding: var(--muto-spacing);
                }
            `,
        ];
    }
}
