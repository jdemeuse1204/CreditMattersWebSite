let _item = kendo.data.Model.define({

    id: "ManageCreditItemId",
    fields: {
        "ManageCreditItemId": { editable: true, type: "string", defaultValue: "00000000-0000-0000-0000-000000000000" },
        "ManageCreditItemLetterId": { editable: true, type: "string", defaultValue: "00000000-0000-0000-0000-000000000000" }
    }
});

export default _item;