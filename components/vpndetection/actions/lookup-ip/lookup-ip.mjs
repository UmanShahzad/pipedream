import vpndetection from "../../vpndetection.app.mjs";

export default {
  key: "vpndetection-lookup-ip",
  name: "Lookup IP",
  description: "Check whether an IP address is a VPN, Tor, relay, proxy, hosting or bot address, with its location and ASN. A free key answers the VPN, Tor and relay flags; a paid plan, or a new account's trial, adds the rest and the detail behind each. [See the documentation](https://docs.vpndetection.io/api/lookup/lookupIp)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vpndetection,
    ip: {
      type: "string",
      label: "IP Address",
      description: "The IPv4 or IPv6 address to check, e.g. `45.83.91.1` or `2001:4860:4860::8888`",
    },
  },
  async run({ $ }) {
    const response = await this.vpndetection.lookupIp({
      $,
      ip: this.ip,
    });
    const found = [
      "vpn",
      "tor",
      "relay",
      "hosting",
      "bot",
    ].filter((kind) => response[`is_${kind}`] === true);
    $.export("$summary", `${response.ip}: ${found.length
      ? found.join(", ")
      : "no VPN, Tor, relay, hosting or bot flag"}`);
    return response;
  },
};
