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
import {
    MutoActionableCardConfig,
    MutoActionConfig,
    MutoCardConfig,
    MutoStatusedCardConfig,
} from "./types";
import { deviceTypeForEntity } from "./helpers";

export class MutoBaseCard extends LitElement implements LovelaceCard {
    @property({
        attribute: false,
    })
    hass!: HomeAssistant;
    @property() config!: MutoCardConfig | MutoStatusedCardConfig | MutoActionableCardConfig | any;

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

    public entity(_id?: string): HassEntity {
        if (!this.hass || !this.config) {
            throw new Error("No hass or config");
        }
        return _id ? this.hass.states[_id] : this.hass.states[this.config.status_entity];
    }

    public hassChanged(): void {}

    public clickAction(actionConfig?: MutoActionConfig): Function {
        let finalAction = actionConfig || this.config.action;
        if (finalAction == undefined) {
            return () => console.info("No action for click");
        } else {
            if (finalAction != undefined && "type" in finalAction) {
                switch (finalAction.type ?? undefined) {
                    case "more-info":
                        return this.moreInfoAction(finalAction);
                    case "service":
                    case "call-service":
                        return this.callService(finalAction);

                    case "toggle":
                        return this.toggleAction(finalAction);

                    default:
                        return () =>
                            console.info(
                                "Action not supported or uspecified",
                                finalAction,
                                this.config,
                                this
                            );
                }
            } else {
                return () => console.error("Action malformed", finalAction);
            }
        }
    }

    public moreInfoAction(action: MutoActionConfig): Function {
        let entity = action.entity || action.data.entity_id[0];
        if (!entity) {
            throw new Error("No action or action entity data found");
        }
        return () => {
            fireEvent(this, "hass-more-info", { entityId: entity });
        };
    }

    public toggleAction(action: MutoActionConfig): Function {
        switch (deviceTypeForEntity(this.entity())) {
            case "switch":
                return this.callService({
                    type: "service",
                    service: "switch.toggle",
                    data: {
                        entity_id: action.entity,
                    },
                });
            case "light":
                return this.callService({
                    type: "service",
                    service: "light.toggle",
                    data: {
                        entity_id: action.entity,
                    },
                });
            case "climate":
                return this.callService({
                    type: "service",
                    service:
                        this.entity(action.entity).state == "off"
                            ? "climate.turn_on"
                            : "climate.turn_off",
                    data: {
                        entity_id: action.entity,
                    },
                });
            default:
                console.info("Unsupported toogle action");
                return this.moreInfoAction(action);
        }
    }

    public callService(action: MutoActionConfig): Function {
        return () => {
            let serviceDetails: string[] = action.service!.split(".");
            let domain: string = serviceDetails[0];
            let service: string = serviceDetails[1];
            this.hass.callService(domain, service, action.data);
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
                .muto-clickable {
                    cursor: pointer;
                }
                .muto-clickable:active {
                    filter: brightness(1.5);
                }
            `,
        ];
    }
}
