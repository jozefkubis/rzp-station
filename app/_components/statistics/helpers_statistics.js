const SHIFT_BUCKETS = {
  D: ["D"],
  VD: ["D"],
  ZD: ["D"],
  N: ["N"],
  VN: ["N"],
  ZN: ["N"],
  DN: ["D", "N"],
  ND: ["D", "N"],
  RD: ["RD"],
  PN: ["PN"],
  X: ["X"],
  XD: ["X"],
  XN: ["X"],
};

const REQUEST_BUCKETS = {
  RD: ["RD"],
  PN: ["PN"],
  X: ["X"],
  XD: ["X"],
  XN: ["X"],
};

function normalizeType(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function mapToBuckets(value, dictionary) {
  return dictionary[normalizeType(value)] ?? [];
}

export function getShiftBuckets(shiftType) {
  return mapToBuckets(shiftType, SHIFT_BUCKETS);
}

export function getRequestBuckets(requestType) {
  return mapToBuckets(requestType, REQUEST_BUCKETS);
}

export function getRowBuckets({ shiftType, requestType }) {
  return new Set([
    ...getShiftBuckets(shiftType),
    ...getRequestBuckets(requestType),
  ]);
}
