import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "vpndetection",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.vpndetection.io";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    // An answer missing a flag only a paid plan, or a new account's trial, carries is partial,
    // so a missing flag never reads as false. A bogon (a private or reserved address) is never
    // partial: there is nothing to check.
    withPartial(result) {
      return {
        ...result,
        partial: result.is_bogon !== true
          && constants.KEYED_FLAGS.some((flag) => result[flag] === undefined),
      };
    },
    async lookupIp({
      ip, ...args
    }) {
      const result = await this._makeRequest({
        path: `/${encodeURIComponent(ip.trim())}`,
        ...args,
      });
      return this.withPartial(result);
    },
    async lookupIps({
      ips, ...args
    }) {
      const {
        results = {}, errors = {},
      } = await this._makeRequest({
        method: "POST",
        path: "/batch",
        data: {
          ips,
        },
        ...args,
      });
      // The API keys both by address; arrays in input order are easier to loop over in a workflow.
      return {
        results: ips.filter((ip) => results[ip])
          .map((ip) => ({
            input: ip,
            ...this.withPartial(results[ip]),
          })),
        errors: ips.filter((ip) => errors[ip])
          .map((ip) => ({
            input: ip,
            ...errors[ip],
          })),
      };
    },
  },
};
