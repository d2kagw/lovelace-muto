import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("muto-icon")
export class MutoIcon extends LitElement {
    @property() public icon: string | undefined = undefined;

    protected render(): TemplateResult {
        return html`
            <div class="muto muto-icon">
                <ha-icon .icon=${this.icon}></ha-icon>
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            :host {
                display: inline-block;
            }
        `;
    }
}
