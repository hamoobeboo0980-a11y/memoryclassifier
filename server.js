const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "AIzaSyDeWn6mfiB-VP8hxBb878qrJ0K0_OGcGc8");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════════════
// قواعد البيانات الكاملة
// ═══════════════════════════════════════════════════════════════

const NORMAL_DB = {"8+1D2":["TP64A8","TP65A8","US-B410","7U-B309","18C-8G","28B-8G","28C-8G","JY938","JWB11","221640","231624","KMK7X000VM-B314","08EMCP08-EL2BV100","08EMCP08-EL2CV100"],"8+1":["KMF720012M-B214","KMQ72000SM-B316","KMFNX0012M-B214","KMFN10012M-B214","KMQN1000SM-B316","NW006A-B316","N10012A-B214","N60012B-B214","KMFN60012M-B214","KMQ7X000SA-B419","KMQNW000SM-B419","KMQN6000SM-B419","H9TQ64A8GTACUR-KUM","H9TQ64A8GTCCUR-KUM","H9TQ64A8GTMCUR-KUM","H9TQ64A8GTDCUR-KUM","H9TQ65A8GTACUR-KUM","TYD0GH121661RA","TYD0GH121644RA","TYD0GH121651RA","TYD0GH221664RA","221644","221651","08EMCP08-NL3DT227","08EMCP08-EL3DT527","08EMCP08-EL3DT227","08EMCP08-EL3BS100","08EMCP08-EL3BT100","08EMCP08-EL3BT227","08EMCP08-EL3BV100","08EMCP08-EL2DM327","08EMCP08-EL3CV100","08EMCP08-EL3AV100","SD9DS28K-8G","28J-8G","JWA60","JY941","JZ099","JY974"],"8+1.5":["KMQN10006B","KMQN10006M","H9TQ64AAETAC-KUM","H9TQ64AAETMC-KUM"],"8+2":["KMQN10013M","KMR7X0001M","KMRNW0001M","H9TQ64ABJTMCUR"],"16+1正码":["KMF310012M","KMF820012M","KMQ82000SM","KMQ8X000SA","KMFE10012M","KMFE60012M"],"16+1杂码":["E60012A-B214","KMQ31000SM","H9TQ17A8GTMCUR","TYD0HH231632RC","TYD0HH121662RA","16EMCP08-EL3BT527","16EMCP08-NL3DT527","16EMCP08-EL3CV100","16EMCP08-NL3DTB28","SDADB48K-16G","JZ089"],"16+1.5":["KMQ310006A","KMQ310006B","KMQ31006M","KMQE6006M","H9TQ17AAETACUR"],"16+2":["KMQ310013B","KMQE60013B","KMQ310013M-B419","KMQ820013M","KMR310001M","KMR820001M","KMR8X0001A","KMR8X0001M","KMQE10013M","KMQE60013M-B419","H9TQ17ABJTACUR","H9TQ17ABJTBCUR","H9TQ17ABJTCCUR","H9TQ17ABJTMCUR","H9TQ18ABJTMCUR","037-125BT","024-125BT","038-107BT","041-107BT","040-107BT","038-125BT"],"16+2杂码":["82001M-B612","TYEOHH221657RA","TYE0HH221668RA","TYE0HH231659RA","JY932","JY952","JZ008","JY977","JY950","JZ024","JZ094","16EMCP16-EL3CV100","16EMCP16-ML3BM500","16EMCP16-EL3DT527","16EMCP16-3GM610","16EMCP16-3GTB28","16EMCP16-3ETD28","16ENCP16-3DTB28","16EMCP16-3DTA28","16EMCP16-NL3E527","SDADF4AP-16G","SDADL2AP-16G"],"16+3":["KMR31000BA","KMR31000BM","KMRE1000BM","KMGE6001BM","H9TQ17ADFTACUR","H9TQ17ADFTBCUR","H9TQ17ADFTMCUR","JZ011","JZ006","3100BB-B614"],"32+2":["KMQX60013A","KMQ4Z0013M","KMQX10013M","KMQX60013M","H9TQ26ABJTACUR","H9TQ26ABJTBCUR","H9TQ26ABJTMCUR","KMQD60013M","H9TQ27ABJTMCUR","072-107BT"],"32+2杂码":["KMQ210013M","KMR4Z0001A","KMR4Z0001M","KMR4Z00MM","TYE0IH231658RA","JZ025","JZ002","JZ007","JZ012","JZ014"],"32+2D4":["H9HP27ABKMMDAR","H9HP27ABUMMDAR","KM4X6001KM"],"32+3":["KMGX6001BA","KMR21000BM","KMRX1000BM","KMGX6001BM","KMGD6001BM","H9TQ26ADFTACUR","H9TQ26ADFTBCUR","H9TQ27ADFTMCUR","JZ013","JZ050","SDADL28P-32G","JZ004","046-107BT","046-125BT","045-107BT","073-107BT"],"32+3杂码":["H9TQ26ADFTMCUR","JZ050"],"32+3D4":["KMDD60018M","H9HP27ADAMADAR","KMDX10018M","KMDX60018M","H9AG8GDMNB*113","JZ018","JZ083","018-125BT","084-075BT"],"32+4":["KMRX10014M","KMRX60014M","KMRD60014M","H9TQ26ACLTMCUR"],"32+4D4":["X10016A-B617","X10016M-B619","TQ27AC","H9HP27ACVUMDARKLM","H9HP26ACVUMDARKLM","KMDX6001DM"],"64+3":["KMRC1000BM","KMGP6001BM","H9TQ52ADFTMCUR","KMGP6001BA","PA094"],"64+3D4":["KM5H80018M","KMDP60018M","JZ090","HP52AD","HQ53AD","JZ185"],"64+4":["KMRC10014M","KMRH60014M","KMRH60014A","KMRP60014M","KMRP60014A","H9TQ52ACLTMCUR","H9TQ53ACLTMCUR","JZ049","JZ128","069-107BT","096-107BT","PA107-107BT","PA070"],"64+4D4":["H9HP52ACPMMDARKMM","H9HP52ACPMADARKMM","KMDH6001DM","KMDH6001DA","KMDP6001DA","KMDP6001DB","KMWC10016M","H9AG9G5ANB","HP53AC","JZ186","JZ481","JZ484","JZ109","JZ053","022-18BT","PG023","022-062BT","022-053BT","090-053BT","PA112","183-053BT"],"64+4UMCP":["HQ52AC","H9HQ53ACPMMDAR","H9HQ54ACPMMDAR","JZ177","KM5H7001DM","KM5P9001DM","KM5P8001DM","KM5C7001DM","KMDC6001DM"],"64+6":["KM3H6001CM","KM3H6001CA","H9HP52AECMMDBRKMM","H9HP52AECMMDARKMM","H9HQ53AECMMDARKEM","H9HQ54AECMMDAR","KMWC10017M","JZ052","086-075BT","PA087"],"64+6UMCP":["UMCP  4DR-64G","KM3P6001CM","KM2H7001CM","KM2P9001CM","JZ168"],"128+4UMCP":["KM5L9001DM","KM5V7001DM","HQ15AC","HQ16AC","JZ150","JZ385"],"128+4":["KMRV50014M","KMWV50017M","KMDV6001DB","KMDV6001DM","KMDV6001DA","JZ103","JZ187","JZ182","HP16AC","093-053BT","092-053BT","PA110","092-153BT","110-053BT"],"128+6":["KM3V6001CM","H9HP16AECMMDARKMM","V6001CA-B708","V6001CB-B708","JZ188","JZ105","JZ114","PA124","PA104","2Q7001CM-BB01"],"128+6UMCP":["KM2V7001CM","KM2V8001CM","H9HQ16AECMMDARKEM","H9HQ15AECMADAR","H9HQ15AECMBDAR","KM5V8001DM","KM2L9001CM","JZ100","JZ151","JZ386"],"128+8":["JZ387","JZ152","JZ266","H9HQ16AFAMMDAR","H9HQ15AFAMBDRA","H9HQ15AFAMADRA","V7001JM-B810","KM8V7001JM-B810","KM8V7001JA-B810","KM8V8001JM-B810","KM8V9001JM-B810","KMWV6001JM-B810","KM8L9001JM-B810"],"128+8D5":["KMAG9001PM"],"256+6":["H9HQ22AECMMDARKEM","KM2B8001CM","H9HQ21AECMZDAR"],"256+8":["H9QT1G6DN6","KM8B8001JM","KMF800JM","H9HQ21AFAMADARKEM","H9HQ21AFAMZDARKEM","H9HQ22AFAMMDARKEM","KM8F9001JM","JZ171","JZ396"],"256+8D5":["KMAS9001PM","JZ361"],"256+12":["KM8F8001MM","H9QT1GGBN6","H9QT1GGDN6"],"256+12D5":["JZ303","KMJS9001RM"]};

