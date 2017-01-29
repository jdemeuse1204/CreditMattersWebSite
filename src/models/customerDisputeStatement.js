import { emptyGuid } from '../constants';
import moment from 'moment';
import creditBureauDisputeStatus from './creditBureauDisputeStatus';

let _customerDisputeStatemenmt = kendo.data.Model.define({
    asJSON: function () {
        return {
            Id: this.Id,
            TransUnionResolvedDate: moment(this.TransUnionResolvedDate).isValid() ? moment(this.TransUnionResolvedDate).format() : null,
            EquifaxResolvedDate: moment(this.EquifaxResolvedDate).isValid() ? moment(this.EquifaxResolvedDate).format() : null,
            ExperianResolvedDate: moment(this.ExperianResolvedDate).isValid() ? moment(this.ExperianResolvedDate).format() : null,
            CreditorAddressId: this.CreditorAddressId,
            TransUnionDisputeStatus: this.TransUnionDisputeStatus ? this.TransUnionDisputeStatus.asJSON() : null,
            EquifaxDisputeStatus: this.EquifaxDisputeStatus ? this.EquifaxDisputeStatus.asJSON() : null,
            ExperianDisputeStatus: this.ExperianDisputeStatus ? this.ExperianDisputeStatus.asJSON() : null,

            TransUnionOpenedDate: moment(this.TransUnionOpenedDate).isValid() ? moment(this.TransUnionOpenedDate).format() : null,
            EquifaxOpenedDate: moment(this.EquifaxOpenedDate).isValid() ? moment(this.EquifaxOpenedDate).format() : null,
            ExperianOpenedDate: moment(this.ExperianOpenedDate).isValid() ? moment(this.ExperianOpenedDate).format() : null,
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "string", defaultValue: emptyGuid },
        "TransUnionResolvedDate": { editable: true, type: "string" },
        "EquifaxResolvedDate": { editable: true, type: "string" },
        "ExperianResolvedDate": { editable: true, type: "string" },
        "CreditorAddressId": { editable: true, type: "number" },

        "TransUnionDisputeStatusId": { editable: true, type: "number" },
        "TransUnionDisputeStatus": {
            editable: true,
            defaultValue: new creditBureauDisputeStatus(),
            parse: function (data) { return new creditBureauDisputeStatus(data); }
        },

        "EquifaxDisputeStatusId": { editable: true, type: "number" },
        "EquifaxDisputeStatus": {
            editable: true,
            defaultValue: new creditBureauDisputeStatus(),
            parse: function (data) { return new creditBureauDisputeStatus(data); }
        },

        "ExperianDisputeStatusId": { editable: true, type: "number" },
        "ExperianDisputeStatus": {
            editable: true,
            defaultValue: new creditBureauDisputeStatus(),
            parse: function (data) { return new creditBureauDisputeStatus(data); }
        },
        "TransUnionOpenedDate": { editable: true, type: "string" },
        "EquifaxOpenedDate": { editable: true, type: "string" },
        "ExperianOpenedDate": { editable: true, type: "string" }
    }
});

export default _customerDisputeStatemenmt;