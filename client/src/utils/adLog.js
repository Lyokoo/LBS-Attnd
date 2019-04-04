const isShow = true;

export const log = (hint, msg) => {
  if (!isShow) return;
  console.log(`【${hint}】`, msg);
};

export const warn = (hint, msg) => {
  if (!isShow) return;
  console.warn(`【${hint}】`, msg);
};

export const error = (hint, msg) => {
  if (!isShow) return;
  console.error(`【${hint}】`, msg);
}