const EMMC_DB = {"16":["KLMAG4FE4B-B002","KLMAG4FEAB-B002","KLMAG2GEAC-B001","KLMAG2GEAC-B002","KLMAG2GEAC-B031","KLMAG2WEMB-B031","KLMAG2WEPD-B031","KLMAG4FEAC-B002","KLMAG2GEND-B032","KLMAG2GEND-B031","KLMAG1JENB-B041","KLMAG1JENB-B031","KLMAGIJETD-B041","THGBMAG7A2JBAIR","THGBMSG7A2JBAIR","THGBMSG7A4JBA4W","THGBMAG7A4JBA4R","THGBMBG7C2KBAIL","THGBMBG7D4KBAIW","THGBMFG7C2LBAIL","THGBMHG7C2LBAIL","THGBMFG7CILBAIL","H26M54002EMR","H26M54003EMR","H26M52103FMR","H26M52104FMR","H26M52208FPR","SDIN7DU2-16G","SDIN7DP4-16G","SDINSDE2-16G","SDINSDE4-16G","SDIN9DS2-16G","SDIN9DW4-16G"],"32":["KLMBG8FE4B-B001","KLMBG4GEAC-B001","KLMBG4WEBC-B031","KLMBG2JENB-B041","KLMBG2JETD-B041","KLMBG4GEND-B031","KLUBG4GIBD-E0B2","KLUBG4G1BD-E0B1","KLUBG4GICE-B0B1","KLUBG4WEBD-B031","KLUBG4GIBE-E0B1","THGBMSG8A4JBAIR","THGBMSG8ASJBA4X","THGBM9G8T4KBAR","THGBMAG8A4JBA4R","THGBMBG8D4KBAIR","THGBMFG8C4LBAIR","THGBMHG8C4LBAIR","THGBMF7G8K4LBATR","THGBMHG8C2LBAIL","THGBMFG8C2LBAL","H26M64001EMR","H26M64103EMR","H26M64002EMR","H26M64020SEMR","H28U64222MMR","H28U62301AMR","SDINBDA4-32G","SDIN7DP4-32G","SDIN7DU2-32G","SDINSDE4-32G","SDIN9DW4-32G","SDINADF4-32G","SDINBDG4-32G"],"64":["KLMCGAFE4B-B001","KLMCG8GEAC-B001","KLMCG8GEND-B031","KLMCG8WEBC-B031","KLMCG8WEBD-B031","KLMCG4JENB-B041","KLMCG2KCTA-B041","KLMCG2KETM-B041","KLMCG2UCTA-B041","KLMCG4JENB-B043","KLUCGSG1BD-EOBI","KLUCGSG1BD-E0B2","KLUCG4J1BB-E0B1","KLUCG4J1CB-B0B1","KLUCG1JIED-B0CI","KLUCG2K1EA-B0CI","KLUCG2UCTA-B041","KLUCG4J1EB-B0B1","KLUCG4JIED-B0C1","THGAF4G9N4LBAIR","THGAFSG9T43BAIR","THGBMGG9T4LBAIG","THGBMHG9C4LBAIR","THGBF7G9L4LBATR","THGLF2G9JSLBATC","THGLF2G9JSLBATR","H26M78103CCR","H26M74002EMR","H26M78208CMR","H26M74002HMR","H28U74301AMR","H28M7820SCMR","H28U74303AMR","H28S7Q302BMR","SDIN9DW5-64G","SDIN8DE4-64G","SDINADF4-64G","SDINBDA4-64G","SDINBDD4-64G","SDINDDH4-64G","JZO23","JZ023","JZ160","JZ495"],"128":["KLMDG8JENB-B041","KLMDG4UCTA-B041","KLMDG4UCTB-B041","KLMDG4UERM-B041","KLMDG8JEUD-B04P","KLMDG8JEUD-B04Q","KLMDG8VERF-B041","KLMDGAWEBD-B031","KLUDG8J1CB-C0B1","KLUDG8J1CR-B0B1","KLUDG8VIEE-B0CI","KLUDGAGIBD-E0B1","KLUDG4UIEA-B0CI","KLUDG4U1FB-B0C1","KLUDG4UIYB-BOCP","KLUDG4UIYB-BOCQ","KLUDG4UHDB-B2D1","KLUDG4UHDB-B2E1","KLUDG4UHDC-BOE1","KLUDGSJIZD-BOCP","KLUDGSJIZD-BOCQ","THGAF4TONSLBAIR","THGAFSTOT43BAIR","THGAFBTOT43BABS","THGBF7T0L8LBATA","THGBMFTOCSLBAIG","THGBMHTOCSLBAIG","THGAMRTOT43BAIR","H28U88301AMR","H26T87001CMR","H28S8D301DMR","HNST0SBZGKX015N","HNSTOSDEHKX073N","HNST061ZGKX012N","HNST062EHKX039N","SDINADF4-128G","SDINBDA4-128G","SDINBDA6-128G","SDINDDH4-128G","SDINEDK4-128G","SDINFDO4-128G","JZ144","JZ156","JZ159","JZ244","JZ341","JZ380","JZ496"],"256":["KLMEGSUCTA-B041","KLUEG8U1YB-BOCP","KLUEG8UIYB-BOCQ","KLUEG8UHDB-C2E1","KLUEG8UHDC-BOEI","KLUEGAJIZD-BOCP","KLUEGAJIZD-BOCQ","KLUEGSUIEA-B0CI","THGAFSTITS3BAIR","THGAFBTITS3BABS","THGJFATITS4BAIR","THGJFCTIT84BAIC","H28S9Q301CMR","H28S9X401CMR","HNSTISBZGKX016N","HNSTISDEHKX075N","HNST161ZGKX013N","HN8T162EHKX04IN","SDINBDA4-256G","SDINBDA6-256G","SDINDDH4-256G","SDINEDK4-256G","SDINFDO4-256G","SDINFEO2-256G","JZ147","JZ242","JZ345","JZ369"],"512":["KLUFGSRIEM-B0C1","KLUFGSRHDA-B2E1","KLUFGSRHDB-BOE1","KLUFGSRIEM-BOC1","THGJFAT2T84BAIR","THGJFCT2T84BAIC","HNST2SDEHKX077N","SDINEDK4-512G","SDINFDO4-512G"]};

