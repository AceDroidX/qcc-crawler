import { FindCursor, WithId } from "mongodb"
import { updateSupplierCustomer, updateCompanyInfo, deleteTask } from "./db"
import { FetchTask, FetchTaskType } from "./model"
import { QCCdataType, QCCAllSupplierCustomer, QCCSearchCompany } from "./qcc"
import { isAxiosError } from "axios"

export async function runTask(cursor: FindCursor<WithId<FetchTask>>, interval = 1000) {
    let startTime = new Date()
    let count = 0
    for await (const task of cursor) {
        count += 1
        if (await runFetchTask(task)) {
            await deleteTask(task._id)
            const totalTime = ((new Date().getTime() - startTime.getTime()) / 1000).toFixed(1)
            console.info(`runTask: [${count}](${totalTime}s) delete task ${task._id}`)
        } else {
            const totalTime = ((new Date().getTime() - startTime.getTime()) / 1000).toFixed(1)
            console.info(`runTask: [${count}](${totalTime}s) skip task ${task._id}`)
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
        if (isAxiosError(err)) {
            if (err.response?.status == 412) console.error(err.message)
            else console.error(err)
        } else {
            console.error(err)
        }
        process.exit(1)
        return false
    }
}

export async function fetchSupplierCustomer(key: string) {
    const result1 = await updateSupplierCustomer(key, QCCdataType.Customer, await QCCAllSupplierCustomer(key, QCCdataType.Customer))
    const result2 = await updateSupplierCustomer(key, QCCdataType.Supplier, await QCCAllSupplierCustomer(key, QCCdataType.Supplier))
    return result1.acknowledged && result2.acknowledged
}
