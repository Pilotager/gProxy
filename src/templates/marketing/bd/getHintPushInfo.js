const Mock = require("mockjs");

/**
 * 根据clueId查询车源企微卡片信息
 */
module.exports = {
  useMock: false,

  get: (params, query, body) => {
    return Mock.mock({
      code: 0,
      message: "success",
      data: {
        clueId: "123123", // 线索id
        carTitle: "香港|港A.丰田 普拉多 2019款 3.5L 自动TX-L尊享版", // 车源标题
        clueDetailShortUrl: "https://s.guazi.com/E7PirE", // 线索详情短链接
      },
    });
  },
};
