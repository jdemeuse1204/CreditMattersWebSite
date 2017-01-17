let item = kendo.data.Model.define({
    asJSON: function () {
        return {
            Id: this.Id,
            Status: this.Status
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Status": { editable: true, type: "string" }
    }
});

export default item;