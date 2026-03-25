const express = require('express');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "AIzaSyAbHZibxNq1bPUVHxW8aa8GvPAsMgCyzgQ");

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

    // 10) الاختصارات - YMEC (زجاجي) - الحرف الخامس بعد YMEC مع دعم المرادفات
    if (upperCode.startsWith('YMEC') && upperCode.length >= 5) {
        const ymecChar = upperCode[4].toUpperCase();
        const ymecMap = {
            '6': '32', 'G': '32',
            '7': '64',
            '8': '128', 'B': '128',
            '9': '256'
        };
        if (ymecMap[ymecChar]) {
            return { code: upperCode, storage: ymecMap[ymecChar], type: 'زجاجي', company: 'YMEC' };
        }
    }

    // 11) بحث عام بالحرف + الرقم (لأي كود فيه حرف قبل رقم معروف)
    const generalMap = {'N':'8','E':'16','X':'32','D':'32','C':'64','H':'64','P':'64','G':'128','V':'128','F':'256','S':'256'};
    const generalMatch = upperCode.match(/([NEXDCHPGVFS])(000|100|200|600|700|800|900|6001|7001|8001|9001)/i);
    if (generalMatch && generalMap[generalMatch[1].toUpperCase()]) {
        return { code: upperCode, storage: generalMap[generalMatch[1].toUpperCase()], type: 'عادي', company: detectCompany(upperCode) };
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
    if (u.startsWith('YMEC') || u.startsWith('TY')) return 'YMEC';
    if (u.startsWith('08EMCP') || u.startsWith('16EMCP') || u.startsWith('16ENCP')) return 'UNIC';
    return 'Unknown';
}

// ═══════════════════════════════════════════════════════════════
// API Endpoint - المنطق الجديد
// ═══════════════════════════════════════════════════════════════

// كاش النتائج - ملف JSON دائم عشان ميتمسحش لو السيرفر اتعمله restart
const CACHE_FILE = path.join(__dirname, 'cache.json');
let resultCache = {};

// تحميل الكاش من الملف لما السيرفر يشتغل
try {
    if (fs.existsSync(CACHE_FILE)) {
        resultCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        console.log('تم تحميل الكاش:', Object.keys(resultCache).length, 'كود');
    }
} catch (e) {
    console.error('خطأ تحميل الكاش:', e.message);
    resultCache = {};
}

// حفظ الكاش في الملف (بيتعمل كل ما نضيف كود جديد)
function saveCache() {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(resultCache, null, 2), 'utf8');
    } catch (e) {
        console.error('خطأ حفظ الكاش:', e.message);
    }
}

function getCached(code) {
    if (!code) return null;
    const key = code.toUpperCase().trim();
    const entry = resultCache[key];
    if (entry) {
        console.log('من الكاش:', key);
        return entry;
    }
    return null;
}

function setCache(code, result) {
    if (!code || !result || !result.storage) return;
    const key = code.toUpperCase().trim();
    resultCache[key] = result;
    saveCache();
    console.log('اتحفظ في الكاش:', key, '- إجمالي:', Object.keys(resultCache).length);
}

// دالة البحث التقريبي - بتدور على أقرب كود شبيه مع وزن الأخطاء الشائعة
function fuzzySearchInDB(code) {
    if (!code || code.length < 4) return null;
    const upper = code.toUpperCase().trim();
    let bestMatch = null;
    let bestDist = 3; // أقصى فرق مسموح: 2

    // الأخطاء الشائعة في قراءة الشرائح - وزنها 0.3 بدل 1
    const COMMON_SWAPS = {
        'O': '0', '0': 'O',
        'I': '1', '1': 'I',
        'B': '8', '8': 'B',
        'S': '5', '5': 'S',
        'G': '6', '6': 'G',
        'Z': '2', '2': 'Z',
        'D': '0', 'Q': 'O'
    };

    function weightedDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        if (Math.abs(a.length - b.length) > 3) return 999; // فرق الطول كبير - مش نفس الكود
        
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b[i-1] === a[j-1]) {
                    matrix[i][j] = matrix[i-1][j-1];
                } else {
                    // لو خطأ شائع - وزنه 0.3 بس
                    const isCommon = COMMON_SWAPS[b[i-1]] === a[j-1] || COMMON_SWAPS[a[j-1]] === b[i-1];
                    const cost = isCommon ? 0.3 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i-1][j-1] + cost,  // استبدال
                        matrix[i][j-1] + 1,        // إضافة
                        matrix[i-1][j] + 1          // حذف
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    function searchIn(db, type) {
        for (const [capacity, codes] of Object.entries(db)) {
            for (const c of codes) {
                const dist = weightedDistance(upper, c.toUpperCase());
                if (dist > 0 && dist < bestDist) {
                    bestDist = dist;
                    const storage = type === 'عادي' ? capacity.split('+')[0] : capacity;
                    bestMatch = { code: c, storage, type, company: detectCompany(c), originalRead: code, distance: dist };
                }
            }
        }
    }

    // دور في كل الجداول
    searchIn(NORMAL_DB, 'عادي');
    searchIn(EMMC_DB, 'زجاجي');
    searchIn(MICRON_DB, 'زجاجي');
    return bestMatch;
}

