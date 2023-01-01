import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import { ImageCardConfig } from "./image-card-config";
import { LovelaceCard } from "custom-card-helpers";
import { IMAGE_CARD_NAME } from "../const";
import { classMap } from "lit/directives/class-map.js";

@customElement(IMAGE_CARD_NAME)
export class ImageCard extends MutoBaseCard {
    @property() config!: ImageCardConfig;

    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            console.error("No hass or config");
            return html``;
        }

        return html`<img
            class=${classMap({
                muto: true,
                "muto-image": true,
                "muto-clickable": this.config.action != undefined,
            })}
            style="${this.config.css ?? ""}"
            src="${this.config.image}"
            @click=${this.clickAction()}
        />`;
    }

    static get styles(): CSSResultGroup {
        return [
            super.styles,
            css`
                .muto-image {
                    display: block;
                    width: 100%;
                    object-fit: cover;
                }
            `,
        ];
    }
}
