class Config {
    #backend_domain = "quickchoice.in";
    #version = "2.0.0";
    getBackendDomain() {
        const hostname = window.location.hostname;
        if(hostname.includes("www."))
            return `https://api.${this.#backend_domain}`;
        return `https://api.qa.${this.#backend_domain}`;
    }

    get_version() {
        return this.#version;
    }
}
export default new Config();