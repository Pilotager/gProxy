const Mock = require("mockjs");

/**
 * BD 信息
 */
module.exports = {
  useMock: false,

  get: (params, query, body) => {
    return Mock.mock({
      code: 0,
      data: {
        bdId: 10157067,
        bdName: "尹航",
        functionList: [
          "superBdPermission",
          "edit_button",
          "auction_progress_button",
          "addDealer",
          "no_reservation_allowed_button",
          "halt_dealer_button",
          "store_list_button",
          "store_detail_change_bd_scrm",
          "change_price_button",
          "store_no_reservation_allowed_button",
          "halt_sales_button",
          "halt_store_button",
          "details_halt_sales_button",
          "date_store_button",
          "store_edit_button",
          "transfer_ownership_button",
          "store_auction_progress_button",
          "changeDealerAdmin",
          "view_contract_button",
          "send_message_button",
          "new_contract_button",
          "auction_progress_test_report_button",
          "store_progress_test_report_button",
          "disableDealerCreateOrder",
          "communicate_button",
        ],
        roleList: ["slf_ka_commissioner_scrm", "bd_manager"],
        superAdmin: true,
      },
      msg: "success",
      timestamp: 1742816662813,
    });
  },
};
