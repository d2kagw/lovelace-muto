import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import { property } from "lit/decorators.js";
import { FloorplanAreaConfig, FloorplanCardConfig } from "./floorplan-card-config";
import { HomeAssistant, LovelaceCard } from "custom-card-helpers";
import { colorForEntityState, iconForClimateEntity } from "../../shared/helpers";
import { FLOORPLAN_CARD_NAME, FLOORPLAN_STATUS_CARD_NAME } from "../const";

@customElement(FLOORPLAN_STATUS_CARD_NAME)
export class FloorPlanStatusCard extends LitElement {
    @property() area!: FloorplanAreaConfig;
    @property() hass!: HomeAssistant;

    public hasStatuses(): boolean {
        return !(
            this.area.climate == undefined &&
            this.area.temperature == undefined &&
            this.area.motion == undefined
        );
    }

    public renderClimate(): TemplateResult {
        if (!this.area.climate) {
            return html``;
        }
        if (this.hass.states[this.area.climate] == undefined) {
            console.error(
                `Muto FloorPlan Card`,
                `Can't find climate entity`,
                this.area.motion,
                this.area,
                this
            );
            return html``;
        }
        let cssColor: string = colorForEntityState(this.hass.states[this.area.climate]);
        return html`<div class="muto muto-floorplan-status-card-entry">
            <muto-icon
                .icon=${iconForClimateEntity(this.hass.states[this.area.climate]) || "mdi:close"}
                .style=${`color: ${cssColor};`}
            ></muto-icon>
        </div>`;
    }

    public renderTemperature(): TemplateResult {
        if (!this.area.temperature) {
            return html``;
        }
        if (this.hass.states[this.area.temperature] == undefined) {
            console.error(
                `Muto FloorPlan Card`,
                `Can't find temperature entity`,
                this.area.motion,
                this.area,
                this
            );
            return html``;
        }
        return html`<div class="muto muto-floorplan-status-card-entry">
            ${parseInt(this.hass.states[this.area.temperature].state) +
            (this.hass.states[this.area.temperature].attributes.unit_of_measurement ?? "")}
        </div>`;
    }

    public renderMotion(): TemplateResult {
        if (!this.area.motion) {
            return html``;
        }
        if (this.hass.states[this.area.motion] == undefined) {
            console.error(
                `Muto FloorPlan Card`,
                `Can't find motion entity`,
                this.area.motion,
                this.area,
                this
            );
            return html``;
        }
        return html`<div class="muto muto-floorplan-status-card-entry">
            <muto-icon
                .style=${this.hass.states[this.area.motion].state == "on"
                    ? "color: var(--muto-color-positive);"
                    : ""}
                .icon=${this.hass.states[this.area.motion].state == "on"
                    ? "mdi:walk"
                    : "mdi:account-off-outline"}
            ></muto-icon>
        </div>`;
    }

    protected render(): TemplateResult {
        if (this.area == undefined) {
            throw new Error(`Area is missing`);
        }
        if (this.hass == undefined) {
            throw new Error(`HASS is missing`);
        }
        return html`
            <div class="muto muto-floorplan-status-card">
                ${this.hasStatuses()
                    ? html`<div class="muto muto-floorplan-status-frame">
                          ${this.renderMotion()} ${this.renderTemperature()} ${this.renderClimate()}
                      </div>`
                    : ``}
            </div>
        `;
    }
    static get styles(): CSSResultGroup {
        return [
            css`
                .muto-floorplan-status-frame {
                    display: flex;

                    border-radius: var(--muto-border-radius);
                    padding: calc(var(--muto-unit) / 4);
                    gap: calc(var(--muto-unit) / 2);

                    background: var(--muto-card-background);
                }
                .muto-floorplan-status-card-entry {
                    font-size: 0.75rem;
                    --mdc-icon-size: 1.25rem;
                }
                @media only screen and (max-width: 768px) {
                    .muto-floorplan-status-frame {
                        display: none;
                    }
                }
            `,
        ];
    }
}

@customElement(FLOORPLAN_CARD_NAME)
export class FloorplanCard extends MutoBaseCard {
    @property() config!: FloorplanCardConfig;
    @property() selectedAreaIndex: number;
    @property() areaCards: LovelaceCard[];

    constructor() {
        super();
        this.areaCards = [];
        this.selectedAreaIndex = 0;
    }

    public setConfig(config: FloorplanCardConfig): void {
        if (config.floorplan == undefined) {
            throw new Error(`Floorplan is missing`);
        }
        if (config.areas == undefined || config.areas.length == 0) {
            throw new Error(`No areas provided`);
        }

        this.config = {
            ...config,
        };

        this._createCards();
    }

    private async _createCards() {
        this.areaCards = await Promise.all(
            this.config!.areas.map(async (area) => this._createCard(area.card))
        );
    }

    public hassChanged(): void {
        this.areaCards.forEach((card) => (card.hass = this.hass));
    }

    public renderAreaImage(area: FloorplanAreaConfig, index: number): TemplateResult {
        let stylesheets: string = `
            background-image: url(${area.floorplan});
            top: ${area.top};
            left: ${area.left};
            width: ${area.width};
            height: ${area.height};
        `;
        return html`<muto-floorplan-status-card
            class="muto muto-floorplan-map-area"
            .area=${area}
            .hass=${this.hass}
            @click=${this.areaClicked(area, index)}
            style=${stylesheets}
        ></muto-floorplan-status-card>`;
    }

    public areaClicked(_area: FloorplanAreaConfig, index: number): Function {
        return () => {
            this.selectedAreaIndex = index;
        };
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error(`Muto Floorplan Card`, `No hass or config`);
            return html``;
        }

        let floorplanCSS = `
            background-image: url(${this.config.floorplan});
            aspect-ratio: ${this.config.aspect_ratio};
        `;

        return html`
            <muto-floorplan class="muto muto-floorplan" style="${this.config.css ?? ""}">
                <muto-floorplan-map class="muto muto-floorplan-map" style="${floorplanCSS}">
                    ${this.config.areas.map((area, index) => {
                        return this.renderAreaImage(area, index);
                    })}
                </muto-floorplan-map>
                <muto-floorplan-map class="muto muto-floorplan-cards">
                    ${this.areaCards[this.selectedAreaIndex]}
                </muto-floorplan-map>
            </muto-floorplan>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
                .muto-floorplan {
                    display: flex;
                    max-height: var(--muto-max-height);
                    flex-direction: column;
                }
                .muto-floorplan-map,
                .muto-floorplan-cards {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                    flex-shrink: 1;
                    flex-basis: 30%;
                    gap: var(--muto-spacing);
                    overflow: hidden scroll;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .muto-floorplan-map::-webkit-scrollbar,
                .muto-floorplan-cards::-webkit-scrollbar {
                    display: none;
                }
                .muto-floorplan-map {
                    background-size: cover;
                    background-position: left top;
                    margin: var(--muto-spacing) 0 0;
                    flex-grow: 0;
                    flex-shrink: 0;
                    flex-basis: auto;
                    position: relative;
                }
                .muto-floorplan-map-area {
                    position: absolute;
                    background-size: 100% 100%;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .muto-floorplan-map-area:active {
                    filter: brightness(1.5);
                }
            `,
        ];
    }
}
