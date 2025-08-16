import axios from "axios";

export async function getAllProducts() {
    const { data } = await axios.get("https://www.quickchoice.in/getAllProducts");
    return data;
}
