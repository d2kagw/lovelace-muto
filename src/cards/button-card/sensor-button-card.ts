import { html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../../shared/icon";
import { BINARY_SENSOR_BUTTON_CARD_NAME, METRIC_SENSOR_BUTTON_CARD_NAME } from "./const";
import { ButtonCard } from "./button-card";
import { iconForEntity } from "../../shared/helpers";

@customElement(BINARY_SENSOR_BUTTON_CARD_NAME)
export class BinarySensorButtonCard extends ButtonCard {}

@customElement(METRIC_SENSOR_BUTTON_CARD_NAME)
export class MetricSensorButtonCard extends ButtonCard {
    public buttonContent(): TemplateResult {
        if ("icon" in this.config || "label" in this.config) {
            return super.buttonContent();
        } else {
            if (this.hass.states[this.config.entity]) {
                return html`<label
                    >${this.hass.states[this.config.entity].state}
                    ${this.hass.states[this.config.entity].attributes.unit_of_measurement}</label
                >`;
            } else {
                return html` <muto-icon
                    icon="${iconForEntity(this.hass, this.config.entity)}"
                ></muto-icon>`;
            }
        }
    }
}
