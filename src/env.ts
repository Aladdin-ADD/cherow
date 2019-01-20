// export building env: rollup-plugin-replace will replace __extensible__ when building,

export const env = {
  //@ts-ignore
  extensible: __extensible__
};
