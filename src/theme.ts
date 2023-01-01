import { css } from "lit";

export const themeCSS = css``;

export const colorsCSS = css``;

export const motoCSS = css`
    .muto {
        transition: filter 0.2s, background 0.4s, opacity 0.4s;

        --muto-row-height: calc(var(--muto-unit) * 5);

        box-sizing: border-box;

        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .muto-panel {
        padding: calc(var(--muto-spacing) / 2);
        border-radius: var(--muto-border-radius);
        background-color: var(--muto-card-background);
    }
`;
