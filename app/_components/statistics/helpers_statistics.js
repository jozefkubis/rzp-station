// const BUCKETS = ["D", "N", "RD", "PN", "X"];

// // z shift_type
// export function mapTypeToBuckets(t) {
//   const s = String(t || "").toUpperCase();
//   switch (s) {
//     case "D":
//     case "VD":
//     case "ZD":
//       return ["D"];
//     case "N":
//     case "VN":
//     case "ZN":
//       return ["N"];
//     case "DN":
//     case "ND":
//       return ["D", "N"];
//     case "X": // ak by sa X objavilo priamo v shift_type
//     case "XD":
//     case "XN":
//       return ["X"];
//     default:
//       return [];
//   }
// }

// // z request_type
// export function mapRequestToBuckets(r) {
//   const s = String(r || "").toUpperCase();
//   switch (s) {
//     case "RD":
//       return ["RD"];
//     case "PN":
//       return ["PN"];
//     case "X":
//     case "XD":
//     case "XN":
//       return ["X"];
//     default:
//       return [];
//   }
// }
