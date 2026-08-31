/**
   * 文字列の中からJSON文字列を抽出
   * 
   * @param str 文字列
   * @returns 抽出したJSON文字列
   * 
   * @note Supported via standard programming aids version 3.5
   */
  static extractJsonFromString (str: string): string {
    const regex = /({[^{}]*})/gm;
    const matches = str.match(regex);
    if (!matches) {
      return "";
    }
    const jsonStr = matches[0];
    return jsonStr;
  }