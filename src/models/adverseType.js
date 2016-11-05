
let _adverseType = kendo.data.Model.define({
    asJSON: function () {
        return this.Id === 0 ? undefined :  {
            Id: this.Id,
            Type: this.Type
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Type": { editable: true, type: "string" }
    }
});

export default _adverseType;