let _registration = kendo.data.Model.define({
    id: "Address1",
    fields: {
        "FirstName": { editable: true, type: "string" },
        "LastName": { editable: true, type: "string" },
        "Email": { editable: true, type: "string" },

        "Username": { editable: true, type: "string" },
        "Password": { editable: true, type: "string" },

        "SecurityQuestion1ID": { editable: true, type: "number", defaultValue: 0 },
        "SecurityAnswer1": { editable: true, type: "string" },
        "SecurityQuestion2ID": { editable: true, type: "number", defaultValue: 0 },
        "SecurityAnswer2": { editable: true, type: "string" },
        "SecurityQuestion3": { editable: true, type: "string" },
        "SecurityAnswer3": { editable: true, type: "string" }
    }
});

export default _registration;