if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ debug: true })
}
import { QCCAllSupplierCustomer, QCCdataType, QCCGetSupplierCustomer } from "./qcc"
import { updateCompanyInfo, updateSupplierCustomer } from "./db"

async function main() {
    await fetchSupplierCustomer('ec48ff26b7f0742a1e8bf9ae30b5b150')
    // updateSupplierCustomer()
}
main()

async function fetchSupplierCustomer(key: string) {
    await updateSupplierCustomer(key, QCCdataType.Customer, await QCCAllSupplierCustomer(key, QCCdataType.Customer))
    await updateSupplierCustomer(key, QCCdataType.Supplier, await QCCAllSupplierCustomer(key, QCCdataType.Supplier))
}