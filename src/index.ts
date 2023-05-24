if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ debug: true })
}
import { findTask } from "./db"
import { cleanTask, runTask } from "./task"

async function main() {
    await cleanTask(findTask())
    console.info('task cleaned')
    await runTask(findTask())
}
main()