const ExcelJS = require('exceljs');
const path = require("path")
const fs = require("fs")

const tenantHeader = [
    "domainName",
    "companyName",
    "accountType",
    "internalUse",
    "status",
    "domainId",
    "campaign",
    "firstUseClicks",
    "owner",
    "ownerEmailAddress",
    "accountAge"
]
const deviceHeader = [
    "domainId",
    "domainName",
    "deviceId",
    "deviceName",
    "planId",
    "planName",
    "deviceType",
    "deviceSubType",
    "lastSeen"
]

const parseInputRow = (rowData, header) => {
    const res = {}
    rowData.forEach((item, index) => {
        res[header[index]] = item
    })
    return res
}


const init = async () => {
    try {
        const deviceFiles = fs.readdirSync(path.join(__dirname, "input", "devices"))
        const tenantFiles = fs.readdirSync(path.join(__dirname, "input", "tenants"))
        if (deviceFiles.length == 0 || tenantFiles.length == 0) {
            throw new Error("Input file is missing")
        }
        const devicePath = path.join(__dirname, "input", "devices", deviceFiles[0])
        const tenantPath = path.join(__dirname, "input", "tenants", tenantFiles[0])

        const deviceWorkbook = new ExcelJS.Workbook();
        const deviceWorksheet = await deviceWorkbook.csv.readFile(devicePath);
        const tenantWorkbook = new ExcelJS.Workbook();
        const tenantWorksheet = await tenantWorkbook.csv.readFile(tenantPath);

        const tenantData = []
        const deviceData = []
        tenantWorksheet.eachRow(function (row, rowNumber) {
            if (rowNumber != 1)
                tenantData.push(parseInputRow(row.values.slice(1), tenantHeader))
        })
        deviceWorksheet.eachRow(function (row, rowNumber) {
            if (rowNumber != 1)
                deviceData.push(parseInputRow(row.values.slice(1), deviceHeader))
        })

        const outputData = deviceData.map(device => {
            const tenant = tenantData.find(el => el.domainName == device.domainName)
            return {
                ...device,
                ...tenant
            }
        })


        const outputWorkbook = new ExcelJS.Workbook();
        let outputSheet;
        if (fs.existsSync("output/master.xlsx")) {
            await outputWorkbook.xlsx.readFile("output/master.xlsx")
            outputSheet=outputWorkbook.getWorksheet(1)
        } else {
            outputSheet = outputWorkbook.addWorksheet();
        }

        outputSheet.columns = [
            { header: "Domain Name", key: "domainName" },
            { header: "Company Name", key: "companyName" },
            { header: "Owner", key: "owner" },
            { header: "Owner Email Address", key: "ownerEmailAddress" },
            { header: "Account Age", key: "accountAge" },
            { header: "Device Name", key: "deviceName" },
            { header: "Plan Name", key: "planName" },
            { header: "Device Type", key: "deviceType" },
            { header: "Device SubType", key: "deviceSubType" },
            { header: "Last Seen", key: "lastSeen" },
            { header: "Merged Date", key: "mergedDate" },
            { header: "Merged Files", key: "mergedFiles" }
        ];

        // Map the outputData to exclude the unwanted columns
        outputData.map(row => {
            const filteredRow = {
                domainName: row.domainName,
                companyName: row.companyName,
                owner: row.owner,
                ownerEmailAddress: row.ownerEmailAddress,
                accountAge: row.accountAge,
                deviceName: row.deviceName,
                planName: row.planName,
                deviceType: row.deviceType,
                deviceSubType: row.deviceSubType,
                lastSeen: row.lastSeen,
                mergedDate: new Date(),
                mergedFiles: "Device: "+deviceFiles[0]+" Tenant: "+tenantFiles[0]
            };
            outputSheet.addRow(filteredRow);
        });

        await outputWorkbook.xlsx.writeFile(path.join(__dirname, "output", "master.xlsx"));


        //Moving input files to executed
        const executedDeviceDir = "executed/devices"
        const executedTenantDir = "executed/tenants"

        if (!fs.existsSync(executedDeviceDir)) {
            fs.mkdirSync("executed");
            fs.mkdirSync(executedDeviceDir);
        }
        if (!fs.existsSync(executedTenantDir)) {
            fs.mkdirSync(executedTenantDir);
        }

        fs.renameSync(devicePath, path.join(executedDeviceDir, deviceFiles[0]))
        fs.renameSync(tenantPath, path.join(executedTenantDir, tenantFiles[0]))




    } catch (err) { console.log("Error Occur"); console.log(err) }

}



init();