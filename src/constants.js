// All = 0
// TransUnion
// Equifax
// Experian

let creditBureauNames = {
    transUnion: "TransUnion",
    experian: "Experian",
    equifax: "Equifax",
    all: "All"
};

let reponseStatuses = {
    na: "N/A",
    notReporting: "Not Reporting",
    negative: "Negative",
    positive: "Positive",
    deleted: "Deleted"
};

export const creditBureaus = creditBureauNames;

export const creditBureauStatuses = reponseStatuses;

export const loginResults = {
    success: 'success',
    failed: 'failed',
    lockedOut: 'locked out',
    requiresVerification: 'requires verification',
    hasTemporaryPassword: 'has temporary password',
    requiresDeviceVerification: 'requires device verification'
};

export function getCreditBureauId(creditBureau) {
    switch (creditBureau) {
        case creditBureauNames.transUnion:
            return 1;
        case creditBureauNames.equifax:
            return 2;
        case creditBureauNames.experian:
            return 3;
        case creditBureauNames.all:
            return 0;
    }
}

export function getCreditBureauResponseId(response) {
    switch (response) {
        case reponseStatuses.notReporting:
            return 1;
        case reponseStatuses.negative:
            return 2;
        case reponseStatuses.positive:
            return 3;
        case reponseStatuses.deleted:
            return 4;
        case reponseStatuses.na:
            return 5;
    }
}