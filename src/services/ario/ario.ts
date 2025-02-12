import { ANT, AoANTRead, AoARIORead, ARIO } from "@ar.io/sdk";

export function getARIO(): AoARIORead {
    return ARIO.init();
}

export function getANT(processId: string): AoANTRead {
    return ANT.init({
        processId
    });
}
