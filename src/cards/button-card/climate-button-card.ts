import { customElement } from "lit/decorators.js";
import "../../shared/icon";
import { CLIMATE_BUTTON_CARD_NAME } from "./const";
import { ButtonCard } from "./button-card";
import { html, TemplateResult } from "lit";
import { iconForEntity } from "../../shared/helpers";

@customElement(CLIMATE_BUTTON_CARD_NAME)
export class ClimateButtonCard extends ButtonCard {
    public buttonContent(): TemplateResult {
        if ("icon" in this.config || "label" in this.config) {
            return super.buttonContent();
        } else {
            let icon: string = iconForEntity(this.hass, this.config.entity);
            if (this.hass.states[this.config.entity]) {
                switch (this.hass.states[this.config.entity].state) {
                    case "cool":
                        icon = "mdi:snowflake";
                        break;

                    case "heat":
                        icon = "mdi:fire";
                        break;

                    case "dry":
                        icon = "mdi:fan";
                        break;

                    case "fan_only":
                        icon = "mdi:fan";
                        break;

                    case "heat_dry":
                        icon = "mdi:fire";
                        break;

                    default:
                        break;
                }
            }
            return html` <muto-icon icon="${icon}"></muto-icon>`;
        }
    }
}