const MICRON_DB = {"8":["JWA60","JW687"],"16":["JW788"],"32":["JZ132"],"64":["JZ023","JZ160","JZ495","JZ075","JZ178","JZ196","JZ528"],"128":["JZ057","JZ144","JZ156","JZ064","JZ380","JZ341","JZ417","JZ447","JZ413"],"256":["JZ067","JZ161","JZ369","JZ418","JZ449","JZ348","JZ242","JZ459"],"512":["JZ347"]};

// ═══════════════════════════════════════════════════════════════
// دالة البحث في قواعد البيانات (بدون Gemini)
// ═══════════════════════════════════════════════════════════════

function searchInDB(code) {
    if (!code) return null;
    const upperCode = code.toUpperCase().trim();

    // 1) بحث مباشر في جدول العادي
    for (const [capacity, codes] of Object.entries(NORMAL_DB)) {
        for (const c of codes) {
            if (upperCode === c.toUpperCase() || upperCode.startsWith(c.toUpperCase().split('-')[0])) {
                const storage = capacity.split('+')[0];
                return { code: upperCode, storage, type: 'عادي', company: detectCompany(upperCode) };
            }
        }
    }

    // 2) بحث مباشر في جدول الزجاجي (EMMC)
    for (const [size, codes] of Object.entries(EMMC_DB)) {
        for (const c of codes) {
            if (upperCode === c.toUpperCase() || upperCode.startsWith(c.toUpperCase().split('-')[0])) {
                return { code: upperCode, storage: size, type: 'زجاجي', company: detectCompany(upperCode) };
            }
        }
    }

    // 3) بحث في Micron
    for (const [size, codes] of Object.entries(MICRON_DB)) {
        for (const c of codes) {
            if (upperCode === c.toUpperCase()) {
                return { code: upperCode, storage: size, type: 'زجاجي', company: 'Micron' };
            }
        }
    }

    // 4) الاختصارات - Samsung EMMC (KLM/KLU)
    if (upperCode.startsWith('KLM') || upperCode.startsWith('KLU')) {
        const twoChars = upperCode.substring(4, 6);
        const emmcMap = { 'AG': '16', 'BG': '32', 'CG': '64', 'DG': '128', 'EG': '256', 'FG': '512' };
        if (emmcMap[twoChars]) {
            return { code: upperCode, storage: emmcMap[twoChars], type: 'زجاجي', company: 'Samsung' };
        }
    }

    // 5) الاختصارات - Samsung عادي (KM)
    if (upperCode.startsWith('KM') && !upperCode.startsWith('KLM') && !upperCode.startsWith('KLU')) {
        const match = upperCode.match(/([NEXDCHPGVFS])(?:000|100|200|600|700|800|900)/i);
        if (match) {
            const letterMap = { 'N': '8', 'E': '16', 'X': '32', 'D': '32', 'C': '64', 'H': '64', 'P': '64', 'G': '128', 'V': '128', 'F': '256', 'S': '256' };
            const letter = match[1].toUpperCase();
            if (letterMap[letter]) {
                return { code: upperCode, storage: letterMap[letter], type: 'عادي', company: 'Samsung' };
            }
        }
    }

    // 6) الاختصارات - SK Hynix عادي (H9TQ)
    if (upperCode.startsWith('H9TQ') || upperCode.startsWith('H9HP') || upperCode.startsWith('H9HQ')) {
        const numStr = upperCode.substring(4, 6);
        const hynixMap = { '17': '16', '18': '16', '19': '16', '26': '32', '27': '32', '52': '64', '53': '64', '16': '128', '21': '256', '22': '256' };
        if (hynixMap[numStr]) {
            return { code: upperCode, storage: hynixMap[numStr], type: 'عادي', company: 'SK Hynix' };
        }
    }

    // 7) الاختصارات - SK Hynix EMMC (H26/H28/HN8)
    if (upperCode.startsWith('H26M') || upperCode.startsWith('H28') || upperCode.startsWith('HN8') || upperCode.startsWith('HNST')) {
        const numStr = upperCode.startsWith('H26M') ? upperCode.substring(4, 6) : upperCode.substring(3, 5);
        const h26Map = { '54': '16', '52': '16', '64': '32', '62': '32', '74': '64', '78': '64', '88': '128', '87': '128', '8D': '128', '9Q': '256', '9X': '256' };
        if (h26Map[numStr]) {
            return { code: upperCode, storage: h26Map[numStr], type: 'زجاجي', company: 'SK Hynix' };
        }
    }

    // 8) الاختصارات - Toshiba (THG)
    if (upperCode.startsWith('THG')) {
        const twoChars = upperCode.substring(6, 8);
        const thgMap = { 'G7': '16', 'G8': '32', 'G9': '64', 'T0': '128', 'T1': '256', 'T2': '512' };
        if (thgMap[twoChars]) {
            return { code: upperCode, storage: thgMap[twoChars], type: 'زجاجي', company: 'Toshiba' };
        }
    }

    // 9) الاختصارات - SanDisk (SDIN)
    if (upperCode.startsWith('SDIN') || upperCode.startsWith('SDAD') || upperCode.startsWith('SDINE') || upperCode.startsWith('SDINF')) {
        const sizeMatch = upperCode.match(/(\d+)G/);
        if (sizeMatch) {
            return { code: upperCode, storage: sizeMatch[1], type: 'زجاجي', company: 'SanDisk' };
        }
    }

    // 10) الاختصارات - YMEC (الحرف الخامس)
    if (upperCode.startsWith('TY') || upperCode.startsWith('TYD') || upperCode.startsWith('TYE')) {
        const ymecMap = { '6': '32', '7': '64', '8': '128', '9': '256' };
        const ch = upperCode[4];
        if (ymecMap[ch]) {
            return { code: upperCode, storage: ymecMap[ch], type: 'عادي', company: 'YMEC' };
        }
    }

    return null; // لم يُعثر على الكود
}

