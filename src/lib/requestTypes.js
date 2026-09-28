export const REQUEST_TYPES = [
  {
    value: "exchange",
    label: "Exchange",
    icon: "sync_alt",
    hint: "Offer one of your toys in return.",
  },
  {
    value: "loan",
    label: "Loan",
    icon: "schedule",
    hint: "Borrow this toy — no toy offered in return.",
  },
  {
    value: "gift",
    label: "Gift",
    icon: "card_giftcard",
    hint: "Ask to receive this toy as a gift.",
  },
];

export const REQUEST_TYPE_VALUES = REQUEST_TYPES.map((t) => t.value);

export function normalizeRequestType(value) {
  const v = typeof value === "string" ? value.trim().toLowerCase() : "";
  return REQUEST_TYPE_VALUES.includes(v) ? v : "exchange";
}

export function requestTypeLabel(value) {
  const found = REQUEST_TYPES.find((t) => t.value === value);
  return found?.label ?? "Exchange";
}

export function completedWithVerb(value) {
  switch (normalizeRequestType(value)) {
    case "loan":
      return "Loaned with";
    case "gift":
      return "Gifted with";
    default:
      return "Exchanged with";
  }
}

export function requestSentCopy(value) {
  switch (normalizeRequestType(value)) {
    case "loan":
      return "Your loan request has been sent to";
    case "gift":
      return "Your gift request has been sent to";
    default:
      return "Your exchange proposal has been sent to";
  }
}
