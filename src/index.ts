if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ debug: true })
}
import { QCCdataType, QCCGetSupplierCustomer } from "./qcc"
import { updateCompanyInfo, updateSupplierCustomer } from "./db"

async function main() {
    const resp = await QCCGetSupplierCustomer('78045ae17d1d9487163b97233b7477d2', QCCdataType.Supplier)
    console.log(JSON.stringify(resp.data))
    for (const item of resp.data.data) {

    }
    // updateSupplierCustomer()
}
// main()