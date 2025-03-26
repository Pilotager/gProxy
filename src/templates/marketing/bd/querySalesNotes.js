const Mock = require("mockjs");
/**
 * 根据clueId查询网销小记
 * 入参:
 *   clueId: Integer 线索id 是
 * 返回:
 *   code: 0
 *   message: "success"
 *   data: 包含网销小记信息的数组
 */
module.exports = {
  useMock: false,

  get: (params, query, body) => {
    return Mock.mock({
      code: 0,
      message: "success",
      data: [
        {
          clueId: "123123",
          content: "不买就不买",
          maintainAt: "2024-02-22 10:10:00",
          maintainSalesId: 123,
          maintainSalesName: "张三",
          maintainSalesEmailPrefix: "zhangsan1",
          bindSalesId: 123,
          bindSalesName: "张三",
          bindSalesEmailPrefix: "zhangsan1",
        },
      ],
    });
  },
};