app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64, learnedCodes } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // ═══════════════════════════════════════════════════════
        // المحاولة الأولى: سريعة (للصور الواضحة)
        // ═══════════════════════════════════════════════════════
        const fastPrompt = `أنت خبير في قراءة الأكواد المنقوشة على شرائح الذاكرة (Memory IC chips) في الهواتف.

تعليمات مهمة جداً:
- في الصورة بوردة هاتف عليها شرائح كتيرة
- أنا عايز شريحة الذاكرة بس! مش البروسيسور!
- شريحة الذاكرة هي الشريحة السوداء الكبيرة اللي مكتوب عليها كود بيبدأ بواحد من دول:
  * Samsung: KM أو KLM أو KLU
  * SK Hynix: H9 أو H26 أو H28
  * Toshiba: THG
  * SanDisk: SDIN
  * Micron: JW أو JZ
  * YMEC: YMEC أو TY
  * UNIC: 08EMCP أو 16EMCP

- تجاهل تماماً أي شريحة مكتوب عليها Snapdragon أو Qualcomm أو Mediatek أو MT أو SDM أو SM - دي شرائح CPU مش ذاكرة!
- تجاهل أي شريحة صغيرة أو مكتوب عليها PM أو WCD أو WCN - دي شرائح طاقة ووايفاي

اقرأ الكود المكتوب على شريحة الذاكرة بس وارجعه كنص خام بدون أي شرح.
لو مش شايف شريحة ذاكرة، ارجع كلمة: NOT_FOUND`;

        let rawCode = '';
        try {
            const readResult = await model.generateContent({
                contents: [{ parts: [
                    { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
                    { text: fastPrompt }
                ]}],
                generationConfig: { temperature: 0 }
            });
            rawCode = readResult.response.text().replace(/```/g, '').trim().split('\n')[0].trim();
            console.log('محاولة 1 (سريعة):', rawCode);
        } catch (fastErr) {
            console.error('محاولة 1 فشلت:', fastErr.message);
        }

        // لو المحاولة الأولى نجحت والكود صالح - دور في الجداول
        if (rawCode && rawCode !== 'NOT_FOUND' && rawCode.length >= 3) {
            const result = lookupCode(rawCode, learnedCodes);
            if (result) {
                // لو الـ step مش cache يبقى المحاولة السريعة هي اللي قرأته
                if (result.step !== 'cache') result.step = 'fast_' + result.step;
                return res.json(result);
            }
        }

        // ═══════════════════════════════════════════════════════
        // المحاولة التانية: بعناية شديدة (للصور الصعبة)
        // ═══════════════════════════════════════════════════════
        console.log('المحاولة الأولى ما نفعتش، بحاول بعناية...');

        const carefulPrompt = `أنت خبير متخصص في قراءة الأكواد المنقوشة على شرائح الذاكرة. الصورة ممكن تكون مش واضحة، فركز جداً.

خطواتك بالترتيب:
1. دور على الشريحة السوداء الكبيرة - دي شريحة الذاكرة
2. الشريحة دي عليها كتابة صغيرة بالليزر - اقرأها حرف حرف
3. الكود بيبدأ بواحد من دول:
   - Samsung: KM أو KLM أو KLU (أكثر شركة منتشرة)
   - SK Hynix: H9 أو H26 أو H28
   - Toshiba: THG
   - SanDisk: SDIN
   - Micron: JW أو JZ
   - YMEC: YMEC أو TY (شريحة صيني)
   - UNIC: 08EMCP أو 16EMCP

تحذيرات مهمة جداً:
- لا تقرأ شريحة البروسيسور (CPU)! البروسيسور مكتوب عليه Snapdragon أو Qualcomm أو Mediatek أو SDM أو SM أو MT
- لا تقرأ شرائح الطاقة (PM/WCD/WCN)
- الحرف O والرقم 0 بيتلخبطوا - في الأكواد غالباً بيكون رقم 0
- الحرف I والرقم 1 بيتلخبطوا - في الأكواد غالباً بيكون حرف I
- الحرف B والرقم 8 بيتلخبطوا

=== معلومات تفكيك الأكواد (مرجع خبرة) ===

Samsung KM (عادي BGA):
- الحرف اللي قبل 000/100/200/600/700/800/900 بيحدد المساحة: N=8GB, E=16GB, X/D=32GB, C/H/P=64GB, G/V=128GB, F/S=256GB
- M = فيه RAM / L = مفيش RAM
- RAM: S/2=1GB, 6=1.5GB, K/1/3=2GB, A/B/8=3GB, D/4=4GB, C/J=6-8GB
- اللاحقة: 100/600=EMMC 5.0-5.1, 700/800=UFS 2.1, 900=UFS 3.1

Samsung KLM (زجاجي EMMC):
- الحرف الخامس بيحدد المساحة: A=16GB, B=32GB, C=64GB, D=128GB, E=256GB, F=512GB
- M = EMMC

Samsung KLU (زجاجي UFS):
- الحرف الخامس بيحدد المساحة: 4=4GB, 8=8GB, A=16GB, B=32GB, C=64GB, D=128GB, E=256GB, F=512GB, G=1TB
- U = UFS
- اللاحقة: 3/4=EMMC, B/C=UFS 2.x, D/E=UFS 3.x

SK Hynix (عادي):
- H9 = EMCP (عادي BGA)
- الرقمان 5-6 بيحددوا المساحة: 17/18/19=16GB, 26/27=32GB, 52/53=64GB, 16=128GB, 21/22=256GB
- BGA: DP=153, TP=162, TQ=221/529, HP=254, HQ=254 UFS
- RAM: A4=512MB, A8=1GB, AB=2GB, AD=3GB, AC=4GB, AE=6GB

SK Hynix (زجاجي):
- H26 = EMMC (زجاجي)
- H28 = UFS (زجاجي)

Toshiba THG (زجاجي):
- الحرفان 7-8: G7=16GB, G8=32GB, G9=64GB, T0=128GB, T1=256GB, T2=512GB

YMEC (زجاجي):
- الحرف الخامس بعد YMEC: 6/G=32GB, 7=64GB, 8/B=128GB, 9=256GB

UNIC (زجاجي):
- 08EMCP = 8GB, 16EMCP = 16GB
- الرقم بعد EMCP: 05G=32GB, 06G=64GB, 07G=128GB
${rawCode ? '\nالمحاولة الأولى قرأت: "' + rawCode + '" بس ما لقيناهوش في الجداول. ممكن تكون قرأته غلط. حاول تقرأه تاني بدقة أكبر.' : ''}

ارجع الكود فقط كنص خام. لو مش شايف شريحة ذاكرة خالص، ارجع: NOT_FOUND`;

        let carefulCode = '';
        try {
            const carefulResult = await model.generateContent({
                contents: [{ parts: [
                    { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
                    { text: carefulPrompt }
                ]}],
                generationConfig: { temperature: 0.2 }
            });
            carefulCode = carefulResult.response.text().replace(/```/g, '').trim().split('\n')[0].trim();
            console.log('محاولة 2 (بعناية):', carefulCode);
        } catch (carefulErr) {
            console.error('محاولة 2 فشلت:', carefulErr.message);
        }

        // لو المحاولة التانية طلعت كود مختلف - دور بيه
        const finalCode = (carefulCode && carefulCode !== 'NOT_FOUND' && carefulCode.length >= 3) ? carefulCode : rawCode;
        if (finalCode && finalCode !== 'NOT_FOUND') {
            const result = lookupCode(finalCode, learnedCodes);
            if (result) {
                if (result.step !== 'cache') result.step = 'careful_' + result.step;
                return res.json(result);
            }

            // ═══ التصحيح الذكي: دور على أقرب كود شبيه ═══
            const fuzzy = fuzzySearchInDB(finalCode);
            if (fuzzy) {
                console.log('تصحيح ذكي: قرأت "' + finalCode + '" وأقرب كود "' + fuzzy.code + '" (فرق: ' + fuzzy.distance + ')');
                const fuzzyResult = {
                    code: fuzzy.code,
                    storage: fuzzy.storage,
                    type: fuzzy.type,
                    company: fuzzy.company,
                    suggestion: 'قرأته ' + finalCode + ' وأقرب كود ' + fuzzy.code,
                    step: 'fuzzy'
                };
                return res.json(fuzzyResult);
            }
        }

        // ═══ لو لسه مش لاقيه - Gemini يحلل بنفسه ═══
        const codeToAnalyze = finalCode || rawCode || 'UNKNOWN';
        console.log('مش في الجداول، Gemini بيحلل:', codeToAnalyze);

        const analyzePrompt = `أنت خبير في تصنيف شرائح الذاكرة.

الكود: "${codeToAnalyze}"
هذا الكود مش في قاعدة البيانات. حلله:
- Samsung KLM/KLU: الحرفان 5-6 → AG=16 | BG=32 | CG=64 | DG=128 | EG=256 | FG=512 → زجاجي
- Samsung KM: الحرف قبل 000/100/200/600 → N=8|E=16|X/D=32|C/H/P=64|G/V=128|F/S=256 → عادي
- SK Hynix H9TQ: الرقمان 5-6 → 17/18=16|26/27=32|52/53=64|16=128 → عادي
- Toshiba THG: الحرفان 7-8 → G7=16|G8=32|G9=64|T0=128|T1=256 → زجاجي
- SanDisk SDIN: المساحة مكتوبة صريحة → زجاجي
- Micron JW/JZ: زجاجي
- YMEC: الحرف الخامس بعد YMEC → 6/G=32|7=64|8/B=128|9=256 → زجاجي

أرجع JSON فقط:
{"code":"${codeToAnalyze}","storage":"رقم","type":"عادي أو زجاجي","company":"اسم"}`;

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
                parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { code: codeToAnalyze, storage: '', type: '', company: '' };
            } catch(e2) {
                parsed = { code: codeToAnalyze, storage: '', type: '', company: '' };
            }
        }

        parsed.step = 'gemini';
        console.log('Gemini حلل:', parsed);
        res.json(parsed);

    } catch (error) {
        const errText = (error.message || String(error)).toLowerCase();
        console.error("خطأ التحليل:", error.message || error);
        let errMsg = 'خطأ في التحليل';
        let step = 'failed';
        
        if (errText.includes('resource') && errText.includes('exhaust')) {
            // Resource exhausted = rate limit أو quota
            errMsg = 'طلبات كتير - استنى 10 ثواني وجرب تاني';
            step = 'no_credit';
        } else if (errText.includes('quota')) {
            errMsg = 'الرصيد خلص فعلاً - كلم المطور';
            step = 'no_credit';
        } else if (errText.includes('429') || errText.includes('rate')) {
            errMsg = 'طلبات كتير - استنى شوية وجرب تاني';
            step = 'no_credit';
        } else if (errText.includes('size') || errText.includes('too large') || errText.includes('payload')) {
            errMsg = 'الصورة كبيرة - صور أقرب';
        } else if (errText.includes('safety')) {
            errMsg = 'Gemini رفض الصورة - جرب صورة تانية';
        } else if (errText.includes('timeout') || errText.includes('deadline')) {
            errMsg = 'الوقت خلص - جرب تاني';
        } else {
            errMsg = 'خطأ: ' + (error.message || 'جرب تاني').substring(0, 100);
        }
        res.status(500).json({ error: errMsg, step });
    }
});

