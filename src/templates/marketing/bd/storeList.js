const Mock = require("mockjs");

/**
 * BD工具 - 门店列表
 * 文档：https://cwiki.guazi.com/pages/viewpage.action?pageId=501176711
 */
module.exports = {
  useMock: false,

  post: (params, query, body) => {
    return Mock.mock({
      code: 0,
      data: {
        currentPage: 1,
        "list|10": [
          {
            canSelfPayment: 0,
            certificate: "",
            cityId: 345,
            cityName: "澳门",
            dealerCreatorName: "新车提成电销",
            dealerCreatorUserId: 342398,
            "dealerId|+1": 925,
            dealerName: "专员开的经销商-澳门",
            disableCreateOrder: 0,
            storeAddress: "",
            storeAdminName: "1003",
            storeAdminPhone: "18801231003",
            storeAdminUserId: "154150840580100046",
            "storeId|+1": 1000027,
            storeManagerId: 225017,
            storeManagerName: "新车顾问",
            storeManagerPhone: "13111111111",
            storeManagerUserId: "154520575250100046",
            storeName: "澳门bd门店",
            storeStatus: 0,
            top: 0,
          },
        ],
        pageSize: 10,
        totalCount: 10,
        totalPages: 1,
      },
      message: "success",
      timestamp: 1742283927051,
    });
  },
};
