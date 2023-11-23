export type MainAxis =
  | 'center'
  | 'flex-end'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | 'flex-start';

export type CrossAxis =
  | 'baseline'
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'stretch';

export interface Axes {
  mainAxis?: MainAxis;
  crossAxis?: CrossAxis;
}
export interface PaddingInsets {
  leftPadding?: number;
  rightPadding?: number;
  topPadding?: number;
  bottomPadding?: number;
  vertical?: number;
  horizontal?: number;
}
