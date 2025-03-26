const Mock = require("mockjs");

/**
 * 获取车源详情信息
 * 文档：https://cwiki.guazi.com/pages/viewpage.action?pageId=478775553
 */
module.exports = {
  useMock: false,

  get: (params, query, body) => {
    return Mock.mock({
      code: 0,
      data: {
        /**
         * B2B工具_线索列表展示“帮卖网销”
         * 文档：https://cwiki.guazi.com/pages/viewpage.action?pageId=508431502
         */
        vinMask: "4N***********HGHS",
        /** ----- */
        clueId: 702427285,
        clueTransferInfo: {
          billingAmount: "2",
          transferTime: "null",
          transferType: "5",
          transferWay: "1",
          transferWayType: "0",
        },
        id: 6391,
        mainInfo: {
          appointTime: 1742365600,
          basePrice: 28000,
          belongOwner: true,
          bidPrice: 2800,
          bidPriceExpiresTime: 1742698900,
          businessType: 1,
          carStatus: 2,
          carTitle: "奔驰C级 2022款 改款 C260L 运动版",
          cityId: 345,
          cityName: "上海",
          clueId: 702427285,
          createType: 0,
          createdAt: "2025-03-19 15:30:26",
          dealerId: 465,
          dealerName: "上海车行",
          deepOnPrice: "12%",
          gzUserId: "163913582510800024",
          id: 6391,
          listingTime: 1742366600,
          maxPrice: 2800,
          maxVenue: 0,
          modelPrice: 138000,
          rebateStatus: 2,
          reservationTime: 0,
          secretOneBidPrice: 2800,
          topUp: 1,
          userName: "test10",
          userPhoneMask: "1******1210",
          userType: 2,
          venue: 0,
        },
      },
    });
  },
};
