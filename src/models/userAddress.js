// Module require
import address from "./address";


let _userAddress = kendo.data.Model.define({

    isCompleted: function () {
        return !functions.string.isNullOrEmpty(this.Address1) &&
            !functions.string.isNullOrEmpty(this.City) &&
            !functions.string.isNullOrEmpty(this.State) &&
            !functions.string.isNullOrEmpty(this.Zip);
    },

    htmlString: function () {
        let hasAddress1 = !functions.string.isNullOrEmpty(this.Address1),
            hasAddress2 = !functions.string.isNullOrEmpty(this.Address2),
            address = hasAddress1 && hasAddress2 ? kendo.format("{0} {1}", this.Address1, this.Address2) : this.Address1,
            addressConcat = kendo.format("{0},{1},{2}{3}", address, this.City, this.State.Code, functions.string.isNullOrEmpty(this.Zip) ? "" : kendo.format(" {0}", this.Zip)),
            finalAddress = addressConcat === ",," ? "No Address" : kendo.format("<a href='{0}'>{0}</a>", addressConcat);

        return finalAddress;
    },

    id: "AddressId",
    fields: {
        "AddressId": { editable: true, type: "number" },
        "Address": {
            editable: true,
            defaultValue: new address(),
            parse: function (data) { return new address(data); }
        },
        "UserId": { editable: true, type: "string" }
    }
});

export default _userAddress;