let _creditor = kendo.data.Model.define({
    asJSON: function () {
        return {
            Id: this.Id,
            Name: this.Name,
            CreatedDate: this.CreatedDate,
            CreatedByUserId: this.CreatedByUserId,
            IsDefault: this.IsDefault
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Name": { editable: true, type: "string" },
        "CreatedDate": { editable: true, type: "string" },
        "CreatedByUserId": { editable: true, type: "string" },
        "IsDefault" : { editable: true, type: "boolean" }
    }
});

export default _creditor;
