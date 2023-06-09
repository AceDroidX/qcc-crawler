if (process.env.NODE_ENV != 'production') {
    require('dotenv').config({ debug: true })
}
import { QCCAllSupplierCustomer, QCCdataType, QCCGetSupplierCustomer, QCCSearchCompany } from "./qcc"
import { deleteTask, findTask, insertTask, updateCompanyInfo, updateSupplierCustomer } from "./db"
import { FetchTask, FetchTaskType } from "./model"
import { checkTaskIsUnnecessary, forceUpdateSupplierCustomerTaskForAllCompany, runFetchTask, runTask } from "./task"
import { readSourceJson, sourceToTask } from "./excel"

async function test_q1() {
    const resp = await QCCSearchCompany("上海国际港务（集团）股份有限公司")
    console.log(resp)
}
async function test_q2() {
    const resp = await QCCGetSupplierCustomer('ec48ff26b7f0742a1e8bf9ae30b5b150', QCCdataType.Supplier)
    console.log(resp.data)
}
async function test_q3() {
    const data = await QCCAllSupplierCustomer('ec48ff26b7f0742a1e8bf9ae30b5b150', QCCdataType.Supplier)
    console.log(data)
}
/**
 * 测试添加/更新企业信息
 */
async function test_d1() {
    const data1 = {
        ImageUrl: 'https://image.qcc.com/logo/ec48ff26b7f0742a1e8bf9ae30b5b150.jpg?x-oss-process=style/logo_200',
        KeyNo: "ec48ff26b7f0742a1e8bf9ae30b5b150",
        CompanyName: "上海国际港务（集团）股份有限公司"
    }
    console.log(await updateCompanyInfo(data1))
}
/**
 * 测试添加企业供应商客户
 */
