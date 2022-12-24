import { HomeAssistant } from "custom-card-helpers";
import { HassEntity } from "home-assistant-js-websocket";

export function deviceTypeForEntity(entity: HassEntity): string {
    let type: string = "unknown";

    if (entity && entity.attributes) {
        if (entity.attributes.device_class) {
            type = entity.attributes.device_class;
        } else {
            type = entity.entity_id.split(".")[0];
        }
    }

    return type;
}

export function iconForEntity(hass: HomeAssistant, entity: string): string {
    if ((hass as any).entities[entity] == undefined) {
        return "mdi:help-circle-outline";
    } else if ((hass as any).entities[entity].icon) {
        return (hass as any).entities[entity].icon;
    } else {
        let type: string | undefined = entity.split(".")[0];
        switch (type) {
            case "light":
                return "mdi:lightbulb";
            case "binary_sensor":
                return "mdi:bell-outline";
            case "climate":
                return "mdi:air-conditioner";
            case "switch":
                return "mdi:toggle-switch-off-outline";
            default:
                console.warn("Unknown entity icon type:", type);
                return "mdi:help-circle-outline";
        }
    }
}
