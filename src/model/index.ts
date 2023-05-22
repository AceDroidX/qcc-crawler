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


const searchMindDataExample = {
    "KeyNo": "ec48ff26b7f0742a1e8bf9ae30b5b150",
    "QccCode": "",
    "Name": "<em>上</em><em>海</em><em>国</em><em>际</em><em>港</em><em>务</em>（<em>集</em><em>团</em>）<em>股</em><em>份</em><em>有</em><em>限</em><em>公</em><em>司</em>",
    "OperName": "顾金山",
    "ImageUrl": "https://image.qcc.com/logo/ec48ff26b7f0742a1e8bf9ae30b5b150.jpg?x-oss-process=style/logo_200",
    "IsAuth": false,
    "AuthLevel": -1,
    "isHide": false,
    "OperInfo": "{\"k\":\"p2252da41b62b22496893ff7ddd1a670\",\"o\":2,\"t\":1,\"h\":false}",
    "name": "上海国际港务（集团）股份有限公司",
    "Reason": "网站名称匹配"
}
export type SearchMindData = typeof searchMindDataExample
export type SearchMindApiData = {
    list: SearchMindData[],
    otherList: any,
}

export enum FetchTaskType {
    Search = 1,
    SupplierCustomer = 2,
}

export type FetchTask = {
    type: FetchTaskType.Search,
    layer: number,
    name: string,
    force: boolean,
    fetchDetail: boolean,
} | {
    type: FetchTaskType.SupplierCustomer,
    layer: number,
    company: CompanyInfo,
    force: boolean
}