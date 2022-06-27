import * as target from "./FrameExtractor";
import type {GetFileResult} from "figma-api/lib/api-types";
import {extractPage} from "./PageExtractor";
import type {CANVAS} from "figma-api";
import {buildTestNode} from "@src/loading/figma/types/figma-api/testing/BuildTestNode";
import {mockFunction} from "@src/shared/testing/jest/JestHelpers";

jest.mock("./PageExtractor");

const extractPageMock = mockFunction(extractPage);

const figmaGetFileResult: GetFileResult = {} as unknown as GetFileResult;
const pageName = "page-name";
const frameName = "frame-name";

const frame = {
  ...buildTestNode("FRAME"),
  name: frameName
};
const extractPageResultWithFrame: CANVAS = {
  children: [
    buildTestNode("BOOLEAN_OPERATION"),
    frame,
    buildTestNode("GROUP")
  ]
} as CANVAS;

beforeEach(() => {
  extractPageMock.mockReturnValue(extractPageResultWithFrame);
});

it("should successfully extract frame", () => {
  const result = target.extractFrame({figmaGetFileResult, pageName, frameName});

  expect(result).toEqual(frame);
  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});

it("should throw error if unable to extract frame due to page having no children", () => {
  extractPageMock.mockReturnValue({
    ...extractPageResultWithFrame,
    children: []
  });

  expect(() => target.extractFrame({figmaGetFileResult, pageName, frameName}))
    .toThrow(new Error("Could not find frame on page page-name called frame-name, is figma setup correctly?"));

  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});

it("should throw error if unable to extract frame due to page having no frame as a child", () => {
  extractPageMock.mockReturnValue({
    ...extractPageResultWithFrame,
    children: [buildTestNode("BOOLEAN_OPERATION")]
  });

  expect(() => target.extractFrame({figmaGetFileResult, pageName, frameName}))
    .toThrow(new Error("Could not find frame on page page-name called frame-name, is figma setup correctly?"));

  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});

it("should throw error if unable to extract frame due to page not having a frame with the correct name", () => {
  extractPageMock.mockReturnValue({
    ...extractPageResultWithFrame,
    children: [{
      ...frame,
      name: "different"
    }]
  });

  expect(() => target.extractFrame({figmaGetFileResult, pageName, frameName}))
    .toThrow(new Error("Could not find frame on page page-name called frame-name, is figma setup correctly?"));

  expect(extractPageMock).toHaveBeenCalledWith({figmaGetFileResult, pageName});
});