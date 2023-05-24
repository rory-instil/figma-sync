import * as target from "./GetDesignToken";
import type {DesignToken} from "./types/design-token/DesignToken";
import type {DesignTokenSpacers} from "./types/design-token/types/DesignTokenSpacers";
import type {GetFileResult} from "figma-api/lib/api-types";
import type {PartialDesignToken} from "./extractors/ColorAndFontExtractor";
import {extractColorAndFont} from "./extractors/ColorAndFontExtractor";
import {extractSpacers} from "./extractors/SpacerExtractor";
import {extractShadows} from "./extractors/ShadowExtractor";
import type {DesignTokenShadows} from "./types/design-token/types/DesignTokenShadows";

jest.mock("./extractors/ColorAndFontExtractor");
jest.mock("./extractors/SpacerExtractor");
jest.mock("./extractors/ShadowExtractor");

const extractColorAndFontMock = jest.mocked(extractColorAndFont);
const extractSpacersMock = jest.mocked(extractSpacers);
const extractShadowsMock = jest.mocked(extractShadows);

const getFileResult: GetFileResult = {} as unknown as GetFileResult;
const extractColorAndFontsResult: PartialDesignToken = {
  colors: {},
  fonts: {}
} as unknown as PartialDesignToken;
const extractSpacersResult: DesignTokenSpacers = {} as unknown as DesignTokenSpacers;
const extractShadowsResult: DesignTokenShadows = {} as unknown as DesignTokenShadows;

beforeEach(() => {
  extractColorAndFontMock.mockReturnValue(extractColorAndFontsResult);
  extractSpacersMock.mockReturnValue(extractSpacersResult);
  extractShadowsMock.mockReturnValue(extractShadowsResult);
});

it("should create design token from figma file", async () => {
  const result = await target.getDesignToken(getFileResult);

  const expected: DesignToken = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    colors: extractColorAndFontsResult.colors!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fonts: extractColorAndFontsResult.fonts!,
    spacers: extractSpacersResult,
    shadows: extractShadowsResult
  };
  expect(result).toEqual(expected);
});
