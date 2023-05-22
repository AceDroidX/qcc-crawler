import * as XLSX from 'xlsx';
import { insertTask } from './db';
import { FetchTask, FetchTaskType } from './model';

const filename = '第一批.xlsx'
type ExcelStruct = {
    '企业名称': string,
    '股票代码': number,
}

export function readSourceJson() {
    let workbook = XLSX.readFile(filename);
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
}

export async function sourceToTask() {
    for (const item of readSourceJson() as ExcelStruct[]) {
        const task: FetchTask = { type: FetchTaskType.Search, layer: 0, name: item.企业名称, force: false, fetchDetail: true }
        if (!(await insertTask(task)).acknowledged) console.error(`sourceToTask: ${task}`)
    }
}