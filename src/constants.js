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
    deleted: "Deleted",
    resolvedDispute: "Resolved Dispute",
    openDispute: "Open Dispute"
};

export const creditBureauIds = {
    transUnion: 1,
    experian: 3,
    equifax: 2,
    all: 0
};

export const emptyGuid = "00000000-0000-0000-0000-000000000000";

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

export const phoneNumberTypes = {
    home: 'HomePhoneNumber',
    work: 'WorkPhoneNumber',
    mobile: 'MobilePhoneNumber'
};

export const phoneNumberTypeIds = {
    home: 1,
    work: 2,
    mobile: 3
};

export const routes = {
    login: '/#/Login',
    manageCreditItems: '/#/Management/ManageCreditItems',
    courses: '/#/Management/Courses'
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
        case reponseStatuses.resolvedDispute:
            return 5;
        case reponseStatuses.openDispute:
            return 6;
        case reponseStatuses.na: // null
            return 7;
    }
}


export function getCreditBureauResponseFromId(Id) {
    switch (Id) {
        case 1:
            return 'Not Reporting';
        case 2:
            return 'Negative';
        case 3:
            return 'Positive';
        case 4:
            return 'Deleted';
        case 5:
            return 'Resolved Dispute';
        case 6:
            return 'Open Dispute';
        default: // null
            return 'N/A';
    }
}
