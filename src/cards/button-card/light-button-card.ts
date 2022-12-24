import { customElement } from "lit/decorators.js";
import "../../shared/icon";
import { LIGHT_BUTTON_CARD_NAME } from "./const";
import { ButtonCard } from "./button-card";

@customElement(LIGHT_BUTTON_CARD_NAME)
export class LightButtonCard extends ButtonCard {
    public clickAction(): Function {
        return () => {
            this.hass.callService("light", "toggle", { entity_id: this.config.entity });
        };
    }
}
