class Config {
    #backend_domain = "quickchoice.in";
    #version = "3.0.0";
    getBackendDomain() {
        const hostname = window.location.hostname;
        if(hostname.includes("www."))
            return `https://api.${this.#backend_domain}`;
        return `https://api.qa.${this.#backend_domain}`;
    }

    get_version() {
        return this.#version;
    }

    getStoreName() {
        const hostname = window.location.hostname;
        if (hostname.indexOf("localhost") >= 0)
            return "grocerschoice";
        const parts = hostname.split(".");
        return parts[parts.length - 2];
    }
}
export default new Config();