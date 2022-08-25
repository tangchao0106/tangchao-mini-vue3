import { isObject } from "../../shared/src/index";
//运行失败，jest运行环境是nodejs环境。默认规范是cmj。import 是esm规范。需要转换引入babel解决

// it("测试", () => {
//   //   expect(true).toBe(true);
//   //   expect(isObject(1)).toBe(true);
//   // expect(isObject({ name: "2222" })).toBe(true);
//   expect(isObject({})).toBe(true);
// });

describe("测试1", () => {
  it("aaa", () => {
    expect(1 == 1).toBe(true);
  });
  it("bb", () => {
    expect(1 == "1").toBe(true);
  });
});
