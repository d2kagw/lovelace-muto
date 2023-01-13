import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../icon";
import { property } from "lit/decorators.js";
import "../button-card/button-card";
import { WEATHER_CARD_NAME } from "../const";
import { WeatherCardConfig } from "./weather-card-config";
import { SliderControlCard } from "../control-card/control-card";
import { ButtonCard } from "../button-card/button-card";

@customElement(WEATHER_CARD_NAME)
export class WeatherCard extends SliderControlCard {
    @property() config!: WeatherCardConfig;

    public renderLabel(): TemplateResult {
        let sensorEntity = this.entity(this.config.sensor_entity);
        let weatherState: string = sensorEntity.state;
        let sublabel: string = [
            sensorEntity.attributes.precipitation
                ? `Rain ${sensorEntity.attributes.precipitation}${sensorEntity.attributes.precipitation_unit}`
                : false,
            sensorEntity.attributes.humidity
                ? `Humidity ${sensorEntity.attributes.humidity}%`
                : false,
            sensorEntity.attributes.wind_speed
                ? `Wind ${sensorEntity.attributes.wind_speed}${sensorEntity.attributes.wind_speed_unit}`
                : false,
        ]
            .filter(Boolean)
            .join(", ");

        let action = {
            type: "more-info",
            entity: sensorEntity.entity_id,
        };

        return html`
            <muto-control-label
                .labelText=${weatherState}
                .subLabelText=${sublabel}
                @click=${this.clickAction(action)}
            ></muto-control-label>
        `;
    }

    public renderIcon(sensor?: string): TemplateResult {
        let buttonConfig = {
            icon: `mdi:weather-${this.entity(sensor).state}`,
            status_entity: sensor,
            action: { type: "more-info", entity: sensor },
        };

        return html`<muto-button-card
            .config=${buttonConfig}
            .hass=${this.hass}
        ></muto-button-card>`;
    }

    public renderForecast(forecast: object): TemplateResult {
        let condition: string = forecast["condition"];
        switch (condition) {
            case "partlycloudy":
                condition = "partly-cloudy";
                break;

            default:
                break;
        }

        let buttonConfig = {
            icon: `mdi:weather-${condition}`,
            status_entity: this.config.sensor_entity,
            label: `${forecast["temperature"]}${
                this.entity(this.config.sensor_entity).attributes.temperature_unit
            }`,
        };

        return html`<muto-button-card
            .config=${buttonConfig}
            .hass=${this.hass}
        ></muto-button-card>`;
    }

    public render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        return html`
            <muto-control class="muto muto-panel muto-control" style="${this.config.css ?? ""}">
                ${this.renderIcon(this.config.sensor_entity)} ${this.renderLabel()}
                ${this.renderSensor(this.config.sensor_entity)}
            </muto-control>
            <muto-weather-forecast>
                ${this.entity(this.config.sensor_entity).attributes.forecast.map((forecast) =>
                    this.renderForecast(forecast)
                )}
            </muto-weather-forecast>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                muto-control-label {
                    text-transform: capitalize;
                }
                muto-weather-forecast {
                    margin-top: var(--muto-unit);
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    gap: var(--muto-unit);
                }
            `,
        ];
    }
}
