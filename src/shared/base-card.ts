import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { motoCSS, colorsCSS, themeCSS } from "../theme";
import {
    HomeAssistant,
    createThing,
    handleClick,
    LovelaceCard,
    LovelaceCardConfig,
} from "custom-card-helpers";

export class MutoBaseElement extends LitElement {
    public _hass?: HomeAssistant;
    set hass(hass: HomeAssistant) {
        this._hass = hass;
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
        if (this._hass) {
            element.hass = this._hass;
        }
        return element;
    }

    protected updated(changedProps: PropertyValues): void {
        super.updated(changedProps);
        if (changedProps.has("hass") && this.hass) {
        }
    }

    static get styles(): CSSResultGroup {
        return css`
            ${motoCSS}
            :host {
                ${colorsCSS};
                ${themeCSS};
            }
        `;
    }
}

export class MutoBaseCard extends MutoBaseElement {
    getCardSize(): number | Promise<number> {
        return 1;
    }

    constructor() {
        super();
    }
}
