import { Dimensions } from 'react-native';
import { FontFamily, FontSize, FontWeight, LetterSpacing, LineHeight } from './typography';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Layout = {
  screen: {
    width: screenWidth,
    height: screenHeight,
  },
  isSmallDevice: screenWidth < 375,
  isTablet: screenWidth >= 768,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  fontFamily: FontFamily,
  fontSize: FontSize,
  lineHeight: LineHeight,
  fontWeight: FontWeight,
  letterSpacing: LetterSpacing,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    shadowColor: '#7C6EEF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const ButtonSizes = {
  sm: {
    height: 36,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.sm,
  },
  md: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.base,
  },
  lg: {
    height: 52,
    paddingHorizontal: Spacing.xl,
    fontSize: Typography.fontSize.lg,
  },
}; 