// Scope require
import "bootstrap";
import "../../../Scripts/DataTables/datatables.min";

// Module require
import creditBureauEntry from "../../models/creditBureauEntry";
import swipable from "../../controllers/swipable";
import { management } from "../../common/repository";
import * as constants from "../../constants";
import { getTemplateHtml, getTemplate } from "../../common/utils";
import * as loadingScreen from "../../common/loadingScreen";
import { DialogService } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import { find } from 'lodash';

@inject(DialogService)
export class MainGrid {

    dialogService = null;
    itemModal = null;
    table = null;
    gridData = [];

    constructor(dialogService) {
        this.dialogService = dialogService;
    }

    load() {

        const that = this;
        const gridServices = {
            makeRowsResponsive: function (items) {
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

            },
            editCreditItem: function (id) {

                loadingScreen.show();

                management.getCreditItem(id).then(function (result) {

                    const cbe = new creditBureauEntry(result);

                    gridServices.addEditNewItem(cbe);
                });

            },
            addEditNewItem: function (item) {
                const addOrEdit = item.Id ? "Edit" : "Add";
                const modalModel = {
                    title: `${addOrEdit} Credit Item`,
                    creditItem: item,
                    display: {
                        defaultDisputeReason:"none",
                        add: item.Id ? "none" : "",
                        edit: item.Id ? "" : "none"
                    }
                };

                that.dialogService.open({
                    viewModel: 'modals/addNewCreditItemModal',
                    model: modalModel
                }).then(response => {

                });
            },
            gridInitComplete: function () {

                const onRightAction = function (e) {
                    debugger;
                },
                    onLeftAction = function (e) {

                        const id = !!e.sender
                            ? $(e.sender.element).data("id")
                            : $(e.delegateTarget).parent().find(".cm-swipable-drag-overlay").data("id");

                        gridServices.editCreditItem(id, true);
                    },
                    onTap = function (e) {

                        const id = $(e.sender.element).data("id");

                        gridServices.editCreditItem(id, false);

                    };

                swipable("#manage-credit-items-table_wrapper .cm-swipable",
                    onRightAction,
                    onLeftAction,
                    onTap);

                //#region Desktop
                $("#manage-credit-items-table_wrapper a[data-action=\"edit\"]").unbind("click");
                $("#manage-credit-items-table_wrapper a[data-action=\"edit\"]").click(function (e) {

                    const id = $(e.delegateTarget).parent().data("id");

                    gridServices.editCreditItem(id, false);

                });
                //#endregion
            },
            addNewCreditItem: function () {

                loadingScreen.show();

                gridServices.addEditNewItem(new creditBureauEntry());

            }
        };

        return new Promise((resolve, reject) => {

            management.getCreditItems(constants.creditBureaus.all).then(function (response) {

                let mobileTemplate = kendo.template(getTemplateHtml("#mobile-credit-item")),
                    desktopCreditItemsTemplate = kendo.template(getTemplateHtml("#desktop-manage-credit-credit-bureaus"));

                that.gridData = response.Data.result;

                if (that.table) {
                    // if table is already drawn, do not redraw
                    that.table.clear();
                    that.table.rows.add(that.gridData);
                    that.table.draw();
                    gridServices.gridInitComplete();
                    return;
                }

                that.table = $("#manage-credit-items-table").DataTable({
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

                                const item = find(that.gridData, function (i) { return i.Id === e; });

                                return desktopCreditItemsTemplate(item);
                            }
                        },
                        {
                            title: "Credit Items",
                            data: "Id",
                            render: function (e) {

                                const item = find(that.gridData, function (i) { return i.Id === e; });

                                item.Balance = kendo.toString(item.Balance, "c2");

                                return mobileTemplate(item);
                            }
                        }
                    ],
                    scrollY: '50vh',
                    scrollCollapse: true,
                    paging: false,
                    initComplete: function () {

                        gridServices.gridInitComplete();

                        resolve();
                    },
                    headerCallback: function (e) {
                        const ths = $(e).find("th");
                        gridServices.makeRowsResponsive(ths);
                    },
                    createdRow: function (e) {

                        // set the id for the row so we know what data its linked to
                        //$(e).data("id", e);
                        const tds = $(e).find("td");
                        gridServices.makeRowsResponsive(tds);

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

            }).catch(() => {
                reject();
            });
        });
    }

    addItemClick() {

    }

    anyItemsSelected() {
        // distinguish between desktop and mobile check boxes
        // clicking one CB should check both desktop and mobile

        const items = $("input[data-type=\"mobile-checkbox\"]:checked").data("id");

        return items != null && items.length !== 0;
    }
}
