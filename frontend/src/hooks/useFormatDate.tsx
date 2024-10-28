export const onFormatDate = (date?: Date): string => {
  if (!date) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const _convertStringDate_to_DMA = (date: string, type: string = "/") => {
  if (!date || typeof date !== "string") {
    return undefined;
  }

  const part = date.split(",");
  let s = "";
  if (part.length !== 3) {
    return undefined;
  }

  let year = !isNaN(part[0] as any) ? parseInt(part[0] as any) : 0;
  let month = !isNaN(part[1] as any) ? parseInt(part[1] as any) : 0;
  let day = !isNaN(part[2] as any) ? parseInt(part[2] as any) : 0;
  s = `${day.toString().padStart(2, "0")}${type}${month
    .toString()
    .padStart(2, "0")}${type}${year.toString()}`;
  // Retorna en formato: DD(type)MM(type)AAAA
  return s;
};

export const _formatDate_DDMMYY = (date?: Date): string => {
  return !date
    ? ""
    : (date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`) +
        "/" +
        (date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`) +
        "/" +
        date.getFullYear();
};
