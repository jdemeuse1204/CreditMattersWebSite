let _status = kendo.data.Model.define({

    asJSON: function () {
        return this.Id === 0 ? undefined : {
            Id: this.Id,
            Status: this.Status,
            Type: this.Type
        };
    },

    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Status": { editable: true, type: "string" },
        "Type": { editable: true, type: "number" }
    }
});

export default _status;