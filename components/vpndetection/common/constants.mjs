// The most addresses POST /batch takes in one call.
const MAX_BATCH = 1000;

// Flags only a key on a paid plan, or a new account's trial, carries.
const KEYED_FLAGS = [
  "is_hosting",
  "is_cdn",
  "is_resproxy",
  "is_dcproxy",
  "is_mobproxy",
  "is_pubproxy",
];

export default {
  MAX_BATCH,
  KEYED_FLAGS,
};
