import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 375; 
const BASE_HEIGHT = 812; 

const scaleWidth = (size) => (width / BASE_WIDTH) * size;
const scaleHeight = (size) => (height / BASE_HEIGHT) * size;
const scaleFont = (size) => size * PixelRatio.getFontScale();

export default {
  width: scaleWidth,
  height: scaleHeight,
  fontSize: scaleFont,
};
