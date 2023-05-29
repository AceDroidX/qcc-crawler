if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ debug: true })
}
import { findTask } from "./db"
import { runTask } from "./task"

async function main() {
    await runTask(findTask())
    console.info('task finished')
}
main()