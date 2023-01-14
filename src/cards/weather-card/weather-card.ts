import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../icon";
import { property } from "lit/decorators.js";
import "../button-card/button-card";
import { WEATHER_CARD_NAME } from "../const";
import { WeatherCardConfig } from "./weather-card-config";
import { SliderControlCard } from "../control-card/control-card";
import { ButtonCard } from "../button-card/button-card";
import { LayoutRowCardConfig } from "../layout-card/layout-card-config";
import { LayoutRowCard } from "../layout-card/layout-card";

@customElement(WEATHER_CARD_NAME)
export class WeatherCard extends SliderControlCard {
    @property() config!: WeatherCardConfig;

    public renderWeatherLabel(): TemplateResult {
        let weatherEntity = this.entity(this.config.weather_entity);
        let weatherState: string = weatherEntity.state;
        let sublabel: string = [
            weatherEntity.attributes.precipitation
                ? `Rain ${weatherEntity.attributes.precipitation}${weatherEntity.attributes.precipitation_unit}`
                : false,
            weatherEntity.attributes.humidity
                ? `Humidity ${weatherEntity.attributes.humidity}%`
                : false,
            weatherEntity.attributes.wind_speed
                ? `Wind ${weatherEntity.attributes.wind_speed}${weatherEntity.attributes.wind_speed_unit}`
                : false,
        ]
            .filter(Boolean)
            .join(", ");

        let action = {
            type: "more-info",
            entity: weatherEntity.entity_id,
        };

        return html`
            <muto-control-label
                .labelText=${weatherState}
                .subLabelText=${sublabel}
                @click=${this.clickAction(action)}
            ></muto-control-label>
        `;
    }

    public renderWeatherIcon(): TemplateResult {
        let buttonConfig = {
            icon: `mdi:weather-${this.entity(this.config.weather_entity).state}`,
            status_entity: this.config.weather_entity,
            action: { type: "more-info", entity: this.config.weather_entity },
        };

        return html`<muto-button-card
            .config=${buttonConfig}
            .hass=${this.hass}
        ></muto-button-card>`;
    }

    public renderMoonIcon(): TemplateResult {
        let buttonConfig = {
            icon: this.entity(this.config.moon_entity).attributes.icon,
            status_entity: this.config.moon_entity,
            action: { type: "more-info", entity: this.config.moon_entity },
        };

        return html`<muto-button-card
            .config=${buttonConfig}
            .hass=${this.hass}
        ></muto-button-card>`;
    }

    public renderMoonLabel(): TemplateResult {
        let moon_entity = this.entity(this.config.moon_entity);

        let action = {
            type: "more-info",
            entity: this.config.moon_entity,
        };

        let label = `Moon: ${moon_entity.state.replace(/_/g, " ")}`;

        return html`
            <muto-control-label
                .labelText=${label}
                @click=${this.clickAction(action)}
            ></muto-control-label>
        `;
    }

    public forecastButtonConfigs(forecast: object): object {
        let condition: string = forecast["condition"];
        switch (condition) {
            case "partlycloudy":
                condition = "partly-cloudy";
                break;

            default:
                break;
        }

        let buttonConfig = {
            type: "custom:muto-button-card",
            icon: `mdi:weather-${condition}`,
            status_entity: this.config.weather_entity,
            label: `${forecast["temperature"]}${
                this.entity(this.config.weather_entity).attributes.temperature_unit
            }`,
        };

        return buttonConfig;
    }

    public render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        return html`
            <muto-control class="muto muto-panel muto-control muto-weather-current">
                ${this.renderWeatherIcon()} ${this.renderWeatherLabel()}
                ${this.renderSensor(this.config.weather_entity)}
            </muto-control>
            ${this.entity(this.config.weather_entity).attributes.forecast
                ? html`<div class="muto muto-row muto-row-fit-scroll muto-weather-forecast">
                      ${this.entity(this.config.weather_entity).attributes.forecast.map(
                          (forecast) =>
                              html`<muto-button-card
                                  .config=${this.forecastButtonConfigs(forecast)}
                                  .hass=${this.hass}
                              ></muto-button-card>`
                      )}
                  </div>`
                : ``}
            ${this.config.moon_entity
                ? html`<muto-control class="muto muto-panel muto-control muto-moon">
                      ${this.renderMoonIcon()} ${this.renderMoonLabel()}
                  </muto-control>`
                : ``}
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                muto-control-label {
                    text-transform: capitalize;
                }
                .muto-weather-forecast,
                .muto-moon {
                    margin-top: var(--muto-unit);
                }
            `,
        ];
    }
}
