let _creditBureau = kendo.data.Model.define({
    asJSON: function () {

        return this.Id === 0 ? undefined : {
            Id: this.Id,
            Name: this.Name
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Name": { editable: true, type: "string" }
    }
});

export default _creditBureau;