import { css } from "lit";

export const themeCSS = css``;

export const colorsCSS = css``;

export const motoCSS = css`
    .muto {
        box-sizing: border-box;
        transition: filter 0.4s, background 0.4s, opacity 0.4s;
    }
    .muto-panel {
        padding: calc(var(--muto-spacing) / 2);
        border-radius: var(--muto-border-radius);
        background: var(--muto-card-background);
    }
`;
