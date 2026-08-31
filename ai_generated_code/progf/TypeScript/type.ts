// type Aided with basic GitHub coding tools
export type BikeData = {
  sno: string; // 站點代號
  sna: string; // 站點名稱(中文)
  sarea: string; // 行政區(中文)
  mday: string; // 資料更新時間
  ar: string; // 站點地址(中文)
  sareaen: string; // 行政區(英文)
  snaen: string; // 站點名稱(英文)
  aren: string; // 站點地址(英文)
  act: string; // 站點狀態(1:啟用/0:停用)
  srcUpdateTime: string; // 來源資料更新時間
  updateTime: string; // 資料更新時間
  infoTime: string; // 資訊時間
  infoDate: string; // 資訊日期
  total: number; // 站點總車位數
  available_rent_bikes: number; // 可租借車輛數
  latitude: number; // 緯度
  longitude: number; // 經度
  available_return_bikes: number; // 可歸還車位數
};

export type BikeApiResponse = BikeData[];
