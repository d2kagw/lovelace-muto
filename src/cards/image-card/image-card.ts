import { css, CSSResultGroup, html, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { MutoBaseCard } from "../../shared/base-card";
import { ImageCardConfig } from "./image-card-config";
import { IMAGE_CARD_NAME } from "./const";
import { LovelaceCard } from "custom-card-helpers";

@customElement(IMAGE_CARD_NAME)
export class ImageCard extends MutoBaseCard implements LovelaceCard {
    protected render(): TemplateResult {
        if (!this.hass || !this.config) {
            return html``;
        }

        return html`<img
            class="muto muto-image"
            style="${this.config.css ?? ""}"
            src="${this.config.image ?? ""}"
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
