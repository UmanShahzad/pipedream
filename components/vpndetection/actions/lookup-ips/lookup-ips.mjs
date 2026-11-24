import { ConfigurationError } from "@pipedream/platform";
import vpndetection from "../../vpndetection.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "vpndetection-lookup-ips",
  name: "Lookup IPs",
  description: "Check up to 1,000 IP addresses in one call for VPN, Tor, relay, proxy, hosting and bot use. More than one address in a call needs a key on a paid plan. [See the documentation](https://docs.vpndetection.io/api/lookup/lookupBatch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    vpndetection,
    ips: {
      type: "string[]",
      label: "IP Addresses",
      description: "The IPv4 or IPv6 addresses to check, up to 1,000",
    },
  },
  async run({ $ }) {
    const ips = [
      ...new Set((this.ips ?? []).map((ip) => String(ip).trim())
        .filter((ip) => ip !== "")),
    ];
    if (!ips.length) {
      throw new ConfigurationError("Give at least one IP address.");
    }
    if (ips.length > constants.MAX_BATCH) {
      throw new ConfigurationError(`Lookup IPs takes at most ${constants.MAX_BATCH} addresses in one call; ${ips.length} were given.`);
    }
    const response = await this.vpndetection.lookupIps({
      $,
      ips,
    });
    $.export("$summary", `Checked ${response.results.length} of ${ips.length} address${ips.length === 1
      ? ""
      : "es"}${response.errors.length
      ? `, ${response.errors.length} refused`
      : ""}`);
    return response;
  },
};
