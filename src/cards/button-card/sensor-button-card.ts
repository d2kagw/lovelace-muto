import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../../shared/icon";
import { SENSOR_BUTTON_CARD_NAME } from "./const";
import { ButtonCard } from "./button-card";
import { iconForEntity } from "../../shared/helpers";

@customElement(SENSOR_BUTTON_CARD_NAME)
export class SensorButtonCard extends ButtonCard {
    public buttonContent(): TemplateResult {
        if ("icon" in this.config || "label" in this.config) {
            return super.buttonContent();
        } else if (this.config.entity) {
            if (this.hass.states[this.config.entity]) {
                let label: string =
                    this.hass.states[this.config.entity].state +
                    this.hass.states[this.config.entity].attributes.unit_of_measurement;
                return html`<label>${label}</label>`;
            } else {
                return html` <muto-icon
                    icon="${iconForEntity(this.hass, this.config.entity)}"
                ></muto-icon>`;
            }
        } else {
            return html`<label>Unknown Sensor</label>`;
        }
    }
}
