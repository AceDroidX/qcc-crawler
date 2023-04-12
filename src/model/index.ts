const dataExample = {
    "KeyNo": "b8e0b6ef16dde1b1e3c5a8180cd7ae18",
    "CompanyName": "英雄互娱科技股份有限公司",
    "ImageUrl": "https://image.qcc.com/logo/b8e0b6ef16dde1b1e3c5a8180cd7ae18.jpg?x-oss-process=style/logo_200",
    "Proportion": 0,
    "Quota": 6470.4,
    "ReportYear": "2022",
    "Month": "04",
    "Source": "供应商公告",
    "SourceId": "4a5381a1a59ac50906c239af065a9e93",
    "SourceCode": 4,
    "Relationship": "无关联",
    "GroupIdAll": "e7b3535658f3e244b7da68b6b4bbcf47",
    "GroupCountAll": 2
}

const pageInfoExample = {
    "total": 4,
    "pageSize": 10,
    "pageIndex": 1
}

export type SupplierCustomerData = typeof dataExample

export type SupplierCustomerApiData = {
    data: SupplierCustomerData[],
    pageInfo: typeof pageInfoExample,
    groupItems: any,
}

export type CompanyInfo = {
    KeyNo: string,
    CompanyName: string,
    ImageUrl: string,
}

export type CompanyData = CompanyInfo & {
    updateTime: Date,
    Supplier: SupplierCustomerData[],
    Customer: SupplierCustomerData[],
}

export enum FetchTaskType {
    Search = 1,
    SupplierCustomer = 2,
}

export type FetchTask = {
    type: FetchTaskType.Search,
    layer: number,
    name: string,
} | {
    type: FetchTaskType.SupplierCustomer,
    layer: number,
    company: CompanyInfo,
}