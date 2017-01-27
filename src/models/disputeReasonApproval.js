import moment from "moment";
import { emptyGuid } from '../constants';

var _disputeReasonApproval = kendo.data.Model.define({
    asJSON: function () {
        return this.Id === 0 ? undefined : {
            Id: this.Id,
            CreditBureauEntryId: this.CreditBureauEntryId,
            DisputeReasonId: this.DisputeReasonId,
            ApprovalDate: moment(this.ApprovalDate).isValid() ? moment(this.ApprovalDate).format() : null,
            ApprovalUserId: this.ApprovalUserId
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "string", defaultValue: emptyGuid },
        "CreditBureauEntryId": { editable: true, type: "string", defaultValue: emptyGuid },
        "DisputeReasonId": { editable: true, type: "number" },
        "ApprovalDate": { editable: true, type: "string" },
        "ApprovalUserId": { editable: true, type: "string", defaultValue: emptyGuid }
    }
});

export default _disputeReasonApproval;