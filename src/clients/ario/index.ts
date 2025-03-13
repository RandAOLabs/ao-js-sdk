/**
 * @categoryDescription ARIO
 * ARIO integrations
 * @showCategories
 * @module
 */
// Export ANT client types and interfaces
export * from "src/clients/ario/ant/abstract";
export * from "src/clients/ario/ant/constants";

// Export ARNS client types and interfaces
export * from "src/clients/ario/arns/abstract";
export * from "src/clients/ario/arns/constants";

// Export error types
export {
    ANTClientError,
    GetANTRecordsError as ANTGetRecordsError,
    GetANTRecordError as ANTGetRecordError
} from "src/clients/ario/ant/ANTClientError";

export {
    ARNSClientError,
    GetARNSRecordError as ARNSGetRecordError,
    InvalidDomainError
} from "src/clients/ario/arns/ARNSClientError";

// Export clients
export { ANTClient } from "src/clients/ario/ant/ANTClient";
export { ARNSClient } from "src/clients/ario/arns/ARNSClient";
