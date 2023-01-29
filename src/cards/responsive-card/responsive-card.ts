import { css, CSSResultGroup, html, PropertyValues, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import "../icon";
import { ResponsiveCardConfig } from "./responsive-card-config";
import { RESPONSIVE_CARD_NAME } from "../const";
import { classMap } from "lit/directives/class-map.js";
import { LovelaceCard } from "custom-card-helpers";

@customElement(RESPONSIVE_CARD_NAME)
export class ResponsiveCard extends MutoBaseCard {
    @property() public _cards: LovelaceCard[];
    @property() config!: ResponsiveCardConfig;

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

    public setConfig(config: ResponsiveCardConfig): void {
        if (!config.cards) {
            throw new Error(`No card provided`);
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
            console.error(`Muto Clock Card`, `No hass or config`);
            return html``;
        }

        return html`
            <muto-responsive
                class=${classMap({
                    muto: true,
                    "muto-responsive": true,
                    "muto-show-on-mobile": this.config.show_on_mobile == true,
                    "muto-hide-on-mobile": this.config.hide_on_mobile == true,
                })}
            >
                ${this._cards.map((card) => card)}
            </muto-responsive>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-show-on-mobile {
                    display: none;
                }
                @media only screen and (max-width: 768px) {
                    .muto-show-on-mobile {
                        display: initial;
                    }
                    .muto-hide-on-mobile {
                        display: none;
                    }
                }
            `,
        ];
    }
}
