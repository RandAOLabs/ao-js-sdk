import { ConnectArgsLegacy } from "./aoconnect-types";

export const FORWARD_RESEARCH_AO_CONFIG: ConnectArgsLegacy = { CU_URL: 'https://cu.randao.net', MU_URL:'https://mu.randao.net',MODE: 'legacy' }
export const ARDRIVE_AO_CONFIG: ConnectArgsLegacy = { CU_URL: 'https://cu.ardrive.io', MODE: 'legacy' }
export const ARIO_AO_CONFIG: ConnectArgsLegacy = { CU_URL: 'https://cu.ar-io.dev', MODE: 'legacy' }
export const RANDAO_AO_CONFIG: ConnectArgsLegacy = { CU_URL: ' https://cu.randao.net', MU_URL:'https://mu.randao.net',MODE: 'legacy' }

export const AO_CONFIGURATIONS = {
    FORWARD_RESEARCH: FORWARD_RESEARCH_AO_CONFIG,
    ARDRIVE: ARDRIVE_AO_CONFIG,
    ARIO: ARIO_AO_CONFIG,
    RANDAO: RANDAO_AO_CONFIG,
}

export const AO_CONFIGURATION_DEFAULT: ConnectArgsLegacy = FORWARD_RESEARCH_AO_CONFIG;
