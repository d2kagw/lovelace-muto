import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import "../icon";
import { classMap } from "lit/directives/class-map.js";
import { ControlCardConfig } from "./control-card-config";
import { MutoBaseCard } from "../../shared/base-card";
import { property } from "lit/decorators.js";
import "../button-card/button-card";
import { deviceTypeForEntity } from "../../shared/helpers";
import { CONTROL_LABEL_NAME, SENSOR_CONTROL_CARD_NAME, SLIDER_CONTROL_CARD_NAME } from "../const";
import { ButtonCardConfig } from "../button-card/button-card-config";

@customElement(CONTROL_LABEL_NAME)
export class ControlCardLabel extends LitElement {
    @property() labelText!: String;
    @property() subLabelText?: String;
    @property() isSliding: boolean;
    @property() startingX: Number | null;
    @property() boundingRect: DOMRect | undefined;
    @property() slidingPercent: Number | null;

    constructor() {
        super();
        this.isSliding = false;
        this.startingX = null;
        this.boundingRect = undefined;
        this.slidingPercent = null;
    }

    public slideStart(event: PointerEvent): void {
        console.warn("slideStart", event.clientX);
        this.boundingRect = this.getBoundingClientRect();
        this.isSliding = true;
    }

    public slideMove(event: PointerEvent): void {
        if (this.isSliding) {
            this.slidingPercent =
                (event.clientX - this.boundingRect!.left) / this.boundingRect!.width;
            // console.warn("slideMove", this.slidingPercent);
        }
    }

    public slideStop(event: PointerEvent): void {
        if (this.isSliding) {
            console.info("slid to", this.slidingPercent, event);
        }
        this.isSliding = false;
        this.startingX = null;
        this.boundingRect = undefined;
        this.slidingPercent = null;
    }

    public slideCancel(event: PointerEvent): void {
        if (this.isSliding) {
            console.info("slid to", this.slidingPercent, event);
        }
        this.isSliding = false;
        this.startingX = null;
        this.boundingRect = undefined;
        this.slidingPercent = null;
    }

    protected render(): TemplateResult {
        return html`
            <div
                class="muto muto-control-label"
                @pointerdown="${this.slideStart}"
                @pointermove="${this.slideMove}"
                @pointerup="${this.slideStop}"
                @pointerleave="${this.slideCancel}"
                @touchstart="${this.slideStart}"
                @drag="${this.slideMove}"
                @dragend="${this.slideStop}"
                @dragleave="${this.slideCancel}"
            >
                <div class="muto muto-control-label-heading">${this.labelText}</div>
                ${this.subLabelText
                    ? html`<div class="muto muto-control-label-subheading">
                          ${this.subLabelText}
                      </div>`
                    : ""}
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            css`
                .muto-control-label-heading {
                    font-family: var(--muto-font);
                    font-weight: var(--muto-font-weight-bold);
                    font-size: calc(var(--muto-unit) * 1.2);

                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: "none";
                    overflow: hidden;
                    hyphens: auto;
                }

                .muto-control-label-subheading {
                    font-family: var(--muto-font);
                    font-size: calc(var(--muto-unit));
                }
            `,
        ];
    }
}

@customElement(SLIDER_CONTROL_CARD_NAME)
export class SliderControlCard extends MutoBaseCard {
    @property() config!: ControlCardConfig;

    public renderButton(): TemplateResult {
        let buttonConfig = {
            status_entity: this.entity()!.entity_id,
            action: this.config.action,
            icon: undefined as any,
        };

        return html`<muto-button-card
            .config=${buttonConfig}
            .hass=${this.hass}
        ></muto-button-card>`;
    }

    public renderLabel(): TemplateResult {
        let label: string = this.entity().attributes.friendly_name ?? this.entity().entity_id;
        let sublabel: string | false = this.config.sublabel ?? false;

        if (!sublabel && deviceTypeForEntity(this.entity()) == "climate") {
            sublabel = [
                this.entity().attributes.temperature
                    ? `${this.entity().attributes.temperature}º`
                    : "",
                this.entity().attributes.fan_mode
                    ? `Fan on ${this.entity().attributes.fan_mode}`
                    : "",
                this.entity().attributes.hvac_action ?? "",
                this.entity().attributes.swing_mode
                    ? `Swing ${this.entity().attributes.swing_mode}`
                    : "",
            ]
                .filter((n) => n)
                .join(", ")
                .toLowerCase();
        }

        if (deviceTypeForEntity(this.entity()) == "media_player") {
            label = this.entity().attributes.friendly_name ?? this.entity().entity_id;
            sublabel = `${this.entity().attributes.media_title ?? "Unknown"} - ${
                this.entity().attributes.media_artist ?? "Unknown"
            }`;
        }

        return html`
            <muto-control-label
                .labelText=${this.config.label ?? label}
                .subLabelText=${sublabel}
            ></muto-control-label>
        `;
    }

    public renderSensor(sensor?: string): TemplateResult {
        let sensorConfig = {
            status_entity: sensor ?? this.config.sensor_entity,
            action: {
                type: "more-info",
                entity: sensor ?? this.config.sensor_entity,
            },
            display: "state",
        };
        return html`${sensorConfig.status_entity
            ? html`<muto-sensor-button-card
                  .config=${sensorConfig}
                  .hass=${this.hass}
              ></muto-sensor-button-card>`
            : ``}`;
    }

    public renderChildren(): TemplateResult {
        return html`${this.renderButton()} ${this.renderLabel()} ${this.renderSensor()}`;
    }

    public render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        return html`
            <muto-control
                class=${classMap({
                    muto: true,
                    "muto-panel": true,
                    "muto-control": true,
                })}
                style="${this.config.css ?? ""}"
            >
                ${this.renderChildren()}
            </muto-control>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                    width: 100%;
                    display: block;
                }

                .muto-control {
                    background-color: var(--muto-card-background);
                    padding: 0;

                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                    overflow: hidden;

                    width: 100%;
                    height: var(--muto-row-height);
                }

                .muto-control muto-button-card,
                .muto-control muto-sensor-button-card {
                    width: var(--muto-row-height);

                    flex-grow: 0;
                    flex-shrink: 0;
                }

                muto-control-label {
                    flex-grow: 1;
                    flex-shrink: 1;

                    box-sizing: border-box;

                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    height: 100%;
                    padding: var(--muto-spacing);
                }
            `,
        ];
    }
}

@customElement(SENSOR_CONTROL_CARD_NAME)
export class SensorControlCard extends SliderControlCard {
    public renderLabel(): TemplateResult {
        let friendlyName: string =
            this.entity().attributes.friendly_name ?? this.entity().entity_id;
        let sublabel: string | false = this.config.sublabel ?? false;

        let action = {
            type: "more-info",
            entity: this.entity().entity_id,
        };

        return html`
            <muto-control-label
                .labelText=${this.config.label ?? friendlyName}
                .subLabelText=${sublabel}
                @click=${this.clickAction(action)}
            ></muto-control-label>
        `;
    }

    public renderChildren(): TemplateResult {
        return html`${this.renderLabel()} ${this.renderSensor(this.config.sensor_entity)}`;
    }
}
