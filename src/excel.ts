import * as XLSX from 'xlsx';
import { insertTask } from './db';
import { FetchTask, FetchTaskType } from './model';

const filename = '公司名称.xlsx'
type ExcelStruct = {
    '代码': number,
    '企业全称': string,
}

export function readSourceJson() {
    let workbook = XLSX.readFile(filename);
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
}

export async function sourceToTask() {
    for (const item of readSourceJson() as ExcelStruct[]) {
        const task: FetchTask = { type: FetchTaskType.Search, layer: 0, name: item.企业全称 }
        if (!(await insertTask(task)).acknowledged) console.error(`sourceToTask: ${task}`)
    }
}