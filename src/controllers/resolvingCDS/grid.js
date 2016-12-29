// Scope require
import "bootstrap";
import "../../../Scripts/DataTables/datatables.min";

// Module require
import swipable from "../../controllers/swipable";
import { management } from "../../common/repository";
import * as constants from "../../constants";
import { getTemplateHtml, getTemplate } from "../../common/utils";
import * as loadingScreen from "../../common/loadingScreen";
import { find } from 'lodash';
import { inject } from 'aurelia-dependency-injection';
import { GridServices } from './gridServices';

@inject(GridServices)
export class Grid {

    gridServices = null;
    itemModal = null;
    table = null;
    data = [];

    constructor(gridServices) {
        this.gridServices = gridServices;
    }

    load() {

        const that = this;
        const gridHelpers = {
            makeRowsResponsive: function (items) {

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
            gridInitComplete: function () {

                const onRightAction = function (e) {
                    debugger;
                },
                    onLeftAction = function (e) {

                        const id = !!e.sender
                            ? $(e.sender.element).data("id")
                            : $(e.delegateTarget).parent().find(".cm-swipable-drag-overlay").data("id");

                        that.gridServices.openModal(id);
                    },
                    onTap = function (e) {

                        const id = $(e.sender.element).data("id");

                        that.gridServices.openModal(id).then(response => {

                            if (response.wasCancelled === false) {
                                that.load();
                            }
                        });

                    };

                swipable("#manage-credit-items-table_wrapper .cm-swipable",
                    onRightAction,
                    onLeftAction,
                    onTap);

                //#region Desktop
                $("#manage-credit-items-table_wrapper a[data-action=\"edit\"]").unbind("click");
                $("#manage-credit-items-table_wrapper a[data-action=\"edit\"]").click(function (e) {

                    const id = $(e.delegateTarget).parent().data("id");

                    openModal(id);

                });
                //#endregion
            }
        };

        return new Promise((resolve, reject) => {

            let mobileTemplate = kendo.template(getTemplateHtml("#mobile-credit-item")),
                desktopCreditItemsTemplate = kendo.template(getTemplateHtml("#desktop-manage-credit-credit-bureaus"));
        
            if (that.table) {

                if ($("#manage-credit-items-table_wrapper").length === 0) {
                    that.table.destroy();
                    $("#manage-credit-items-table").removeData();
                    $("#manage-credit-items-table").empty();
                } else {
                    management.getCreditItems(constants.creditBureaus.all).then(function (refreshResponse) {

                        that.data = refreshResponse.Data.result;

                        // if table is already drawn, do not redraw
                        that.table.clear();
                        that.table.rows.add(that.data);
                        that.table.draw();
                        gridHelpers.gridInitComplete();

                    }).catch(() => {
                        reject();
                    });
                    return;
                }
            }

            management.getCreditItems(constants.creditBureaus.all).then(function (initResponse) {

                that.data = initResponse.Data.result;

                that.table = $("#manage-credit-items-table").DataTable({
                    data: that.data,
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
                                try {
                                    const item = find(that.data, function (i) { return i.Id === e; });

                                    if (!item) { debugger; }
                                    return desktopCreditItemsTemplate(item);
                                } catch (error) {
                                    debugger;
                                }

                            }
                        },
                        {
                            title: "Credit Items",
                            data: "Id",
                            render: function (e) {
                                try {
                                    const item = find(that.data, function (i) { return i.Id === e; });
                                    if (!item) { debugger; }
                                    item.Balance = kendo.toString(item.Balance, "c2");

                                    return mobileTemplate(item);
                                } catch (error) {
                                    debugger;
                                }

                            }
                        }
                    ],
                    scrollY: '50vh',
                    scrollCollapse: true,
                    paging: false,
                    initComplete: function () {

                        gridHelpers.gridInitComplete();

                        resolve();
                    },
                    headerCallback: function (e) {
                        const ths = $(e).find("th");
                        gridHelpers.makeRowsResponsive(ths);
                    },
                    createdRow: function (e) {

                        // set the id for the row so we know what data its linked to
                        //$(e).data("id", e);
                        const tds = $(e).find("td");
                        gridHelpers.makeRowsResponsive(tds);

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

    anyItemsSelected() {
        // distinguish between desktop and mobile check boxes
        // clicking one CB should check both desktop and mobile

        const items = $("input[data-type=\"mobile-checkbox\"]:checked").data("id");

        return items != null && items.length !== 0;
    }
}
