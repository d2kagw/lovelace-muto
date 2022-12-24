import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import { FlexCardConfig } from "./flex-card-config";
import { FLEX_COLUMN_CARD_NAME, FLEX_ROW_CARD_NAME } from "./const";
import { LovelaceCard } from "custom-card-helpers";

export class FlexCard extends MutoBaseCard implements LovelaceCard {
    @property() private _cards: LovelaceCard[];
    classType: string;

    constructor() {
        super();
        this.classType = "super";
        this._cards = [];
        this.config = this.config || {};
    }

    updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (this._cards.length == 0) return;
    }

    hassChanged(): void {
        this._cards.forEach((card) => (card.hass = this.hass));
    }

    public setConfig(config: FlexCardConfig): void {
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
            <muto-flex class="muto ${this.classType}" style=${this.config.css ?? ""}>
                ${this._cards.map((card) => card)}
            </muto-flex>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                muto-flex {
                    display: flex;
                    flex-wrap: no-wrap;
                    justify-content: flex-start;
                    align-items: stretch;
                    gap: var(--muto-spacing, 16px);
                }
                .muto-flex-row {
                    flex-direction: row;
                }
                .muto-flex-column {
                    flex-direction: column;
                }
            `,
        ];
    }
}

@customElement(FLEX_ROW_CARD_NAME)
export class FlexRowCard extends FlexCard implements LovelaceCard {
    constructor() {
        super();
        this.classType = "muto-flex-row";
    }
}

@customElement(FLEX_COLUMN_CARD_NAME)
export class FlexColumnCard extends FlexCard implements LovelaceCard {
    constructor() {
        super();
        this.classType = "muto-flex-column";
    }
}
