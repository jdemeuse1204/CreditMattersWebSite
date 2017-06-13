// All = 0
// TransUnion
// Equifax
// Experian

let creditBureauNames = {
  transUnion: 'TransUnion',
  experian: 'Experian',
  equifax: 'Equifax',
  all: 'All'
};

let reponseStatuses = {
  na: 'N/A',
  notReporting: 'Not Reporting',
  negative: 'Negative',
  positive: 'Positive',
  deleted: 'Deleted'
};

let _customerDisputeStatusIds = {
  noDipsuteOpen: 1,
  open: 2,
  resolved: 3
};

let _customerDisputeStatuses = {
  noDipsuteOpen: 'No Dispute Open',
  open: 'Open Dispute',
  resolved: 'Resolved Dispute'
};

export const customerDisputeStatusIds = _customerDisputeStatusIds;

export const customerDisputeStatuses = _customerDisputeStatuses;

export const creditBureauStatusIds = {
  na: 5,
  notReporting: 1,
  negative: 2,
  positive: 3,
  deleted: 4
};

export const creditBureauIds = {
  transUnion: 1,
  experian: 3,
  equifax: 2,
  all: 0
};

export const emptyGuid = '00000000-0000-0000-0000-000000000000';

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

export const sendToCdsStatuses = {
  send: 1,
  alreadySent: 2,
  notReporting: 3
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
  resolvingCds: '/#/Management/ResolvingCDS',
  courses: '/#/Management/Courses',
  home: ''
};

export function getCreditBureauId(creditBureau) {
  switch (creditBureau) {
  case creditBureauNames.transUnion:
    return creditBureauIds.transUnion;
  case creditBureauNames.equifax:
    return creditBureauIds.equifax;
  case creditBureauNames.experian:
    return creditBureauIds.experian;
  case creditBureauNames.all:
    return creditBureauIds.all;
  }
}

export function getCreditBureauName(creditBureauId) {
  switch (creditBureauId) {
  case creditBureauIds.transUnion:
    return creditBureauNames.transUnion;
  case creditBureauIds.equifax:
    return creditBureauNames.equifax;
  case creditBureauIds.experian:
    return creditBureauNames.experian;
  case creditBureauIds.all:
    return creditBureauNames.all;
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
  default:
  case reponseStatuses.na: // null
    return 5;
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
  default: // null
    return 'Still Negative';
  }
}

export function getCustomerDisputeStatementStatusFromId(Id) {
  switch (Id) {
  case _customerDisputeStatusIds.noDipsuteOpen:
    return _customerDisputeStatuses.noDipsuteOpen;
  case _customerDisputeStatusIds.open:
    return _customerDisputeStatuses.open;
  case _customerDisputeStatusIds.resolved:
    return _customerDisputeStatuses.resolved;
  default: // null
    return 'Still Negative';
  }
}

export function wasSentToCds(creditBureauEntry, creditBureauId) {
  if (creditBureauEntry.CustomerDisputeStatementId == null) {
    return false;
  }

  switch (creditBureauId) {
  case creditBureauIds.transUnion:
    return creditBureauEntry.CustomerDisputeStatement.TransUnionDisputeStatusId != _customerDisputeStatusIds.noDipsuteOpen;
  case creditBureauIds.equifax:
    return creditBureauEntry.CustomerDisputeStatement.EquifaxDisputeStatusId != _customerDisputeStatusIds.noDipsuteOpen;
  case creditBureauIds.experian:
    return creditBureauEntry.CustomerDisputeStatement.ExperianDisputeStatusId != _customerDisputeStatusIds.noDipsuteOpen;
  default:
    return false;
  }
}

export function getCreditBureauStatus(item, creditBureau) {
  let creditId = item[`${creditBureau}ResponseStatusId`];

  if (item[`${creditBureau}InitialStatusId`] === 1) {
    creditId = item[`${creditBureau}InitialStatusId`];
  }

  return getCreditBureauResponseFromId(creditId);
}

export function getSendToCdsStatus(item, creditBureau) {
  if (item[`${creditBureau}InitialStatusId`] === 1) {
    return sendToCdsStatuses.notReporting;
  }

  return !!item.CustomerDisputeStatement &&
        !!item.CustomerDisputeStatement[`${creditBureau}DisputeStatusId`] &&
        item.CustomerDisputeStatement[`${creditBureau}DisputeStatusId`] > 1 ? sendToCdsStatuses.alreadySent : sendToCdsStatuses.send;
}
