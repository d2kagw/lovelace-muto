import { HassEntity } from "home-assistant-js-websocket";

export function deviceTypeForEntity(entity: HassEntity): string {
    let type: string = "unknown";

    if (entity.attributes.device_class) {
        type = entity.attributes.device_class;
    } else {
        type = entity.entity_id.split(".")[0];
    }

    return type;
}
