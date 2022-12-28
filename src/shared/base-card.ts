import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { motoCSS, colorsCSS, themeCSS } from "../theme";
import {
    createThing,
    fireEvent,
    HomeAssistant,
    LovelaceCard,
    LovelaceCardConfig,
} from "custom-card-helpers";
import { property } from "lit/decorators.js";
import { HassEntity } from "home-assistant-js-websocket";
import { deviceTypeForEntity } from "./helpers";

export class MutoBaseCard extends LitElement implements LovelaceCard {
    @property({
        attribute: false,
    })
    hass!: HomeAssistant;
    @property() config!: any;

    constructor() {
        super();
        this.config = this.config || {};
    }

    updated(changedProperties: PropertyValues) {
        if (changedProperties.has("hass")) {
            this.hassChanged();
        }
    }

    getCardSize(): number | Promise<number> {
        return 1;
    }

    public entity(): HassEntity {
        if (!this.hass || !this.config) {
            throw new Error("No hass or config");
        }
        return this.hass.states[this.config.entity];
    }

    public hassChanged(): void {}

    public clickAction(action?: string): Function {
        if (this.config.entity) {
            let finalAction = action ?? this.config.action;
            switch (finalAction) {
                case "more-info":
                    return this.moreInfoAction();

                default: // default = click
                    switch (deviceTypeForEntity(this.hass.states[this.config.entity])) {
                        case "switch":
                            return this.toggleSwitch();
                        case "light":
                            return this.toggleLight();
                        default:
                            return this.moreInfoAction();
                    }
            }
        } else {
            return () => console.error("No entity provided");
        }
    }

    public moreInfoAction(): Function {
        return () => {
            fireEvent(this, "hass-more-info", { entityId: this.config.entity });
        };
    }

    public toggleLight(): Function {
        return () => {
            this.hass.callService("light", "toggle", { entity_id: this.config.entity });
        };
    }

    public toggleSwitch(): Function {
        return () => {
            this.hass.callService("switch", "toggle", { entity_id: this.config.entity });
        };
    }

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
