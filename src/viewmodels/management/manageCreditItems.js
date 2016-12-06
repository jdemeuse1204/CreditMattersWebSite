import "bootstrap";
import "../../../Scripts/DataTables/datatables.min";

import { useView } from 'aurelia-framework';
import creditBureauEntry from "../../models/creditBureauEntry";
import swipable from "../../controllers/swipable";
import { management } from "../../common/repository";
import { getTemplateHtml, getTemplate } from "../../common/utils";
import * as constants from "../../constants";
import * as loadingScreen from "../../common/loadingScreen";

@useView('../../views/management/manageCreditItems.html')
export class ManageCreditItems {

    table = null;
    gridData = [];

    attached() {

        let that = this;

        loadingScreen.show();
        
        management.getCreditItems(constants.creditBureaus.all).then(function (response) {

            let mobileTemplate = kendo.template(getTemplateHtml("#mobile-credit-item")),
                desktopCreditItemsTemplate = kendo.template(getTemplateHtml("#desktop-manage-credit-credit-bureaus"));

            that.gridData = response.Data.result;

            if (that.table) {
                // if table is already drawn, do not redraw
                that.table.clear();
                that.table.rows.add(that.gridData);
                that.table.draw();
                that.gridInitComplete();
                return;
            }

            that.table = $("#manage-credit-items-table")
                .DataTable({
                    data: that.gridData,
                    columns: [
                        {
                            title: "",
                            data: "Id",
                            width: "300px",
                            render: function (e) {

                                const model = { dataId: e };

                                return getTemplate("#desktop-manage-credit-items-actions", model);
                            }
                        },
                        { title: "Creditor", data: "Creditor.Name" },
                        { title: "Account Number", data: "AccountNumber" },
                        { title: "Type", data: "AdverseType.Type" },
                        { title: "Dispute Reason", data: "Dispute.Reason" },
                        {
                            title: "Credit Bureau's",
                            data: "Id",
                            width: "300px",
                            render: function (e) {

                                const item = _.find(that.gridData, function (i) { return i.Id === e; });

                                return desktopCreditItemsTemplate(item);
                            }
                        },
                        {
                            title: "Credit Items",
                            data: "Id",
                            render: function (e) {

                                const item = _.find(that.gridData, function (i) { return i.Id === e; });

                                item.Balance = kendo.toString(item.Balance, "c2");

                                return mobileTemplate(item);
                            }
                        }
                    ],
                    scrollY: '50vh',
                    scrollCollapse: true,
                    paging: false,
                    initComplete: function () {

                        that.gridInitComplete();

                        loadingScreen.hide();
                    },
                    headerCallback: function (e) {
                        const ths = $(e).find("th");

                        that.makeRowResponsive(ths);
                    },
                    createdRow: function (e) {

                        // set the id for the row so we know what data its linked to
                        //$(e).data("id", e);

                        const tds = $(e).find("td");
                        that.makeRowResponsive(tds);

                        // ----- ROWS -----
                        // Include On Letter
                        // Creditor
                        // Account Number,
                        // Account Code,
                        // Dispute Reason,
                        // Experian, Equifax, TransUnion Code and Date
                        // Actions
                        // Mobile
                    }
                });

            // modify table
            const items = $("#manage-credit-items-table_wrapper > div.row .col-sm-6");

            // remove search bar
            $(items[0]).remove();
            $(items[1]).remove();

        });
    }

    makeRowResponsive(items) {

        // ----- ROWS -----
        // Include On Letter
        // Creditor
        // Account Number,
        // Account Code,
        // Dispute Reason,
        // Experian, Equifax, TransUnion Code and Date
        // Actions
        // Mobile

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (i === 6) {

                // mobile row
                $(item).addClass("hidden-lg").addClass("hidden-md");
                $(item).css("border-left", "none").css("border-right", "none");
                continue;
            }

            // desktop
            $(item).addClass("hidden-sm").addClass("hidden-xs");
        }
    }

    gridInitComplete() {
        const onRightAction = function (e) {
            debugger;
        },
            onLeftAction = function (e) {

                const id = !!e.sender
                    ? $(e.sender.element).data("id")
                    : $(e.delegateTarget).parent().find(".cm-swipable-drag-overlay").data("id");

                _editCreditItem(id, true);
            },
            onTap = function (e) {

                const id = $(e.sender.element).data("id");

                _editCreditItem(id, false);

            };

        swipable("#manage-credit-items-table_wrapper .cm-swipable",
            onRightAction,
            onLeftAction,
            onTap);

        //#region Desktop
        $("#manage-credit-items-table_wrapper a[data-action=\"edit\"]").unbind("click");
        $("#manage-credit-items-table_wrapper a[data-action=\"edit\"]")
            .click(function (e) {

                const id = $(e.delegateTarget).parent().data("id");

                _editCreditItem(id, false);

            });
        //#endregion
    }
}
