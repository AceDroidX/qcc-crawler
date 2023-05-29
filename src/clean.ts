if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ debug: true })
}
import { findTask, taskCount } from "./db"
import { cleanTask } from "./task"

async function main() {
    await cleanTask(findTask(), await taskCount())
    console.info('task cleaned')
}
main()