import { CompanyInfo, SearchMindApiData, SupplierCustomerApiData, SupplierCustomerData } from "./model";
import { QCCGet } from "./qcc_sign";

export enum QCCdataType {
    Supplier = 0,
    Customer = 1,
}

export function QCCGetSupplierCustomer(key: string, dataType: QCCdataType, pageIndex = 1) {
    return QCCGet<SupplierCustomerApiData>(`/api/datalist/supplierCustomer?companyKeyNo=${key}&dataType=${dataType}&keyNo=${key}&pageIndex=${pageIndex}`)
}

export async function QCCAllSupplierCustomer(key: string, dataType: QCCdataType) {
    let index = 1
    let maxIndex = 1
    let result: SupplierCustomerData[] = []
    while (index <= maxIndex) {
        const resp = await QCCGetSupplierCustomer(key, dataType, index)
        maxIndex = Math.ceil(resp.data.pageInfo.total / resp.data.pageInfo.pageSize)
        result = result.concat(resp.data.data)
        index += 1
    }
    return result
}

export function QCCGetSearchMind(searchKey: string) {
    return QCCGet<SearchMindApiData>(`/api/search/searchMind?mindKeyWords=true&mindType=9&pageSize=5&person=true&searchKey=${encodeURI(searchKey)}&suggest=true`)
}
export async function QCCSearchCompany(name: string): Promise<CompanyInfo | null> {
    const resp = await QCCGetSearchMind(name)
    const result = resp.data.list[0]
    const convertedName = name.replace('(', '（').replace(')', '）')
    if (result.name == convertedName) {
        return {
            KeyNo: result.KeyNo,
            CompanyName: result.name,
            ImageUrl: result.ImageUrl,
        }
    }
    console.warn(`QCCSearchCompany: result.name != name\nresult.name: ${result.name}\nname: ${name}`)
    return null
}