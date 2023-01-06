import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import "../icon";
import { ClockCardConfig } from "./clock-card-config";
import { CLOCK_CARD_NAME } from "../const";
import { classMap } from "lit/directives/class-map.js";

@customElement(CLOCK_CARD_NAME)
export class ClockCard extends MutoBaseCard {
    @property() config!: ClockCardConfig;
    @property() date: Date;

    constructor() {
        super();

        this.date = new Date();
        setInterval(() => {
            this.date = new Date();
        }, 250);
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        const timeFormatter: Intl.DateTimeFormatOptions = {
            year: undefined,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };

        return html`
            <muto-clock class="muto muto-clock">
                <muto-clock-time class="muto muto-clock-time" .style=${this.config.css}>
                    ${new Intl.DateTimeFormat(undefined, timeFormatter).format(this.date)}
                </muto-clock-time>
            </muto-clock>
        `;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                :host {
                    display: block;
                    width: 100%;
                }
                .muto-clock {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .muto-clock-time {
                    font-size: 3rem;
                    font-weight: var(--muto-font-weight-bold);

                    height: var(--muto-row-height);

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `,
        ];
    }
}
