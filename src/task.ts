import { FindCursor, WithId } from "mongodb"
import { updateSupplierCustomer, updateCompanyInfo, deleteTask, insertTask, findCompany, findCompanyByKey } from "./db"
import { CompanyInfo, FetchTask, FetchTaskType } from "./model"
import { QCCdataType, QCCAllSupplierCustomer, QCCSearchCompany } from "./qcc"
import { isAxiosError } from "axios"

export async function runTask(cursor: FindCursor<WithId<FetchTask>>, interval = 100) {
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
                const resp1 = (await updateCompanyInfo(resp)).acknowledged
                const resp2 = task.fetchDetail ? (await insertTask({ type: FetchTaskType.SupplierCustomer, layer: task.layer, company: resp, force: false })).acknowledged : true
                return resp1 && resp2
            } else {
                return false
            }
        } else if (task.type == FetchTaskType.SupplierCustomer) {
            return await fetchSupplierCustomer(task.company, task.layer, task.force)
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

export async function fetchSupplierCustomer(company: CompanyInfo, layer: number, force: boolean): Promise<boolean> {
    if (await findCompanyByKey(company.KeyNo) && !force) return true
    if (!await updateCompanyInfo(company)) return false
    const customer = await QCCAllSupplierCustomer(company.KeyNo, QCCdataType.Customer)
    const supplier = await QCCAllSupplierCustomer(company.KeyNo, QCCdataType.Supplier)
    const result1 = await updateSupplierCustomer(company.KeyNo, QCCdataType.Customer, customer)
    const result2 = await updateSupplierCustomer(company.KeyNo, QCCdataType.Supplier, supplier)
    const tasklist = customer.map(item => {
        const companyinfo: CompanyInfo = {
            KeyNo: item.KeyNo,
            CompanyName: item.CompanyName,
            ImageUrl: item.ImageUrl,
        }
        return insertTask({ type: FetchTaskType.SupplierCustomer, layer: layer + 1, company: companyinfo, force: false })//子任务不强制更新
    })
    const insertResult = (await Promise.all(tasklist)).every(item => item.acknowledged)
    return result1.acknowledged && result2.acknowledged && insertResult
}

export async function forceUpdateSupplierCustomerTaskForAllCompany() {
    for await (const company of findCompany()) {
        const companyinfo: CompanyInfo = {
            KeyNo: company.KeyNo,
            CompanyName: company.CompanyName,
            ImageUrl: company.ImageUrl,
        }
        const insertResult = await insertTask({ type: FetchTaskType.SupplierCustomer, layer: 0, company: companyinfo, force: true })
        if (!insertResult.acknowledged) console.error(insertResult)
    }
    console.info('forceUpdateSupplierCustomerTaskForAllCompany finished successfully')
}