async function test_d2() {
    const data = [
        {
            "KeyNo": "9a6afb4c66b29304df2890876ea8af37",
            "CompanyName": "深圳瑞捷工程咨询股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/9a6afb4c66b29304df2890876ea8af37.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 927.22,
            "ReportYear": "2021",
            "Month": "03",
            "Source": "供应商公告",
            "SourceId": "9e288e742d9ec6611bcb308837f15131",
            "SourceCode": 4,
            "Relationship": "未知",
            "GroupIdAll": "70887f7907e85ce1a37df7e49a73ee98",
            "GroupCountAll": 1
        },
        {
            "KeyNo": "bc8375323c0b84d9a3f3f68c3514267b",
            "CompanyName": "普联软件股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/bc8375323c0b84d9a3f3f68c3514267b.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 559.45,
            "ReportYear": "2020",
            "Month": "07",
            "Source": "供应商公告",
            "SourceId": "50a1e1dab680ae97e1a6c685ea0509cc",
            "SourceCode": 4,
            "Relationship": "未知",
            "GroupIdAll": "28d6354bbae392e366484177cb167581",
            "GroupCountAll": 1
        },
        {
            "KeyNo": "e00a4c40ca8e977686710e814fac6757",
            "CompanyName": "上海罗曼照明科技股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/e00a4c40ca8e977686710e814fac6757.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 1007.67,
            "ReportYear": "2018",
            "Month": "12",
            "Source": "供应商公告",
            "SourceId": "b5eb2639b7f8f2cbf325b199db6917fe",
            "SourceCode": 4,
            "Relationship": "未知",
            "GroupIdAll": "26e1ea06b2064391f2830e41391ea598",
            "GroupCountAll": 2
        },
        {
            "KeyNo": "a75dced46ecc65747c10a2d46c6fd070",
            "CompanyName": "河南英开电气股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/a75dced46ecc65747c10a2d46c6fd070.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 1853.33,
            "ReportYear": "2018",
            "Month": "04",
            "Source": "供应商公告",
            "SourceId": "94694c13a50ec1af2c96212222529e1c",
            "SourceCode": 4,
            "Relationship": "无关联",
            "GroupIdAll": "810b6497fff64364590e3c3d31df57e7",
            "GroupCountAll": 10
        },
        {
            "KeyNo": "75416eafce37a61b7b6a1e0faf99430b",
            "CompanyName": "美世联合创业投资股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/75416eafce37a61b7b6a1e0faf99430b.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 4689.05,
            "ReportYear": "2018",
            "Month": "04",
            "Source": "供应商公告",
            "SourceId": "c56f72cef29a0fc90918d36f262c373c",
            "SourceCode": 4,
            "Relationship": "无关联",
            "GroupIdAll": "5e7d31b5c4b46825c1c91ea6dbd2bde8",
            "GroupCountAll": 1
        },
        {
            "KeyNo": "f5e9639a46ac1d0e74f0a35e952f21c4",
            "CompanyName": "北京市金龙腾装饰股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/f5e9639a46ac1d0e74f0a35e952f21c4.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 4689.05,
            "ReportYear": "2018",
            "Month": "04",
            "Source": "供应商公告",
            "SourceId": "eb48cb4963552e3593cb94688940c2fd",
            "SourceCode": 4,
            "Relationship": "无关联",
            "GroupIdAll": "2fcbfab2f3c8a517a055ee8a27aa69e8",
            "GroupCountAll": 4
        },
        {
            "KeyNo": "0368dfc9b8fbf91b96793b51f1d2cd20",
            "CompanyName": "新疆拉夏贝尔服饰股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/0368dfc9b8fbf91b96793b51f1d2cd20.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 6319,
            "ReportYear": "2017",
            "Month": "12",
            "Source": "供应商公告",
            "SourceId": "a0120a24e3332a8af4a7b21ffbf2afd9",
            "SourceCode": 4,
            "Relationship": "未知",
            "GroupIdAll": "a6bff6f15124a886dc5a83050081ba14",
            "GroupCountAll": 3
        },
        {
            "KeyNo": "454bc346974f1f7291e6c10373040ff2",
            "CompanyName": "上海拉夏贝尔服饰股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/454bc346974f1f7291e6c10373040ff2.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 17177,
            "ReportYear": "2017",
            "Month": "09",
            "Source": "供应商公告",
            "SourceId": "10e62337553a5d045187d4a6413dd6f9",
            "SourceCode": 4,
            "Relationship": "未知",
            "GroupIdAll": "391df37a904e1bac66ccae931695b855",
            "GroupCountAll": 5
        },
        {
            "KeyNo": "ef54a03e2c7b8cbe7ecfa5955fdbcc5c",
            "CompanyName": "北京维拓时代建筑设计股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/ef54a03e2c7b8cbe7ecfa5955fdbcc5c.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 1294.58,
            "ReportYear": "2017",
            "Month": "07",
            "Source": "供应商公告",
            "SourceId": "a92c49f86ad4d53865bc8651fab1b881",
            "SourceCode": 4,
            "Relationship": "未知",
            "GroupIdAll": "b06b068475c535af963091fc59b618df",
            "GroupCountAll": 3
        },
        {
            "KeyNo": "d1fd16a82964a50f1f9f4b1bf795de7e",
            "CompanyName": "北京博锐尚格节能技术股份有限公司",
            "ImageUrl": "https://image.qcc.com/logo/d1fd16a82964a50f1f9f4b1bf795de7e.jpg?x-oss-process=style/logo_200",
            "Proportion": 0,
            "Quota": 431.8,
            "ReportYear": "2017",
            "Month": "06",
            "Source": "供应商公告",
            "SourceId": "ae85a1e5c42b5e91659173e28a938dee",
            "SourceCode": 4,
            "Relationship": "未知",
            "GroupIdAll": "76a59081eca198e9387a162bf9494ec4",
            "GroupCountAll": 2
        }
    ]
    console.log(await updateSupplierCustomer('ec48ff26b7f0742a1e8bf9ae30b5b150', QCCdataType.Customer, data))
}
/**
 * 测试添加两种任务
 */
