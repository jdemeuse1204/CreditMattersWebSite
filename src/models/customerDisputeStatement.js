import {emptyGuid} from '../constants';
import moment from 'moment';

let _customerDisputeStatemenmt = kendo.data.Model.define({
    asJSON: function () {
        return {
            Id: this.Id,
            TransUnionResolvedDate: moment(this.TransUnionResolvedDate).isValid() ? moment(this.TransUnionResolvedDate).format() : null,
            EquifaxResolvedDate: moment(this.EquifaxResolvedDate).isValid() ? moment(this.EquifaxResolvedDate).format() : null,
            ExperianResolvedDate: moment(this.ExperianResolvedDate).isValid() ? moment(this.ExperianResolvedDate).format() : null,
            CreditorAddressId: this.CreditorAddressId
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "string", defaultValue: emptyGuid },
        "TransUnionResolvedDate": { editable: true, type: "string" },
        "EquifaxResolvedDate": { editable: true, type: "string" },
        "ExperianResolvedDate": { editable: true, type: "string" },
        "CreditorAddressId" : { editable: true, type: "number" }
    }
});

export default _customerDisputeStatemenmt;