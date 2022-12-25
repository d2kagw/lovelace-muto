import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import {
    LayoutCardConfig,
    LayoutColumnCardConfig,
    LayoutRowCardConfig,
    LayoutRowFits,
} from "./layout-card-config";
import { LAYOUT_CARD_ROW_NAME, LAYOUT_CARD_COLUMN_NAME, LAYOUT_CARD_NAME } from "./const";
import { LovelaceCard } from "custom-card-helpers";
import { classMap } from "lit/directives/class-map.js";

@customElement(LAYOUT_CARD_COLUMN_NAME)
export class LayoutColumnCard extends MutoBaseCard implements LovelaceCard {
    @property() public _cards: LovelaceCard[];
    @property() config!: LayoutColumnCardConfig;

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
            <div class="muto muto-layout-column-card" style=${this.config.css ?? ""}>
                ${this._cards.map((card) => card)}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-layout-column-card {
                    display: flex;
                    flex-direction: column;
                    gap: var(--muto-spacing);
                }
            `,
        ];
    }
}

@customElement(LAYOUT_CARD_ROW_NAME)
export class LayoutRowCard extends LayoutColumnCard {
    @property() config!: LayoutRowCardConfig;
    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        return html`
            <div
                class=${classMap({
                    muto: true,
                    "muto-layout-row-card": true,
                    "muto-layout-fit-scroll": this.config.fit == LayoutRowFits.SCROLL,
                    "muto-layout-fit-wrap": this.config.fit == LayoutRowFits.WRAP,
                    "muto-layout-fit-scale":
                        this.config.fit == LayoutRowFits.SCALE || !("fit" in this.config),
                })}
                style=${this.config.css ?? ""}
            >
                ${this._cards.map((card) => card)}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-layout-row-card {
                    display: flex;
                    flex-direction: row;
                    gap: var(--muto-spacing);
                }
                .muto-layout-fit-wrap {
                    flex-wrap: wrap;
                }

                .muto-layout-fit-wrap > * {
                    width: auto;
                }

                .muto-layout-fit-scale > * {
                    min-width: 1px;
                }

                .muto-layout-fit-scroll {
                    overflow-y: scroll;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .muto-layout-fit-scroll::-webkit-scrollbar {
                    display: none;
                }
            `,
        ];
    }
}

@customElement(LAYOUT_CARD_NAME)
export class LayoutCard extends MutoBaseCard implements LovelaceCard {
    @property() public _columns: LovelaceCard[][];

    constructor() {
        super();
        this._columns = [];
        this.config = this.config || {};
    }

    public hassChanged(): void {
        this._columns.forEach((column) => column.forEach((card) => (card.hass = this.hass)));
    }

    updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (this._columns.length == 0) return;
    }

    public setConfig(config: LayoutCardConfig): void {
        if (config.columns.length == 0) {
            throw new Error(`No columns provided`);
        }

        this.config = {
            ...config,
        };

        this._createColumns();
    }

    private async _createColumns() {
        this._columns = await Promise.all(
            this.config!.columns.map(async (column) => this._createColumnCardStack(column))
        );
    }

    private async _createColumnCardStack(column): Promise<LovelaceCard[]> {
        return await Promise.all(column.cards.map(async (card) => this._createCard(card)));
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        return html`
            <div class="muto muto-layout" style=${this.config.css ?? ""}>
                ${this._columns.map((column, i) => {
                    return html`
                        <div
                            class="muto-layout-column muto-layout-column-${i + 1}"
                            style="
                                flex: ${this.config.columns[i].flex ?? ""};
                                ${this.config.css ?? ""};
                            "
                        >
                            ${column.map((card) => card)}
                        </div>
                    `;
                })}
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
                .muto-layout {
                    display: flex;
                    height: 100%;
                    max-height: 93vh;
                    padding: var(--muto-spacing) var(--muto-spacing) 0;
                    gap: var(--muto-spacing);
                }
                .muto-layout-column {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    flex-shrink: 1;
                    flex-basis: 30%;
                    gap: var(--muto-spacing);
                    overflow: hidden scroll;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .muto-layout-column::-webkit-scrollbar {
                    display: none;
                }
                @media only screen and (max-width: 1000px) {
                    .muto-layout {
                        flex-direction: column;
                        height: auto;
                        max-height: none;
                        padding-bottom: var(--muto-spacing);
                    }
                    .muto-layout-column {
                        overflow: visible;
                        flex-basis: auto;
                    }
                    .muto-layout-column-1 {
                        flex-shrink: 1 !important;
                        flex-grow: 1 !important;
                        flex-basis: auto !important;
                    }
                }
            `,
        ];
    }
}
