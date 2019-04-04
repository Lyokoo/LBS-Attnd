export const isStuIdValid = (stuId) => {
  if (typeof stuId !== 'string') return false;
  const re = /^[0-9a-zA-Z\-]*$/g;
  const len = stuId.replace(re, '').length;
  if (len === 0) return true;
  return false;
};