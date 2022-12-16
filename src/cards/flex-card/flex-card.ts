import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LovelaceCard, LovelaceCardConfig, HomeAssistant } from "../../ha";
import { MutoBaseCard } from "../../ha/base-card";
import { FlexCardConfig } from "./flex-card-config";
import { FLEX_COLUMN_CARD_NAME, FLEX_ROW_CARD_NAME } from "./const";

export class FlexCard extends MutoBaseCard implements LovelaceCard {
    @property() private _cards: LovelaceCard[];
    private _config!: FlexCardConfig;
    classType: string;

    constructor() {
        super();
        this.classType = "super";
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

    public setConfig(config: FlexCardConfig): void {
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
            <div class="muto-flex ${this.classType}" style=${this._config.css ?? ""}>
                ${this._cards.map((card) => card)}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-flex {
                    display: flex;
                    flex-wrap: no-wrap;
                    justify-content: flex-start;
                    align-items: stretch;
                    gap: 1rem;
                }
                .muto-flex-row {
                    flex-direction: row;
                }
                .muto-flex-column {
                    flex-direction: column;
                }
                .muto-flex-child {
                    width: 100%;
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
