// Module require
import creditor from "./creditor";
import adverseType from "./adverseType";
import disputeReason from "./disputeReason";
import creditBureauStatus from "./creditBureauStatus";
import moment from "moment";

let _item = kendo.data.Model.define({
    asJSON: function() {

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
            Balance: this.Balance
        };
    },

    id: "Id",
    fields: {
        "Id": { editable: true, type: "string", defaultValue: "00000000-0000-0000-0000-000000000000" },
        "CreditorId": { editable: true, type: "number", defaultValue: -1 },
        "Creditor": {
            editable: true,
            defaultValue: new creditor(),
            parse: function(data) { return new creditor(data); }
        },
        "AccountNumber": { editable: true, type: "string" },
        "AdverseTypeId": { editable: true, type: "number" },
        "AdverseType": {
            editable: true,
            defaultValue: new adverseType(),
            parse: function(data) { return new adverseType(data); }
        },
        "DisputeReasonId": { editable: true, type: "number", defaultValue: -1 },
        "Dispute": {
            editable: true,
            defaultValue: new disputeReason(),
            parse: function(data) { return new disputeReason(data); }
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
            parse: function(data) { return new creditBureauStatus(data); }
        },

        "ExperianInitialStatusId": { editable: true, type: "number", defaultValue: 1 },
        "ExperianInitialStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function(data) { return new creditBureauStatus(data); }
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
            parse: function(data) { return new creditBureauStatus(data); }
        },
        "EquifaxResponseStatusId": { editable: true, type: "number", defaultValue: 0 },
        "EquifaxResponseStatus": {
            editable: true,
            defaultValue: new creditBureauStatus(),
            parse: function (data) { return new creditBureauStatus(data); }
        },

        "IsDeleted": { editable: true, type: "boolean" },
        "UserId": { editable: true, type: "string", defaultValue: "00000000-0000-0000-0000-000000000000" },
        "CreatedDate": { editable: true, type: "string" },
        "CreatedByUserId": { editable: true, type: "string", defaultValue: "00000000-0000-0000-0000-000000000000" },
        "Balance": { editable: true, type: "number" }
    }
});

export default _item;