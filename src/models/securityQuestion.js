let _question = kendo.data.Model.define({
    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "Question": { editable: true, type: "string" },
        "CreatedDate": { editable: true, type: "string" },
        "CreatedByUserId": { editable: true, type: "string" }
    }
});

export default _question;