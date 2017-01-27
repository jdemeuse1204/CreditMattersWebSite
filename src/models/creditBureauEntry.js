// Module require
import creditor from "./creditor";
import adverseType from "./adverseType";
import disputeReason from "./disputeReason";
import creditBureauStatus from "./creditBureauStatus";
import customerDisputeStatement from "./customerDisputeStatement";
import disputeReasonApproval from "./disputeReasonApproval";
import moment from "moment";
import { emptyGuid } from '../constants';

let _item = kendo.data.Model.define({
    asJSON: function () {

        return {
            Id: this.Id,
            CreditorId: this.CreditorId,
            Creditor: this.Creditor ? this.Creditor.asJSON() : null,
            AccountNumber: this.AccountNumber,
            AdverseTypeId: this.AdverseTypeId,
            AdverseType: this.AdverseType ? this.AdverseType.asJSON() : null,
            DisputeReasonId: this.DisputeReasonId,
            Dispute: this.Dispute ? this.Dispute.asJSON() : null,
            TransUnionInitialStatusId: this.TransUnionInitialStatusId,
            TransUnionInitialStatus: this.TransUnionInitialStatus ? this.TransUnionInitialStatus.asJSON() : null,

            TransUnionResponseStatusId: this.TransUnionResponseStatusId === 0 ? undefined : this.TransUnionResponseStatusId,
            TransUnionResponseStatus: this.TransUnionResponseStatus ? this.TransUnionResponseStatus.asJSON() : null,

            ExperianInitialStatusId: this.ExperianInitialStatusId,
            ExperianInitialStatus: this.ExperianInitialStatus ? this.ExperianInitialStatus.asJSON() : null,

            ExperianResponseStatusId: this.ExperianResponseStatusId === 0 ? undefined : this.ExperianResponseStatusId,
            ExperianResponseStatus: this.ExperianResponseStatus ? this.ExperianResponseStatus.asJSON() : null,

            EquifaxInitialStatusId: this.EquifaxInitialStatusId,
            EquifaxInitialStatus: this.EquifaxInitialStatus ? this.EquifaxInitialStatus.asJSON() : null,

            EquifaxResponseStatusId: this.EquifaxResponseStatusId === 0 ? undefined : this.EquifaxResponseStatusId,
            EquifaxResponseStatus: this.EquifaxResponseStatus ? this.EquifaxResponseStatus.asJSON() : null,

            IsDeleted: this.IsDeleted,
            UserId: this.UserId,
            CreatedDate: moment(this.CreatedDate).isValid() ? moment(this.CreatedDate).format() : null,
            CreatedByUserId: this.CreatedByUserId,
            Balance: this.Balance,

            DisputeReasonAcceptedDateTime: moment(this.DisputeReasonAcceptedDateTime).isValid() ? moment(this.DisputeReasonAcceptedDateTime).format() : null,
            DoesDisputeReasonNeedAcceptance: this.DoesDisputeReasonNeedAcceptance,

            Customer: this.EquifaxInitialStatusId,
            DisputeReasonApprovals: this.DisputeReasonApprovals
        };
    },

    preSaveOps: function () {

        if (!!this.DisputeReasonId && this.Dispute && this.Dispute.Id !== this.DisputeReasonId) {
            this.Dispute = null;
        }

        if (!!this.AdverseTypeId && this.AdverseType && this.AdverseType.Id !== this.AdverseTypeId) {
            this.AdverseType = null;
        }

        if (!!this.CreditorId && this.Creditor && this.Creditor.Id !== this.CreditorId) {
            this.Creditor = null;
        }

        if (!!this.TransUnionResponseStatusId && this.TransUnionResponseStatus && this.TransUnionResponseStatus.Id !== this.TransUnionResponseStatusId) {
            this.TransUnionResponseStatus = null;
        }

        if (!!this.TransUnionInitialStatusId && this.TransUnionInitialStatus && this.TransUnionInitialStatus.Id !== this.TransUnionInitialStatusId) {
            this.TransUnionInitialStatus = null;
        }

        if (!!this.ExperianResponseStatusId && this.ExperianResponseStatus && this.ExperianResponseStatus.Id !== this.ExperianResponseStatusId) {
            this.ExperianResponseStatus = null;
        }

        if (!!this.ExperianInitialStatusId && this.ExperianInitialStatus && this.ExperianInitialStatus.Id !== this.ExperianInitialStatusId) {
            this.ExperianInitialStatus = null;
        }

        if (!!this.EquifaxInitialStatusId && this.EquifaxInitialStatus && this.EquifaxInitialStatus.Id !== this.EquifaxInitialStatusId) {
            this.EquifaxInitialStatus = null;
        }

        if (!!this.EquifaxResponseStatusStatusId && this.EquifaxResponseStatus && this.EquifaxResponseStatus.Id !== this.EquifaxResponseStatusId) {
            this.EquifaxResponseStatus = null;
        }
    },

    id: "Id",
    fields: {
        "Id": { editable: true, type: "string", defaultValue: emptyGuid },
        "CreditorId": { editable: true, type: "number", defaultValue: 0 },
        "Creditor": {
            editable: true,
            defaultValue: new creditor(),
            parse: function (data) { return new creditor(data); }
        },
        "AccountNumber": { editable: true, type: "string" },
        "AdverseTypeId": { editable: true, type: "number" },
        "AdverseType": {
            editable: true,
            defaultValue: new adverseType(),
            parse: function (data) { return new adverseType(data); }
        },
        "DisputeReasonId": { editable: true, type: "number", defaultValue: 0 },
        "Dispute": {
            editable: true,
            defaultValue: new disputeReason(),
            parse: function (data) { return new disputeReason(data); }
        },


        "TransUnionResponseStatusId": { editable: true, type: "number", defaultValue: 0 },
        "TransUnionResponseStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function (data) { return new creditBureauStatus(data); }
        },
        "TransUnionInitialStatusId": { editable: true, type: "number", defaultValue: 1 },
        "TransUnionInitialStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function (data) { return new creditBureauStatus(data); }
        },

        "ExperianInitialStatusId": { editable: true, type: "number", defaultValue: 1 },
        "ExperianInitialStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function (data) { return new creditBureauStatus(data); }
        },
        "ExperianResponseStatusId": { editable: true, type: "number", defaultValue: 0 },
        "ExperianResponseStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function (data) { return new creditBureauStatus(data); }
        },


        "EquifaxInitialStatusId": { editable: true, type: "number", defaultValue: 1 },
        "EquifaxInitialStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function (data) { return new creditBureauStatus(data); }
        },
        "EquifaxResponseStatusId": { editable: true, type: "number", defaultValue: 0 },
        "EquifaxResponseStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function (data) { return new creditBureauStatus(data); }
        },

        "IsDeleted": { editable: true, type: "boolean" },
        "UserId": { editable: true, type: "string", defaultValue: emptyGuid },
        "CreatedDate": { editable: true, type: "string" },
        "CreatedByUserId": { editable: true, type: "string", defaultValue: emptyGuid },
        "Balance": { editable: true, type: "number" },
        "DisputeReasonAcceptedDateTime": { editable: true, type: "string" },
        "DoesDisputeReasonNeedAcceptance": { editable: true, type: "bool" },
        "CustomerDisputeStatementId": { editable: true, type: "string", defaultValue: emptyGuid },
        "CustomerDisputeStatement": {
            editable: true,
            defaultValue: new customerDisputeStatement(),
            parse: function (data) { return new customerDisputeStatement(data); }
        },
        "DisputeReasonApprovals": [
            {
                editable: true,
                defaultValue: new disputeReasonApproval(),
                parse: function (data) { return new disputeReasonApproval(data); }
            }
        ]
    }
});

export default _item;