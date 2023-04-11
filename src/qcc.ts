import { SupplierCustomerApiData, SupplierCustomerData } from "./model";
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
        const resp = await QCCGetSupplierCustomer(key, dataType)
        maxIndex = Math.ceil(resp.data.pageInfo.total / resp.data.pageInfo.pageSize)
        result = result.concat(resp.data.data)
        index += 1
    }
    return result
}

export function QCCGetSearchMind(searchKey: string) {
    return QCCGet<any>(`/api/search/searchMind?mindKeyWords=true&mindType=9&pageSize=5&person=true&searchKey=${searchKey}&suggest=true`)
}