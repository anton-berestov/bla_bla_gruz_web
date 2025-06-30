export function objToFormData(obj: any) {
  const fd = new FormData();
  Object.keys(obj).forEach((key) => {
    fd.append(key, obj[key] === null ? '' : obj[key]);
  });
  return fd;
}
