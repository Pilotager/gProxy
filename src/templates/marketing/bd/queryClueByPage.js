const Mock = require("mockjs");

/**
 * BD工具 - 查询线索列表
 * 文档：https://cwiki.guazi.com/pages/viewpage.action?pageId=501176711
 */
module.exports = {
  useMock: true,

  get: (params, query, body) => {
    return Mock.mock({
      code: 0,
      data: {
        currentPage: 1,
        "list|10": [
          {
            /**
             * B2B工具_线索列表展示“帮卖网销”
             * 文档：https://cwiki.guazi.com/pages/viewpage.action?pageId=508431502
             */
            vinMask: "4N***********HGHS",
            deliverySalesShowName: "银行(yinhang)",
            internalQwUserId: 10156000,
            maintainerShowName: "银行(yinhang)",
            /** ----- */
            appointTime: () => Mock.Random.natural(1742280000, 1742370000),
            basePrice: () => Mock.Random.natural(30000, 300000),
            belongOwner: () => Mock.Random.boolean(),
            bidPrice: () => Mock.Random.natural(2000, 3000),
            bidPriceExpiresTime: () =>
              Mock.Random.natural(1742680000, 1742700000),
            businessType: 1,
            carStatus: 2,
            carTitle: () =>
              Mock.Random.pick([
                "宝马3系 2021款 改款 325Li M运动套装",
                "奔驰C级 2022款 改款 C260L 运动版",
                "奥迪A4L 2021款 40 TFSI 时尚动感型",
              ]),
            cityId: () => Mock.Random.pick([12, 344, 345]),
            cityName: () => Mock.Random.pick(["北京", "香港", "上海"]),
            clueId: () => 702427000 + Mock.Random.natural(100, 300),
            createType: 0,
            createdAt: () => "2025-03-" + Mock.Random.date("dd HH:mm:ss"),
            dealerId: () => Mock.Random.pick([464, 924, 925, 930]),
            dealerName: () =>
              Mock.Random.pick([
                "艳伟专用",
                "区总亲自开的商",
                "专员开的经销商-澳门",
                "龙腾集团",
              ]),
            detectedName: () =>
              "ceshi检" + Mock.Random.cword("零一二三四五六七八九十", 2, 5),
            gzUserId: () =>
              Mock.Random.natural(100000000000000000, 170000000000000000) + "",
            id: () => Mock.Random.natural(6300, 6400),
            listingTime: () => Mock.Random.natural(1742280000, 1742370000),
            modelPrice: () => Mock.Random.natural(138000, 145000),
            rebateStatus: 2,
            reservationTime: 0,
            topUp: 1,
            userName: () =>
              Mock.Random.pick([
                "test09",
                "龙腾",
                "1003",
                "0005\u0028区总）",
                "test10",
              ]),
            userPhoneMask: () => "1******" + Mock.Random.natural(1000, 9999),
            userType: 2,
            venue: () => Mock.Random.natural(0, 1),
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
