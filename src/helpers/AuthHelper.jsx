// src/helpers/AuthHelper.js
import axios from "axios";
import Config from "../../config";

const TOKEN_KEY = "authToken";
const ADMIN_TOKEN_KEY = "adminAuthToken";
const ADDRESS_KEY = "selectedAddress";
const PAYMENT_KEY = "selectedPayment";
const ALL_PRODUCT_KEY = "allProducts";
const ALL_PRODUCT_TIMESTAMP_KEY = "allProducts_timestamp";

class AuthHelper {
    /**
     * Removes session storage items on logout.
     */
    logout() {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ADDRESS_KEY);
        sessionStorage.removeItem(PAYMENT_KEY);
        sessionStorage.removeItem(ALL_PRODUCT_KEY);
        sessionStorage.removeItem(ALL_PRODUCT_TIMESTAMP_KEY);
    }

    /**
     * Gets the saved auth token.
     * @returns {string|null}
     */
    getToken() {
        return sessionStorage.getItem(TOKEN_KEY);
    }
    getAdminAuthToken(){
        return sessionStorage.getItem(ADMIN_TOKEN_KEY);
    }

    /**
     * Saves a new auth token.
     * @param {string} token
     */
    setToken(token) {
        sessionStorage.setItem(TOKEN_KEY, token);
    }

    /**
     * Validates the token with backend.
     * @returns {Promise<boolean>}
     */
    async isLoggedIn() {
        const token = this.getToken();
        if (!token) {
            this.logout();
            return false;
        }

        try {
            const response = await axios.post(
                `${Config.getBackendDomain()}/isvalidToken`,
                {},
                {
                    headers: {
                        "x-authorization": `Bearer ${token}`,
                        "x-storename": Config.getStoreName()
                    },
                    timeout: 5000,
                }
            );

            if (response.status === 200 && response.data?.is_valid_user) {
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error("Token validation failed:", error.message);
            this.logout();
            return false;
        }
    }
}

export default new AuthHelper();
