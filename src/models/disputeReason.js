var _reason = kendo.data.Model.define({
    asJSON: function () {
        return this.Id === 0 ? undefined : {
            Id: this.Id,
            Reason: this.Reason,
            CreatedDate: this.CreatedDate,
            CreatedByUserId: this.CreatedByUserId,
            SequenceNumber: this.SequenceNumber,
            IsDefault: this.IsDefault,
            AdverseTypeId: this.AdverseTypeId
        };
    },
    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Reason": { editable: true, type: "string" },
        "CreatedDate": { editable: true, type: "string" },
        "CreatedByUserId": { editable: true, type: "string" },
        "AdverseTypeId": { editable: true, type: "number" },
        "SequenceNumber": { editable: true, type: "number" },
        "IsDefault": { editable: true, type: "boolean" }
    }
});

export default _reason;