// دالة البحث الموحدة - بتدور في كل المصادر
function lookupCode(code, learnedCodes) {
    const cleanCode = code.replace(/[.,\s]+$/g, '').trim();
    const upperClean = cleanCode.toUpperCase();
    
    // شيك الكاش الأول
    const cached = getCached(cleanCode);
    if (cached) return { ...cached, step: cached.step || 'cache' };
    
    // 1. تصحيحات المستخدم (أعلى أولوية) - مطابقة دقيقة
    if (learnedCodes && learnedCodes.length > 0) {
        for (const item of learnedCodes) {
            if (item.corrected && item.code && item.code.length >= 4) {
                const itemUpper = item.code.toUpperCase();
                // مطابقة دقيقة: الكود المقروء يبدأ بالكود المتعلم أو العكس
                if (upperClean === itemUpper || upperClean.startsWith(itemUpper) || itemUpper.startsWith(upperClean)) {
                    console.log('لقيته في التصحيحات:', item.code);
                    const result = { code: cleanCode, storage: item.storage, type: item.type === 'glass' ? 'زجاجي' : 'عادي', company: detectCompany(cleanCode), step: 'correction' };
                    return result;
                }
            }
        }
    }
    
    // 2. الجداول والاختصارات
    const dbResult = searchInDB(cleanCode);
    if (dbResult) {
        console.log('لقيته في الجداول:', dbResult);
        dbResult.step = 'db';
        return dbResult;
    }
    
    // 3. الأكواد المتعلمة - مطابقة دقيقة
    if (learnedCodes && learnedCodes.length > 0) {
        for (const item of learnedCodes) {
            if (!item.corrected && item.code && item.code.length >= 4) {
                const itemUpper = item.code.toUpperCase();
                if (upperClean === itemUpper || upperClean.startsWith(itemUpper) || itemUpper.startsWith(upperClean)) {
                    console.log('لقيته في المتعلم:', item.code);
                    const result = { code: cleanCode, storage: item.storage, type: item.type === 'glass' ? 'زجاجي' : 'عادي', company: detectCompany(cleanCode), step: 'learned' };
                    return result;
                }
            }
        }
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════════════
// تأكيد النتيجة (صح) - يحفظ في الكاش
// ═══════════════════════════════════════════════════════════════

app.post('/api/confirm', (req, res) => {
    try {
        const { code, storage, type, company, step } = req.body;
        if (!code || !storage) return res.status(400).json({ error: 'مفيش كود أو مساحة' });
        
        const result = { code, storage, type, company, step, confirmed: true };
        setCache(code, result);
        console.log('✅ المستخدم أكد:', code, '=', storage + 'GB', type);
        res.json({ success: true, message: 'اتحفظ في الكاش' });
    } catch (error) {
        console.error('خطأ التأكيد:', error.message);
        res.status(500).json({ error: 'خطأ في الحفظ' });
    }
});

// ═══════════════════════════════════════════════════════════════
// تصحيح النتيجة (غلط) - يحفظ التصحيح + يسجل الخطأ
// ═══════════════════════════════════════════════════════════════

const ERROR_LOG_FILE = path.join(__dirname, 'error_log.json');
let errorLog = [];

// تحميل سجل الأخطاء
try {
    if (fs.existsSync(ERROR_LOG_FILE)) {
        errorLog = JSON.parse(fs.readFileSync(ERROR_LOG_FILE, 'utf8'));
        console.log('تم تحميل سجل الأخطاء:', errorLog.length, 'خطأ');
    }
} catch (e) {
    errorLog = [];
}

function saveErrorLog() {
    try {
        fs.writeFileSync(ERROR_LOG_FILE, JSON.stringify(errorLog, null, 2), 'utf8');
    } catch (e) {
        console.error('خطأ حفظ سجل الأخطاء:', e.message);
    }
}

app.post('/api/correct', (req, res) => {
    try {
        const { code, wrongResult, correctStorage, correctType, step } = req.body;
        if (!code || !correctStorage) return res.status(400).json({ error: 'مفيش كود أو تصحيح' });
        
        // حفظ النتيجة الصح في الكاش
        const correctResult = {
            code,
            storage: correctStorage,
            type: correctType || 'عادي',
            company: detectCompany(code),
            step: 'correction',
            confirmed: true
        };
        setCache(code, correctResult);
        
        // تسجيل الخطأ للمراجعة
        const errorEntry = {
            date: new Date().toISOString(),
            code,
            wrongResult: wrongResult || {},
            correctStorage,
            correctType: correctType || 'عادي',
            failedAtStep: step || 'unknown'
        };
        errorLog.push(errorEntry);
        saveErrorLog();
        
        console.log('❌ تصحيح:', code, '| كان:', JSON.stringify(wrongResult), '| الصح:', correctStorage + 'GB', correctType);
        res.json({ success: true, message: 'اتحفظ التصحيح واتسجل الخطأ' });
    } catch (error) {
        console.error('خطأ التصحيح:', error.message);
        res.status(500).json({ error: 'خطأ في الحفظ' });
    }
});

// ═══════════════════════════════════════════════════════════════
// عرض سجل الأخطاء (للمراجعة)
// ═══════════════════════════════════════════════════════════════

app.get('/api/errors', (req, res) => {
    res.json({ errors: errorLog, total: errorLog.length });
});

// ═══════════════════════════════════════════════════════════════
// Chat API - شات ذكي مع Gemini
// ═══════════════════════════════════════════════════════════════

app.post('/api/chat', async (req, res) => {
    try {
        const { message, context, history, learnedCodes } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // بناء ملخص الجداول لـ Gemini
        let dbSummary = 'جداول الأكواد العادية (BGA):\n';
        for (const [cap, codes] of Object.entries(NORMAL_DB)) {
            dbSummary += cap + ': ' + codes.slice(0, 5).join(', ') + (codes.length > 5 ? ' ... (و' + (codes.length - 5) + ' تاني)' : '') + '\n';
        }
        dbSummary += '\nجداول الزجاجي (EMMC):\n';
        for (const [cap, codes] of Object.entries(EMMC_DB)) {
            dbSummary += cap + 'GB: ' + codes.slice(0, 5).join(', ') + (codes.length > 5 ? ' ... (و' + (codes.length - 5) + ' تاني)' : '') + '\n';
        }

        // ملخص الاختصارات
        dbSummary += '\nاختصارات سامسونج (الحرف قبل الرقم): N=8, E=16, X/D=32, C/H/P=64, G/V=128, F/S=256\n';
        dbSummary += 'اختصارات YMEC (الحرف الخامس بعد YMEC): 6/G=32, 7=64, 8/B=128, 9=256 (زجاجي)\n';
        dbSummary += 'اختصارات UNIC: 05G=32, 06G=64, 07G=128 (زجاجي)\n';

        // ملخص التصحيحات
        let correctionsInfo = '';
        if (learnedCodes && learnedCodes.length > 0) {
            const corrected = learnedCodes.filter(c => c.corrected);
            if (corrected.length > 0) {
                correctionsInfo = '\nتصحيحات المستخدم (أعلى أولوية):\n';
                corrected.slice(-10).forEach(c => {
                    correctionsInfo += '- ' + c.code + ' = ' + c.storage + 'GB ' + (c.type === 'glass' ? 'زجاجي' : 'عادي') + '\n';
                });
            }
        }

        // تاريخ المحادثة
        let historyText = '';
        if (history && history.length > 0) {
            historyText = '\nتاريخ المحادثة:\n';
            history.slice(-10).forEach(h => {
                historyText += (h.role === 'user' ? 'المستخدم' : 'أنت') + ': ' + h.text + '\n';
            });
        }

        const chatPrompt = `أنت مساعد ذكي متخصص في شرائح الذاكرة (Memory IC chips) للهواتف.
اسمك "مساعد البحراوي" وبتتكلم مصري.

معلومات عنك:
- بتساعد في تصنيف شرائح الذاكرة (عادي BGA / زجاجي EMMC)
- بتعرف Samsung, SK Hynix, Toshiba, SanDisk, Micron, YMEC, UNIC
- العادي = BGA (بيتلحم على البورد)
- الزجاجي = EMMC (بيتركب في سوكيت)

${dbSummary}${correctionsInfo}

لما تصنف كود، لازم تقول عرفت منين:
- "من الجدول" لو لقيته في البيانات
- "من الاختصار" لو عرفته من نمط الحروف
- "من تصحيح المستخدم" لو المستخدم صححه قبل كده
- "تحليلي" لو حللته بنفسك

${context ? 'السياق الحالي:\n- آخر كود: ' + (context.code || 'مفيش') + '\n- آخر نتيجة: ' + (context.storage || '?') + 'GB ' + (context.type || '?') + '\n- الشركة: ' + (context.company || '?') : ''}${historyText}

رسالة المستخدم: "${message}"

رد بإيجاز ووضوح بالمصري. لو سأل عن حاجة مش ليها علاقة بالذاكرة، رد عليه بلطف وارجعه للموضوع.`;

        const result = await model.generateContent({
            contents: [{ parts: [{ text: chatPrompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
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
