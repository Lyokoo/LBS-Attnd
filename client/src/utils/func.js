export const isStuIdValid = (stuId) => {
  if (typeof stuId !== 'string') return false;
  const re = /^[0-9a-zA-Z\-]*$/g;
  const len = stuId.replace(re, '').length;
  if (len === 0) return true;
  return false;
};

export const throttle = (func, wait) => {
  let now, previous = 0;
  return function (...args) {
    now = +new Date();
    if (now - previous > wait) {
      func.apply(this, [...args]);
      previous = now;
    }
  }
};

export const debounce = (func, wait, immediate) => {
  let timeId = null;
  return function (...args) {
    clearTimeout(timeId);
    // 立即执行
    if (immediate) {
      if (!timeId) func.apply(this, [...args]);
      timeId = setTimeout(() => {
        timeId = null;
      }, wait);
    }
    // 停止后执行
    else {
      timeId = setTimeout(() => {
        func.apply(this, [...args]);
      }, wait);
    }
  }
};