async function test_d3() {
    const data1: FetchTask = {
        type: FetchTaskType.Search,
        layer: 0,
        name: "上海国际港务（集团）股份有限公司",
        force: true,
        fetchDetail: false,
    }
    console.log(await insertTask(data1))
    const data2: FetchTask = {
        type: FetchTaskType.SupplierCustomer,
        layer: 0,
        company: {
            ImageUrl: 'https://image.qcc.com/logo/ec48ff26b7f0742a1e8bf9ae30b5b150.jpg?x-oss-process=style/logo_200',
            KeyNo: "ec48ff26b7f0742a1e8bf9ae30b5b150",
            CompanyName: "上海国际港务（集团）股份有限公司"
        },
        force: true
    }
    console.log(await insertTask(data2))
    const data3: FetchTask = {
        type: FetchTaskType.SupplierCustomer,
        layer: 0,
        company: {
            ImageUrl: 'https://image.qcc.com/logo/ec48ff26b7f0742a1e8bf9ae30b5b150.jpg?x-oss-process=style/logo_200',
            KeyNo: "ec48ff26b7f0742a1e8bf9ae30b5b150",
            CompanyName: "上海国际港务（集团）股份有限公司"
        },
        force: false
    }
    console.log(await insertTask(data3))
}
async function test_d4() {
    const task = findTask()
    for (const _ of Array(2).keys()) {
        const data3 = await task.next()
        console.log(data3)
        if (data3) console.log(await deleteTask(data3._id))
    }
}
async function test_t1() {
    const data1: FetchTask = {
        type: FetchTaskType.Search,
        layer: 0,
        name: "上海国际港务（集团）股份有限公司",
        force: true,
        fetchDetail: false,
    }
    console.log(await runFetchTask(data1))
    const data2: FetchTask = {
        type: FetchTaskType.SupplierCustomer,
        layer: 0,
        company: {
            ImageUrl: 'https://image.qcc.com/logo/ec48ff26b7f0742a1e8bf9ae30b5b150.jpg?x-oss-process=style/logo_200',
            KeyNo: "ec48ff26b7f0742a1e8bf9ae30b5b150",
            CompanyName: "上海国际港务（集团）股份有限公司"
        },
        force: true
    }
    console.log(await runFetchTask(data2))
}
async function test_t2() {
    await runTask(findTask())
}
async function test_t3() {
    await forceUpdateSupplierCustomerTaskForAllCompany()
}
/**
 * 测试FetchTaskType.Search, force: true, fetchDetail: true
 */
async function test_t4() {
    const data1: FetchTask = {
        type: FetchTaskType.Search,
        layer: 0,
        name: "上海国际港务（集团）股份有限公司",
        force: true,
        fetchDetail: true,
    }
    console.log(await runFetchTask(data1))
}
/**
 * 测试FetchTaskType.Search, force: false, fetchDetail: true
 */
async function test_t5() {
    const data1: FetchTask = {
        type: FetchTaskType.Search,
        layer: 0,
        name: "上海国际港务（集团）股份有限公司",
        force: false,
        fetchDetail: true,
    }
    console.log(await runFetchTask(data1))
    const data2: FetchTask = {
        type: FetchTaskType.Search,
        layer: 0,
        name: "上海国际港务（集团）股份有限公司",
        force: false,
        fetchDetail: true,
    }
    console.log(await runFetchTask(data2))
}
/**
 * 测试checkTaskIsUnnecessary
 */
async function test_t6() {
    await test_d1()
    await test_d2()
    const data1: FetchTask = {
        type: FetchTaskType.Search,
        layer: 0,
        name: "上海国际港务（集团）股份有限公司",
        force: true,
        fetchDetail: false,
    }
    const data2: FetchTask = {
        type: FetchTaskType.SupplierCustomer,
        layer: 0,
        company: {
            ImageUrl: 'https://image.qcc.com/logo/ec48ff26b7f0742a1e8bf9ae30b5b150.jpg?x-oss-process=style/logo_200',
            KeyNo: "ec48ff26b7f0742a1e8bf9ae30b5b150",
            CompanyName: "上海国际港务（集团）股份有限公司"
        },
        force: true
    }
    const data3: FetchTask = {
        type: FetchTaskType.SupplierCustomer,
        layer: 0,
        company: {
            ImageUrl: 'https://image.qcc.com/logo/ec48ff26b7f0742a1e8bf9ae30b5b150.jpg?x-oss-process=style/logo_200',
            KeyNo: "ec48ff26b7f0742a1e8bf9ae30b5b150",
            CompanyName: "上海国际港务（集团）股份有限公司"
        },
        force: false
    }
    console.log(await checkTaskIsUnnecessary(data1))
    console.log(await checkTaskIsUnnecessary(data2))
    console.log(await checkTaskIsUnnecessary(data3))
}
/**
 * 添加公司信息、供应商客户、任务
 */
async function test_t7() {
    await test_d1()
    await test_d2()
    await test_d3()
}
function test_e1() {
    console.log(readSourceJson())
}
/**
 * Entrypoint
 * 从Excel添加搜索任务
 */
async function test_e2() {
    await sourceToTask()
    console.log('done')
}
async function test() {
    await test_d3()
    await test_t2()
}
test_t7()