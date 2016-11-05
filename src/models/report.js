import reportItem from "./reportItem";


let _letter = kendo.data.Model.define({

    id: "Id",
    fields: {
        "Id": { editable: true, type: "string", defaultValue: "00000000-0000-0000-0000-000000000000" },
        "UserId": { editable: true, type: "string", defaultValue: "00000000-0000-0000-0000-000000000000" },
        "GenerationStartDate": { editable: true, type: "date", defaultValue: null },
        "GenerationEndDate": { editable: true, type: "date", defaultValue: null },
        "Type": { editable: true, type: "number" },

        "ManageCreditItemLetterItems": {
            editable: true,
            defaultValue: { ManageCreditItemLetterItems: new reportItem() }
        }
    }
});

export default _letter;