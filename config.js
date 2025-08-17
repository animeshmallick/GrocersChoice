class Config {
    #backend_domain = "quickchoice.in"
    getBackendDomain() {
        const hostname = window.location.hostname;
        if(hostname.includes("www."))
            return `https://api.${this.#backend_domain}`;
        return `https://api.qa.${this.#backend_domain}`;
    }
}
export default new Config();