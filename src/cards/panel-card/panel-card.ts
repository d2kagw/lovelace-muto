import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import { LovelaceCard } from "custom-card-helpers";
import { classMap } from "lit/directives/class-map.js";
import { PANEL_CARD_NAME } from "../const";
import { PanelCardConfig } from "./panel-card-config";

@customElement(PANEL_CARD_NAME)
export class PanelCard extends MutoBaseCard {
    @property() public _cards: LovelaceCard[];
    @property() config!: PanelCardConfig;

    constructor() {
        super();
        this._cards = [];
    }

    public hassChanged(): void {
        this._cards.forEach((card) => (card.hass = this.hass));
    }

    updated(changedProperties: PropertyValues): void {
        super.updated(changedProperties);
        if (this._cards.length == 0) return;
    }

    public setConfig(config: PanelCardConfig): void {
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
            console.error("No hass or config");
            return html``;
        }

        let padded: boolean = this.config.padded == false ? false : true;

        return html`
            <div
                class=${classMap({
                    muto: true,
                    "muto-panel": true,
                    "muto-panel-no-padding": !padded,
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
                .muto-panel {
                    padding: var(--muto-unit);
                    overflow: hidden;
                }
                .muto-panel.muto-panel-no-padding {
                    padding: 0;
                }
            `,
        ];
    }
}
