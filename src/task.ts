import { FindCursor, WithId } from "mongodb"
import { updateSupplierCustomer, updateCompanyInfo, deleteTask } from "./db"
import { FetchTask, FetchTaskType } from "./model"
import { QCCdataType, QCCAllSupplierCustomer, QCCSearchCompany } from "./qcc"

export async function runTask(cursor: FindCursor<WithId<FetchTask>>, interval = 5000) {
    for await (const task of cursor) {
        if (await runFetchTask(task)) {
            await deleteTask(task._id)
            console.info(`runNextTask: delete task ${task._id}`)
        } else {
            console.info(`runNextTask: skip task ${task._id}`)
        }
        await new Promise(r => setTimeout(r, interval));
    }
}

export async function runFetchTask(task: FetchTask): Promise<Boolean> {
    if (task.layer > 10) {
        console.warn('runFetchTask: task.layer > 10')
        return false
    }
    try {
        if (task.type == FetchTaskType.Search) {
            const resp = await QCCSearchCompany(task.name)
            if (resp) {
                return (await updateCompanyInfo(resp)).acknowledged
            } else {
                return false
            }
        } else if (task.type == FetchTaskType.SupplierCustomer) {
            return await fetchSupplierCustomer(task.company.KeyNo)
        }
        console.warn('runFetchTask: task.type unknown')
        return false
    } catch (err: any) {
        console.error(err)
        return false
    }
}

export async function fetchSupplierCustomer(key: string) {
    const result1 = await updateSupplierCustomer(key, QCCdataType.Customer, await QCCAllSupplierCustomer(key, QCCdataType.Customer))
    const result2 = await updateSupplierCustomer(key, QCCdataType.Supplier, await QCCAllSupplierCustomer(key, QCCdataType.Supplier))
    return result1.acknowledged && result2.acknowledged
}
