import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { motoCSS, colorsCSS, themeCSS } from "../theme";
import { createThing, HomeAssistant, LovelaceCard, LovelaceCardConfig } from "custom-card-helpers";
import { property } from "lit/decorators.js";

export class MutoBaseCard extends LitElement implements LovelaceCard {
    @property({
        attribute: false,
    })
    hass!: HomeAssistant;
    @property() config!: any;

    updated(changedProperties: PropertyValues) {
        if (changedProperties.has("hass")) {
            this.hassChanged();
        }
    }

    getCardSize(): number | Promise<number> {
        return 1;
    }

    public hassChanged(): void {}

    public setConfig(config: any): void {
        this.config = {
            ...config,
        };
    }

    private HELPERS = (window as any).loadCardHelpers
        ? (window as any).loadCardHelpers()
        : undefined;
    async _createCard(config: LovelaceCardConfig): Promise<LovelaceCard> {
        let element: LovelaceCard;
        if (this.HELPERS) {
            element = (await this.HELPERS).createCardElement(config);
        } else {
            element = createThing(config);
        }
        if (this.hass) {
            element.hass = this.hass;
        }
        return element;
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                ${motoCSS}
                :host {
                    ${colorsCSS};
                    ${themeCSS};
                }
            `,
        ];
    }
}
