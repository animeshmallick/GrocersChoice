import axios from "axios";
import Config from "../../config.js"

export async function getAllProducts() {
    const { data } = await axios.get(Config.getBackendDomain() + "/getAllProducts", {
            headers: {'x-storename': Config.getStoreName()}
        });
    return data;
}
