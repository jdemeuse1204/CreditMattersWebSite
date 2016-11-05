let _userInformation = kendo.data.Model.define({
    id: "Id",
    fields: {
        "Id": { editable: true, type: "number" },
        "FirstName": { editable: true, type: "string" },
        "LastName": { editable: true, type: "string" },
        "MiddleInitial": { editable: true, type: "number" },
        "MobileNumber": { editable: true, type: "string" },
        "HomeNumber": { editable: true, type: "string" },
        "WorkNumber": { editable: true, type: "string" },
        "IsMobilePrimary": { editable: true, type: "boolean" },
        "IsHomePrimary": { editable: true, type: "boolean" },
        "IsWorkPrimary": { editable: true, type: "boolean" }
    }
});

export default _userInformation;