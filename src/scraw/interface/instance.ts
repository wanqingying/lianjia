
export interface HouseInfoDB extends HouseInfoDH {
  houseId: number;
  createdAt: string;
  updatedAt: string;
}

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

export interface HouseAreaDB extends HouseAreaDH {
  areaId: number;
  createdAt: string;
  updatedAt: string;
}

export interface HouseAreaDH {
  cityEn: string;
  cityCn: string;
  nameEn: string;
  nameCn: string;
  pageIndex: number;
  lastFetchTime: Date;
}
