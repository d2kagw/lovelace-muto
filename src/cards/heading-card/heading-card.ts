import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import "../icon";
import { HeadingCardConfig } from "./heading-card-config";
import { HEADING_CARD_NAME } from "../const";
import { classMap } from "lit/directives/class-map.js";

@customElement(HEADING_CARD_NAME)
export class HeadingCard extends MutoBaseCard {
    @property() config!: HeadingCardConfig;

    public setConfig(config: HeadingCardConfig): void {
        this.config = {
            size: "h1",
            ...config,
        };
    }

    public tagContent(): TemplateResult {
        return html`
            ${this.config.icon ? html`<muto-icon icon="${this.config.icon}"></muto-icon>` : ""}
            ${this.config.text ?? ""}
        `;
    }

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        let tag: TemplateResult;
        switch (this.config.size) {
            case "h2":
                tag = html`<h2
                    class=${classMap({
                        muto: true,
                        "muto-heading": true,
                        "muto-clickable": this.config.action != undefined,
                    })}
                    style="${this.config.css ?? ""}"
                    @click=${this.clickAction()}
                >
                    ${this.tagContent()}
                </h2>`;
                break;

            case "h3":
                tag = html`<h3
                    class=${classMap({
                        muto: true,
                        "muto-heading": true,
                        "muto-clickable": this.config.action != undefined,
                    })}
                    style="${this.config.css ?? ""}"
                    @click=${this.clickAction()}
                >
                    ${this.tagContent()}
                </h3>`;
                break;

            default: // or h1
                tag = html`<h1
                    class=${classMap({
                        muto: true,
                        "muto-heading": true,
                        "muto-clickable": this.config.action != undefined,
                    })}
                    style="${this.config.css ?? ""}"
                    @click=${this.clickAction()}
                >
                    ${this.tagContent()}
                </h1>`;
        }

        return tag;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-heading {
                    font-family: var(--muto-font);
                    font-weight: var(--muto-font-weight-bold);
                    margin: calc(var(--muto-unit) / 2) 0 0;
                }
                h1.muto-heading {
                    font-size: 1.4em;
                    --mdc-icon-size: 1em;
                }
                h2.muto-heading {
                    font-size: 1.2em;
                    --mdc-icon-size: 1.17em;
                }
                h3.muto-heading {
                    font-size: 1em;
                    --mdc-icon-size: 1em;
                }
            `,
        ];
    }
}
