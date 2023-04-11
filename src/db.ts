import { MongoClient } from 'mongodb'
import { CompanyData, CompanyInfo, SupplierCustomerData } from './model';
import { QCCdataType } from './qcc';

const client = new MongoClient(
    process.env.NODE_ENV == 'production'
        ? `mongodb://admin:${process.env.MONGODB_PASS}@${process.env.MONGODB_IP}:27017/?authMechanism=DEFAULT`
        : 'mongodb://admin:admin@localhost:27017/', { retryReads: true, retryWrites: true }
);
client.on('serverHeartbeatFailed', event => { console.warn(`serverHeartbeatFailed: ${JSON.stringify(event)}`); });
const db = client.db('qcc')
const coll = db.collection<CompanyData>('companys')

export function updateCompanyInfo(data: CompanyInfo) {
    return coll.updateOne({ KeyNo: data.KeyNo }, { $set: data }, { upsert: true })
}
export function updateSupplierCustomer(key: string, dataType: QCCdataType, data: SupplierCustomerData[]) {
    const update = dataType == QCCdataType.Supplier ? { Supplier: data } : { Customer: data }
    return coll.updateOne({ KeyNo: key }, { $set: update }, { upsert: true })
}