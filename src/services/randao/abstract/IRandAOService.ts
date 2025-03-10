/**
 * Interface for the RandAO Service
 */
export interface IRandAOService {
    /**
     * Retrieves All info on the random providers
     * @returns An array of {ProviderInfo,ProviderActivity,GraphQlData} linked by address
     */
    getAllProviderInfo(): Promise<any[]>;

}



// const queryObject = {
//     query: `{
//       transactions(
//         recipients: ["${RANDOMPROCCESS}"],
//         owners: ["${provider_id}"],
//         tags: [
//           { name: "Action", values: ["Post-VDF-Output-And-Proof"] },
//           { name: "Data-Protocol", values: ["ao"] }
//         ]
//       ) {
//          count
//       }
//     }`
//   };