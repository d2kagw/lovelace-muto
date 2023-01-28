import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import "../icon";
import { NotificationCardConfig } from "./notification-card-config";
import { LovelaceCard } from "custom-card-helpers";
import { classMap } from "lit/directives/class-map.js";
import { NOTIFICATION_CARD_NAME } from "../const";
import { HassEntity } from "home-assistant-js-websocket";

@customElement(NOTIFICATION_CARD_NAME)
export class NotificationCard extends MutoBaseCard {
    @property() config!: NotificationCardConfig;

    public setConfig(config: NotificationCardConfig): void {
        this.config = {
            ...config,
        };
    }

    public cssColor(): string {
        // supports: error, warn, success, or info (which is represented as debug)
        if (this.config.level) {
            switch (this.config.level) {
                case "error":
                    return "background-color: var(--muto-color-negative)";

                case "warn":
                case "warning":
                    return "background-color: var(--muto-color-alert)";

                case "success":
                    return "background-color: var(--muto-color-positive)";

                case "info":
                default:
                    return "background-color: var(--muto-card-background)";
            }
        } else {
            return "background-color: var(--muto-card-background)";
        }
    }

    public shouldShowAccordingToState(): boolean {
        if (!this.config.state_entity || !this.config.state_entity.entity) {
            return true;
        } else {
            let stateEntity: HassEntity = this.entity(this.config.state_entity.entity);
            switch (this.config.state_entity.state) {
                case true:
                case "on":
                    return stateEntity.state == "on";

                case false:
                case "off":
                    return stateEntity.state == "off";

                default:
                    console.error(
                        `Muto Notification Card`,
                        `Unsupported state_entity state`,
                        this.config.state_entity,
                        stateEntity
                    );
                    return true;
            }
        }
    }

    protected render(): TemplateResult | void {
        if (!this.hass || !this.config) {
            console.error(`Muto Notification Card`, `No hass or config`);
            return html``;
        }

        if (this.shouldShowAccordingToState()) {
            return html`
                <muto-notification
                    class=${classMap({
                        muto: true,
                        "muto-notification": true,
                        "muto-clickable": this.config.action != undefined,
                    })}
                    style=${this.cssColor()}
                    @click=${this.clickAction()}
                >
                    <muto-notification-icon class="muto muto-notification-icon">
                        <muto-icon .icon=${this.config.icon}></muto-icon>
                    </muto-notification-icon>
                    <muto-notification-labels class="muto muto-notification-labels">
                        <muto-notification-label class="muto muto-notification-label"
                            >${this.config.label}</muto-notification-label
                        >
                        ${this.config.sublabel
                            ? html`<muto-notification-sublabel
                                  class="muto muto-notification-sublabel"
                                  >${this.config.sublabel}</muto-notification-sublabel
                              >`
                            : ``}
                    </muto-notification-labels>
                </muto-notification>
            `;
        }
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                    margin-bottom: calc(var(--muto-spacing) * -1);
                }
                .muto-notification {
                    font-family: var(--muto-font);
                    font-weight: var(--muto-font-weight-bold);
                    padding: var(--muto-spacing);
                    margin-bottom: calc(var(--muto-spacing));
                    gap: calc(var(--muto-spacing) / 2);
                    border-radius: var(--muto-border-radius);

                    display: flex;
                    align-items: center;
                    flex-direction: row;
                }
                .muto-notification-icon {
                    flex-grow: 0;
                    flex-shrink: 0;
                    flex-basis: 1%;
                    aspect-ratio: 1/1px;
                }
                .muto-notification-labels {
                    flex-grow: 1;
                    flex-shrink: 1;
                    flex-basis: 80%;

                    display: flex;
                    flex-direction: column;
                }
                .muto-notification-label {
                    font-weight: var(--muto-font-weight-bold);
                    font-size: 1.1rem;
                }
                .muto-notification-sublabel {
                    font-weight: var(--muto-font-weight-light);
                    font-size: 1rem;
                }
            `,
        ];
    }
}