function detectCompany(code) {
    const u = code.toUpperCase();
    if (u.startsWith('KLM') || u.startsWith('KLU') || u.startsWith('KM')) return 'Samsung';
    if (u.startsWith('H9') || u.startsWith('H26') || u.startsWith('H28') || u.startsWith('HN')) return 'SK Hynix';
    if (u.startsWith('THG')) return 'Toshiba';
    if (u.startsWith('SDIN') || u.startsWith('SDAD')) return 'SanDisk';
    if (u.startsWith('JW') || u.startsWith('JZ')) return 'Micron';
    if (u.startsWith('TY')) return 'YMEC';
    if (u.startsWith('08EMCP') || u.startsWith('16EMCP')) return 'UNIC';
    return 'Unknown';
}

// ═══════════════════════════════════════════════════════════════
// API Endpoint - المنطق الجديد
// ═══════════════════════════════════════════════════════════════

app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64, learnedCodes } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // ─────────────────────────────────────────────────────────
        // المرحلة 1: Gemini يقرأ الكود فقط من الصورة (سريع جداً)
        // ─────────────────────────────────────────────────────────
        const readPrompt = `أنت خبير في قراءة الأكواد المنقوشة على شرائح الذاكرة (IC chips) في الهواتف.

مهمتك الوحيدة: انظر للصورة وابحث عن شريحة الذاكرة الرئيسية.
- تجاهل تماماً: CPU / Snapdragon / Mediatek / GPU / أي شريحة غير الذاكرة
- ركز على شريحة الذاكرة فقط: Samsung (KM/KLM/KLU) / SK Hynix (H9/H26/H28) / Toshiba (THG) / SanDisk (SDIN) / Micron (JW/JZ) / YMEC (TY) / UNIC (08EMCP/16EMCP)

اقرأ الكود المنقوش على شريحة الذاكرة بدقة شديدة.
- لو Samsung KM: الكود الرئيسي + اللاحقة (مثل KMK7X000VM-B314)
- لو Samsung KLM/KLU: الكود الكامل + اللاحقة (مثل KLMAG4FE4B-B002)
- لو SK Hynix H9: الكود الكامل (مثل H9TQ17ADFTMCUR)
- لو Toshiba THG: الكود الكامل (مثل THGBMAG7A2JBAIR)
- لو SanDisk: الكود الكامل (مثل SDIN7DU2-16G)
- لو Micron JW/JZ: الكود فقط (مثل JZ144)

أرجع الكود فقط كنص خام بدون أي شرح. مثال: KLMAG4FE4B-B002`;

        const readResult = await model.generateContent({
            contents: [{ parts: [
                { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
                { text: readPrompt }
            ]}],
            generationConfig: { temperature: 0 }
        });

        const rawCode = readResult.response.text().replace(/```/g, '').trim().split('\n')[0].trim();
        console.log('Gemini read code:', rawCode);

        // ─────────────────────────────────────────────────────────
        // المرحلة 2: البحث في قواعد البيانات والاختصارات
        // ─────────────────────────────────────────────────────────

        // أولاً: تحقق من التصحيحات المتعلمة (corrected=true تأخذ أولوية قصوى)
        if (learnedCodes && learnedCodes.length > 0) {
            for (const item of learnedCodes) {
                if (item.corrected && rawCode.toUpperCase().includes(item.code.toUpperCase())) {
                    console.log('Found CORRECTED learned code (priority):', item.code);
                    return res.json({
                        code: rawCode,
                        storage: item.storage,
                        type: item.type === 'glass' ? 'زجاجي' : 'عادي',
                        company: detectCompany(rawCode)
                    });
                }
            }
        }

        // ثانياً: بحث في قواعد البيانات والاختصارات
        const dbResult = searchInDB(rawCode);
        if (dbResult) {
            console.log('Found in DB:', dbResult);
            return res.json(dbResult);
        }

        // ثالثاً: بحث في الأكواد المتعلمة غير المصححة
        if (learnedCodes && learnedCodes.length > 0) {
            for (const item of learnedCodes) {
                if (!item.corrected && rawCode.toUpperCase().includes(item.code.toUpperCase())) {
                    console.log('Found in learned codes (non-corrected):', item.code);
                    return res.json({
                        code: rawCode,
                        storage: item.storage,
                        type: item.type === 'glass' ? 'زجاجي' : 'عادي',
                        company: detectCompany(rawCode)
                    });
                }
            }
        }

        // ─────────────────────────────────────────────────────────
        // المرحلة 3: لم يُعثر عليه - Gemini يفكر ويحلل (نادر)
        // ─────────────────────────────────────────────────────────
        console.log('Not found in DB, asking Gemini to analyze...');

        const analyzePrompt = `أنت خبير في تصنيف شرائح الذاكرة.

الكود الذي قرأته من الصورة هو: "${rawCode}"

هذا الكود غير موجود في قاعدة البيانات. حلله بنفسك:
- إذا كان Samsung KLM/KLU: الحرفان في الموضع 5-6 → AG=16GB | BG=32GB | CG=64GB | DG=128GB | EG=256GB | FG=512GB → نوع: زجاجي
- إذا كان Samsung KM: الحرف قبل 000/100/200/600 → N=8 | E=16 | X=32 | D=32 | C=64 | H=64 | G=128 | V=128 | F=256 → نوع: عادي
- إذا كان SK Hynix H9TQ: الرقمان في الموضع 5-6 → 17/18=16GB | 26/27=32GB | 52/53=64GB | 16=128GB → نوع: عادي
- إذا كان Toshiba THG: الحرفان في الموضع 7-8 → G7=16 | G8=32 | G9=64 | T0=128 | T1=256 → نوع: زجاجي
- إذا كان SanDisk SDIN: المساحة مكتوبة صريحة في الكود → نوع: زجاجي
- إذا كان Micron JW/JZ: راجع حجمه من الصورة → نوع: زجاجي

أرجع JSON فقط:
{"code":"${rawCode}","storage":"المساحة بالأرقام فقط","type":"عادي أو زجاجي","company":"اسم الشركة"}`;

        const analyzeResult = await model.generateContent({
            contents: [{ parts: [{ text: analyzePrompt }]}],
            generationConfig: { temperature: 0 }
        });

        let analyzeText = analyzeResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        let parsed;
        try {
            parsed = JSON.parse(analyzeText);
        } catch(e1) {
            try {
                const jsonMatch = analyzeText.match(/\{[\s\S]*?"code"[\s\S]*?\}/);
                parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { code: rawCode, storage: '', type: '', company: '' };
            } catch(e2) {
                parsed = { code: rawCode, storage: '', type: '', company: '' };
            }
        }

        console.log('Gemini analysis result:', parsed);
        res.json(parsed);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// Chat API - شات ذكي مع Gemini
// ═══════════════════════════════════════════════════════════════

app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chatPrompt = `أنت مساعد ذكي متخصص في شرائح الذاكرة (Memory IC chips) للهواتف.
اسمك "مساعد البحراوي" وبتتكلم مصري.

معلومات عنك:
- بتساعد في تصنيف شرائح الذاكرة (عادي/زجاجي EMMC)
- بتعرف Samsung, SK Hynix, Toshiba, SanDisk, Micron, YMEC
- العادي = BGA (بيتلحم على البورد)
- الزجاجي = EMMC (بيتركب في سوكيت)

${context ? 'السياق الحالي:\n- آخر كود: ' + (context.code || 'مفيش') + '\n- آخر نتيجة: ' + (context.storage || '?') + 'GB ' + (context.type || '?') + '\n- الشركة: ' + (context.company || '?') : ''}

رسالة المستخدم: "${message}"

رد بإيجاز ووضوح بالمصري. لو سأل عن حاجة مش ليها علاقة بالذاكرة، رد عليه بلطف وارجعه للموضوع.`;

        const result = await model.generateContent({
            contents: [{ parts: [{ text: chatPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
        });

        const reply = result.response.text().trim();
        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error);
        res.json({ reply: '⚠️ مش قادر أرد دلوقتي - جرب تاني' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
