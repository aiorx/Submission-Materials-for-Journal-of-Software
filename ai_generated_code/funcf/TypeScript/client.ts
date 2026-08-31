private buildUrlFromParams(url: string, ...params: UrlParamType[]) {
    return url.replace(/{}/g, function (): string {
      const v = unref(params.shift());
      if (typeof v === "number") return String(v);
      if (typeof v !== "string") return "";
      return String(v);
    });
  }