import axios from "axios";
import AuthHelper from "../helpers/AuthHelper";
import Config from "../../config";

export async function getAllPurchases(){
    const { purchases } = await axios.get("/getAllPurchase", {
        headers: {
            "x-authorization": `Bearer ${AuthHelper.getAdminAuthToken()}`,
            Accept: "application/json",
            'x-storename': Config.getStoreName()
        }
    });
    return purchases;
}