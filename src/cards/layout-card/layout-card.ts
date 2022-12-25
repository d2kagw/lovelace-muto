import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import { LayoutCardConfig } from "./layout-card-config";
import {
    LAYOUT_CARD_100_NAME,
    LAYOUT_CARD_244_NAME,
    LAYOUT_CARD_235_NAME,
    LAYOUT_CARD_BLOCK_NAME,
} from "./const";
import { LovelaceCard } from "custom-card-helpers";

@customElement(LAYOUT_CARD_BLOCK_NAME)
export class LayoutBlockCard extends MutoBaseCard implements LovelaceCard {
    @property() public _cards: LovelaceCard[];

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
        this.validateConfig(config);

        this.config = {
            ...config,
        };

        this._createCards();
    }

    public validateConfig(config: LayoutCardConfig): void {
        if (!config.cards) {
            throw new Error(`No cards provided`);
        }
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
            <div class="muto muto-layout muto-layout-block" style=${this.config.css ?? ""}>
                ${this._cards.map((card) => card)}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-layout-block {
                    display: flex;
                    flex-direction: column;
                    gap: var(--muto-spacing);
                }
            `,
        ];
    }
}

@customElement(LAYOUT_CARD_100_NAME)
export class Layout100Card extends LayoutBlockCard {
    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        return html`
            <div class="muto muto-layout muto-layout-100" style=${this.config.css ?? ""}>
                ${this._cards.map(
                    (card) => html`<div class="muto muto-layout-child">${card}</div>`
                )}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                    display: block;
                }
                .muto-layout-100 {
                    padding: var(--muto-spacing) var(--muto-spacing) 0;
                    gap: var(--muto-spacing);
                    display: flex;
                    flex-direction: column;
                }
                .muto-layout-100 .muto-layout-child {
                    /* no styles */
                }
            `,
        ];
    }
}

@customElement(LAYOUT_CARD_244_NAME)
export class Layout244Card extends LayoutBlockCard {
    public validateConfig(config: LayoutCardConfig): void {
        super.validateConfig(config);
        if (config.cards.length != 3) {
            console.error(`Muto 244 Layout expects exactly 3 cards`, config);
            throw new Error(`Muto 244 Layout expects exactly 3 cards`);
        }
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        return html`
            <div class="muto muto-layout muto-layout-244" style=${this.config.css ?? ""}>
                <div class="muto-layout-244-column muto-layout-244-column-0">${this._cards[0]}</div>
                <div class="muto-layout-244-column muto-layout-244-column-1">${this._cards[1]}</div>
                <div class="muto-layout-244-column muto-layout-244-column-2">${this._cards[2]}</div>
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-layout-244 {
                    display: flex;
                    height: 100%;
                    max-height: 93vh;
                    padding: var(--muto-spacing) var(--muto-spacing) 0;
                    gap: var(--muto-spacing);
                }
                .muto-layout-244-column {
                    flex-grow: 1;
                    flex-shrink: 1;
                    flex-basis: 30%;
                    gap: var(--muto-spacing);
                    overflow: hidden scroll;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .muto-layout-244-column::-webkit-scrollbar {
                    display: none;
                }
                .muto-layout-244-column-0 {
                    flex-shrink: 0;
                    flex-grow: 0;
                    flex-basis: 20%;
                    display: flex;
                    flex-direction: column;
                }
                @media only screen and (max-width: 1000px) {
                    .muto-layout-244 {
                        flex-direction: column;
                        height: auto;
                        max-height: none;
                        padding-bottom: var(--muto-spacing);
                    }
                    .muto-layout-244-column {
                        overflow: visible;
                        flex-basis: auto;
                    }
                    .muto-layout-244-column-0 {
                        flex-shrink: 1;
                        flex-grow: 1;
                        flex-basis: auto;
                    }
                }
            `,
        ];
    }
}
