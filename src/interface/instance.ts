export interface HouseInfoDB extends HouseInfoDH, BaseSeq {
  houseId: number;
}

export interface BaseSeq {
  createdAt: string;
  updatedAt: string;
}

// 房产详情
export interface HouseInfoDH extends HouseInfoDJ {
  houseDetailId: string;
  areaEn: string;
  areaCn: string;
  community: string;
  communityLink: string;
  xiaoqu: string;
  xiaoquLink: string;
  title: string;
  tag: string;
  link: string;
  priceTotal: number;
  priceUnit: number;
  size: number;
}

export interface HouseInfoDJ {
  cityEn: string;
  cityCn: string;
}

// 区域信息
export interface HouseAreaDB extends HouseAreaDH, BaseSeq {
  areaId: number;
}

export interface HouseAreaDH {
  cityEn: string;
  cityCn: string;
  nameEn: string;
  nameCn: string;
  pageIndex: number;
  lastFetchTime: Date;
}

export interface HousePriceInfoDH {
  houseDetailId: string;
  priceTotal: number;
  priceUnit: number;
  size: number;
}
// 房产价格信息
export interface HousePriceInfoDB extends HousePriceInfoDH, BaseSeq {
  PriceInfoId: number;
}
