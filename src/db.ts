import { MongoClient, ObjectId } from 'mongodb'
import { CompanyData, CompanyInfo, FetchTask, SupplierCustomerData } from './model';
import { QCCdataType } from './qcc';

const client = new MongoClient(
    process.env.NODE_ENV == 'production'
        ? `mongodb://admin:${process.env.MONGODB_PASS}@${process.env.MONGODB_IP}:27017/?authMechanism=DEFAULT`
        : 'mongodb://admin:admin@localhost:27017/', { retryReads: true, retryWrites: true }
);
client.on('serverHeartbeatFailed', event => { console.warn(`serverHeartbeatFailed: ${JSON.stringify(event)}`); });
const db = client.db('qcc')
const companysColl = db.collection<CompanyData>('companys')
const tasksColl = db.collection<FetchTask>('tasks')

export function updateCompanyInfo(data: CompanyInfo) {
    return companysColl.updateOne({ KeyNo: data.KeyNo }, { $set: data }, { upsert: true })
}
export function updateSupplierCustomer(key: string, dataType: QCCdataType, data: SupplierCustomerData[]) {
    const update = dataType == QCCdataType.Supplier ? { Supplier: data } : { Customer: data }
    return companysColl.updateOne({ KeyNo: key }, { $set: update }, { upsert: true })
}
export function findCompany() {
    return companysColl.find()
}
export function findCompanyByKey(key: string) {
    return companysColl.findOne({ KeyNo: key })
}

export function insertTask(data: FetchTask) {
    return tasksColl.insertOne(data)
}
export function findTask() {
    return tasksColl.find()
}
export function deleteTask(id: ObjectId) {
    return tasksColl.deleteOne({ _id: id })
}