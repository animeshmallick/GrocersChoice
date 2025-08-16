import axios from "axios";

export async function getAllProducts() {
    const { data } = await axios.get("https://api.quickchoice.in/getAllProducts");
    return data;
}
