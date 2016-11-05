// Module require
import {core, data} from 'kendo-ui-core';

import * as _ from "lodash";
import state from "./state";


let _address = kendo.data.Model.define({
    isCompleted: function() {
        return !$.isNullOrEmpty(this.Address1) &&
            !$.isNullOrEmpty(this.City) &&
            !$.isNullOrEmpty(this.State) &&
            !$.isNullOrEmpty(this.Zip);
    },

    asJSON: function() {

        return this.Id === 0 ? undefined : {
            Id: this.Id,
            Address1: this.Address1,
            Address2: this.Address2,
            City: this.City,
            StateId: this.StateId,
            State: this.State ? this.State.asJSON() : null,
            Zip5: this.Zip5,
            Zip4: this.Zip4,
            Type: this.Type
        };
    },

    htmlString: function() {
        return $.formatAddress(this);
    },

    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Address1": { editable: true, type: "string" },
        "Address2": { editable: true, type: "string" },
        "City": { editable: true, type: "string" },
        "StateId": { editable: true, type: "number", defaultValue: 1 },
        "State": {
            editable: true,
            defaultValue: new state(),
            parse: function(data) { return new state(data); }
        },
        "Zip5": { editable: true, type: "string" },
        "Zip4": { editable: true, type: "string" },
        "Type": { editable: true, type: "number" }
    }
});

export default _address;