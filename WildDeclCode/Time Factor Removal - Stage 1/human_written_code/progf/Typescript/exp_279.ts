type GetFilePathFunc = function (url: string) { return string; };

export interface ApiConfig {
  url: string;
  getFilePath: GetFilePathFunc;
}
