// Action Tags
export const ACTIONS = {
    INFO: 'Info',
    UPDATE_ASSETS: 'Update-Assets',
    ADD_TO_PROFILE: 'Add-Collection-To-Profile',
} as const;

// Response Actions
export const RESPONSE_ACTIONS = {
    ACTION_RESPONSE: 'Action-Response',
    AUTHORIZATION_ERROR: 'Authorization-Error',
    INPUT_ERROR: 'Input-Error',
} as const;

// Status Tags
export const STATUS = {
    SUCCESS: 'Success',
    ERROR: 'Error',
} as const;

// Tag Names
export const TAG_NAMES = {
    ACTION: 'Action',
    STATUS: 'Status',
    MESSAGE: 'Message',
    PROFILE_PROCESS: 'ProfileProcess',
} as const;

// Rate Limiting
export const TRANSFER_RATE_LIMIT = 10; // transfers per second
export const TRANSFER_BATCH_DELAY = 1000; // 1 second delay between batches
