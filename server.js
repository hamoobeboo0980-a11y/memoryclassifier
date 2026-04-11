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
// استخراج الرام من الكود
// ═══════════════════════════════════════════════════════════════

const SAMSUNG_RAM_MAP = {
    'S': '1', '2': '1', '6': '1.5',
    'K': '2', '1': '2', '3': '2',
    'A': '3', 'B': '3', '8': '3',
    'D': '4',
    '4': '6', 'C': '6',
    'J': '8', 'P': '8',
    'L': '10', 'M': '12'
};

const HYNIX_RAM_MAP = {
    'A4': '0.5', 'A8': '1', 'AB': '2', 'AD': '3', 'AC': '4', 'AE': '6'
};

function extractRam(code) {
    if (!code) return null;
    const upper = code.toUpperCase();

    // Samsung KM (عادي): الحرف قبل الأخير قبل الشرطة
    if (upper.startsWith('KM') && !upper.startsWith('KLM') && !upper.startsWith('KLU')) {
        const mainPart = upper.split('-')[0];
        if (mainPart.length >= 3) {
            const penultimate = mainPart[mainPart.length - 2];
            if (SAMSUNG_RAM_MAP[penultimate]) return SAMSUNG_RAM_MAP[penultimate];
        }
    }

    // SK Hynix H9 (عادي): الحرفان 8-9
    if (upper.startsWith('H9')) {
        // H9TQ17ABJTMCUR → الحرفان بعد الأرقام
        const match = upper.match(/H9[A-Z]{2}\d{2}([A-Z]{2})/);
        if (match && HYNIX_RAM_MAP[match[1]]) return HYNIX_RAM_MAP[match[1]];
    }

    return null;
}

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
                const parts = capacity.split('+');
                const storage = parts[0];
                let ram = parts.length > 1 ? parts[1].replace(/D[0-9]|正码|杂码|UMCP/g,'').trim() : null;
                if (!ram) ram = extractRam(upperCode);
                return { code: upperCode, storage, type: 'عادي', company: detectCompany(upperCode), ram };
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
                return { code: upperCode, storage: letterMap[letter], type: 'عادي', company: 'Samsung', ram: extractRam(upperCode) };
            }
        }
    }

    // 6) الاختصارات - SK Hynix عادي (H9TQ)
    if (upperCode.startsWith('H9TQ') || upperCode.startsWith('H9HP') || upperCode.startsWith('H9HQ')) {
        const numStr = upperCode.substring(4, 6);
        const hynixMap = { '17': '16', '18': '16', '19': '16', '26': '32', '27': '32', '52': '64', '53': '64', '16': '128', '21': '256', '22': '256' };
        if (hynixMap[numStr]) {
            return { code: upperCode, storage: hynixMap[numStr], type: 'عادي', company: 'SK Hynix', ram: extractRam(upperCode) };
        }
    }

    // 7a) الاختصارات - SK Hynix EMMC (H26/H28)
    if (upperCode.startsWith('H26M') || upperCode.startsWith('H28')) {
        const numStr = upperCode.startsWith('H26M') ? upperCode.substring(4, 6) : upperCode.substring(3, 5);
        const h26Map = { '54': '16', '52': '16', '64': '32', '62': '32', '74': '64', '78': '64', '88': '128', '87': '128', '8D': '128', '9Q': '256', '9X': '256' };
        if (h26Map[numStr]) {
            return { code: upperCode, storage: h26Map[numStr], type: 'زجاجي', company: 'SK Hynix' };
        }
    }

    // 7b) الاختصارات - SK Hynix EMMC (HNST/HN8T) - الحرف الخامس بيحدد المساحة
    if (upperCode.startsWith('HNST') || upperCode.startsWith('HN8T')) {
        const hnChar = upperCode[4];
        const hnMap = { '0': '128', 'O': '128', '1': '256', 'I': '256', '2': '512' };
        if (hnChar && hnMap[hnChar.toUpperCase()]) {
            return { code: upperCode, storage: hnMap[hnChar.toUpperCase()], type: 'زجاجي', company: 'SK Hynix' };
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
        return { code: upperCode, storage: generalMap[generalMatch[1].toUpperCase()], type: 'عادي', company: detectCompany(upperCode), ram: extractRam(upperCode) };
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

// ═══════════════════════════════════════════════════════════════
// كاش النتائج - JSONBin سحابي عشان ميتمسحش لو السيرفر اتعمله restart
// ═══════════════════════════════════════════════════════════════
const JBIN_MASTER = '$2a$10$J2Cn/5MK2uANpg4KJ85Na.3zUuauEK0fl5tP.2dPNreOFJLrTGfJ2';
const JBIN_CACHE_ID = '69c3b790b7ec241ddc9fc484'; // bin خاص بكاش السيرفر
let resultCache = {};
let cacheLoaded = false;
let savePending = false; // عشان نمنع الحفظ المتكرر
let saveTimer = null;

// تحميل الكاش من JSONBin لما السيرفر يشتغل
async function loadCacheFromCloud() {
    try {
        const res = await fetch('https://api.jsonbin.io/v3/b/' + JBIN_CACHE_ID + '/latest', {
            headers: { 'X-Master-Key': JBIN_MASTER }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        resultCache = (data.record && data.record.cache) ? data.record.cache : {};
        cacheLoaded = true;
        console.log('☁️ تم تحميل الكاش من السحابة:', Object.keys(resultCache).length, 'كود');
    } catch (e) {
        console.error('خطأ تحميل الكاش من السحابة:', e.message);
        // لو فشل - نحاول نحمل من الملف المحلي كـ fallback
        try {
            const CACHE_FILE = path.join(__dirname, 'cache.json');
            if (fs.existsSync(CACHE_FILE)) {
                resultCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
                console.log('📁 تم تحميل الكاش من الملف المحلي (fallback):', Object.keys(resultCache).length, 'كود');
            }
        } catch (e2) {
            console.error('خطأ تحميل الكاش المحلي:', e2.message);
        }
        resultCache = resultCache || {};
        cacheLoaded = true;
    }
}

// حفظ الكاش على JSONBin (مع debounce عشان ما نبعتش طلبات كتير)
function saveCache() {
    // حفظ محلي فوراً كـ backup
    try {
        const CACHE_FILE = path.join(__dirname, 'cache.json');
        fs.writeFileSync(CACHE_FILE, JSON.stringify(resultCache, null, 2), 'utf8');
    } catch (e) { /* مش مهم لو فشل */ }
    
    // Debounce - لو فيه حفظ معلق، أجّله 3 ثواني
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
        if (savePending) return; // لو فيه حفظ شغال، استنى
        savePending = true;
        try {
            const res = await fetch('https://api.jsonbin.io/v3/b/' + JBIN_CACHE_ID, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JBIN_MASTER
                },
                body: JSON.stringify({ cache: resultCache })
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            console.log('☁️ تم حفظ الكاش على السحابة:', Object.keys(resultCache).length, 'كود');
        } catch (e) {
            console.error('خطأ حفظ الكاش على السحابة:', e.message);
        }
        savePending = false;
    }, 3000); // 3 ثواني debounce
}

// تحميل الكاش عند بدء السيرفر
loadCacheFromCloud();

// ═══════════════════════════════════════════════════════════════
// 1. فلتر الأكواد - isValidMemoryCode
// ═══════════════════════════════════════════════════════════════
// دالة موحدة للتحقق من كود الذاكرة (دمج isValidMemoryCode + looksLikeMemoryCode)
function isValidMemoryCode(code) {
    if (!code || code.length < 3) return false;
    const u = code.toUpperCase().trim();
    // أكواد معروفة (Samsung, Hynix, Toshiba, SanDisk, Micron, YMEC, UNIC)
    if (/^(KM[A-Z0-9]|KL[MU]|H9[A-Z]|H2[68]|HN[S8]T|THG|SDI[NDA]|SDAD|YMEC|TY[A-Z0-9]|0[8]EM|16E[MN]|J[WZ][A-Z0-9]|PA[0-9])/.test(u)) return true;
    // أرقام بحتة 6+ أرقام (أكواد Micron)
    if (/^[0-9]{6,}$/.test(u)) return true;
    // أنماط مع شرطة (مثل 038-125BT)
    if (/^[0-9]{3}-[0-9]{2,3}[A-Z]{2}$/.test(u)) return true;
    // أكواد عامة: 8+ حروف وأرقام مختلطة بنسبة معقولة
    if (u.length >= 8 && /[A-Z]/.test(u) && /[0-9]/.test(u)) {
        const letters = (u.match(/[A-Z]/g) || []).length;
        const digits = (u.match(/[0-9]/g) || []).length;
        if (letters >= 2 && digits >= 2) return true;
    }
    return false;
}
// alias للتوافق مع الكود القديم
const looksLikeMemoryCode = isValidMemoryCode;

// ═══════════════════════════════════════════════════════════════
// 2. نظام التعلم بالتصويت - learnedPatterns
// ═══════════════════════════════════════════════════════════════
const JBIN_PATTERNS_ID = '69c3b790b7ec241ddc9fc485'; // bin خاص بالأنماط المتعلمة
let learnedPatterns = {};
// الشكل: { "KM5H8": { storage: "64", type: "عادي", votes: 3, ram: "4" } }

async function loadPatternsFromCloud() {
    try {
        const res = await fetch('https://api.jsonbin.io/v3/b/' + JBIN_PATTERNS_ID + '/latest', {
            headers: { 'X-Master-Key': JBIN_MASTER }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        learnedPatterns = (data.record && data.record.patterns) ? data.record.patterns : {};
        console.log('🧠 تم تحميل الأنماط المتعلمة:', Object.keys(learnedPatterns).length, 'نمط');
    } catch (e) {
        console.log('أنماط متعلمة: بدأنا من الصفر -', e.message);
        learnedPatterns = {};
    }
}

function savePatternsToCloud() {
    setTimeout(async () => {
        try {
            await fetch('https://api.jsonbin.io/v3/b/' + JBIN_PATTERNS_ID, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Master-Key': JBIN_MASTER },
                body: JSON.stringify({ patterns: learnedPatterns })
            });
            console.log('🧠 تم حفظ الأنماط المتعلمة:', Object.keys(learnedPatterns).length);
        } catch (e) {
            console.error('خطأ حفظ الأنماط:', e.message);
        }
    }, 2000);
}

function learnPattern(code, storage, type, ram) {
    if (!code || code.length < 4) return;
    // استخرج prefix (أول 10 حروف)
    const prefix = code.toUpperCase().substring(0, Math.min(10, code.length));
    if (!learnedPatterns[prefix]) {
        learnedPatterns[prefix] = { storage, type, ram, votes: 1 };
    } else {
        learnedPatterns[prefix].votes++;
        // لو التصويت الجديد مختلف والقديم عنده أصوات قليلة - حدّث
        if (learnedPatterns[prefix].storage !== storage && learnedPatterns[prefix].votes < 3) {
            learnedPatterns[prefix] = { storage, type, ram, votes: 1 };
        }
    }
    savePatternsToCloud();
}

loadPatternsFromCloud();

// ═══════════════════════════════════════════════════════════════
// 3. Cache Lookup Functions
// ═══════════════════════════════════════════════════════════════

function getCached(code) {
    if (!code) return null;
    const key = code.toUpperCase().trim();
    
    // 1. مطابقة دقيقة
    if (resultCache[key]) {
        console.log('من الكاش (دقيق):', key);
        return resultCache[key];
    }
    
    // 2. بدون شرطة وما بعدها
    const noDash = key.split('-')[0];
    if (noDash !== key && resultCache[noDash]) {
        console.log('من الكاش (بدون شرطة):', noDash);
        return resultCache[noDash];
    }
    
    // 3. بأول 10 حروف - عشان يجيب الرام صح
    if (key.length >= 10) {
        const prefix = key.substring(0, 10);
        for (const k of Object.keys(resultCache)) {
            if (k.length >= 10 && k.substring(0, 10) === prefix) {
                console.log('من الكاش (بأول 10):', k, 'لـ', key);
                return resultCache[k];
            }
        }
    }
    
    // 4. الكاش فيه الكود بشرطة والمطلوب بدون
    for (const k of Object.keys(resultCache)) {
        if (k.startsWith(noDash) || noDash.startsWith(k.split('-')[0])) {
            console.log('من الكاش (جزئي):', k, 'لـ', key);
            return resultCache[k];
        }
    }
    
    // 5. fuzzy - أخطاء شائعة (O/0, I/1, B/8, S/5, G/6, Z/2)
    if (noDash.length >= 6) {
        for (const k of Object.keys(resultCache)) {
            const kNoDash = k.split('-')[0];
            if (Math.abs(kNoDash.length - noDash.length) > 1) continue;
            let diff = 0;
            const len = Math.min(kNoDash.length, noDash.length);
            for (let i = 0; i < len; i++) {
                if (kNoDash[i] !== noDash[i]) {
                    diff++;
                    if (diff > 2) break;
                }
            }
            if (kNoDash.length !== noDash.length) diff++;
            if (diff <= 2) {
                console.log('من الكاش (fuzzy):', k, 'لـ', key, '- فرق:', diff);
                return resultCache[k];
            }
        }
    }
    
    return null;
}

function setCache(code, result) {
    if (!code || !result || !result.storage) return;
    const key = code.toUpperCase().trim();
    resultCache[key] = result;
    // حفظ بدون شرطة كمان عشان المطابقة تبقى أسرع
    const noDash = key.split('-')[0];
    if (noDash !== key) resultCache[noDash] = result;
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
                    const parts = capacity.split('+');
                    const storage = type === 'عادي' ? parts[0] : capacity;
                    let ram = (type === 'عادي' && parts.length > 1) ? parts[1].replace(/D[0-9]|正码|杂码|UMCP/g,'').trim() : null;
                    if (!ram) ram = extractRam(c);
                    bestMatch = { code: c, storage, type, company: detectCompany(c), originalRead: code, distance: dist, ram };
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

// ═══════════════════════════════════════════════════════════════
// Error Memory - ذاكرة أخطاء OCR الشائعة + أخطاء التصنيف
// ═══════════════════════════════════════════════════════════════
const JBIN_ERRMEM_ID = '69cc4ef0856a682189e95b90';
let errorMemory = Object.create(null);
// الشكل: { "B": "8", "O": "0" } = تصحيحات حرف بحرف
let wrongClassifications = Object.create(null);
// الشكل: { "KMXX": { wrongStorage: "64", correctStorage: "32", count: 2 } }
// يسجل أخطاء التصنيف المتكررة عشان نتجنبها

async function loadErrorMemory() {
    try {
        const res = await fetch('https://api.jsonbin.io/v3/b/' + JBIN_ERRMEM_ID + '/latest', {
            headers: { 'X-Master-Key': JBIN_MASTER }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const loadedMemory = (data.record && data.record.memory) ? data.record.memory : {};
        const loadedWrong = (data.record && data.record.wrongClassifications) ? data.record.wrongClassifications : {};
        // نسخ البيانات لـ null-prototype objects لمنع prototype pollution
        errorMemory = Object.create(null);
        Object.assign(errorMemory, loadedMemory);
        wrongClassifications = Object.create(null);
        Object.assign(wrongClassifications, loadedWrong);
        console.log('🧠 تم تحميل ذاكرة الأخطاء:', Object.keys(errorMemory).length, 'نمط OCR +', Object.keys(wrongClassifications).length, 'خطأ تصنيف');
    } catch (e) {
        console.log('ذاكرة أخطاء: بدأنا من الصفر -', e.message);
        errorMemory = Object.create(null);
        wrongClassifications = Object.create(null);
    }
}

function saveErrorMemory() {
    setTimeout(async () => {
        try {
            await fetch('https://api.jsonbin.io/v3/b/' + JBIN_ERRMEM_ID, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Master-Key': JBIN_MASTER },
                body: JSON.stringify({ memory: errorMemory, wrongClassifications: wrongClassifications })
            });
            console.log('🧠 تم حفظ ذاكرة الأخطاء:', Object.keys(errorMemory).length, 'OCR +', Object.keys(wrongClassifications).length, 'تصنيف');
        } catch (e) {
            console.error('خطأ حفظ ذاكرة الأخطاء:', e.message);
        }
    }, 2000);
}

loadErrorMemory();

// تصحيح كود باستخدام errorMemory
function applyErrorMemoryFixes(code) {
    if (!code || Object.keys(errorMemory).length === 0) return code;
    let fixed = code;
    for (const [wrong, right] of Object.entries(errorMemory)) {
        if (typeof right === 'string' && fixed.includes(wrong)) {
            fixed = fixed.replace(new RegExp(wrong.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'g'), right);
        }
    }
    if (fixed !== code) console.log('🧠 errorMemory صحح:', code, '→', fixed);
    return fixed;
}

// التحقق من أخطاء التصنيف السابقة - لو الكود ده اتصنف غلط قبل كده يتجنب نفس الغلطة
function checkWrongClassification(code, proposedStorage) {
    if (!code || !proposedStorage || Object.keys(wrongClassifications).length === 0) return null;
    const upper = code.toUpperCase().trim();
    const prefix = upper.substring(0, Math.min(10, upper.length));
    const entry = wrongClassifications[prefix] || wrongClassifications[upper];
    if (entry && entry.wrongStorage === proposedStorage) {
        console.log('⚠️ wrongClassifications: الكود', code, 'اتصنف', proposedStorage, 'قبل كده وكان غلط → الصح', entry.correctStorage);
        return entry.correctStorage;
    }
    return null;
}

// تعلم خطأ OCR جديد من التصحيح
function learnOCRError(wrongCode, correctCode) {
    if (!wrongCode || !correctCode || wrongCode === correctCode) return;
    const w = wrongCode.toUpperCase();
    const c = correctCode.toUpperCase();
    if (w.length !== c.length) return; // لازم نفس الطول
    for (let i = 0; i < w.length; i++) {
        if (w[i] !== c[i]) {
            const key = w[i] + c[i]; // مثلاً "B8" يعني OCR قرأ B والصح 8
            errorMemory[w[i]] = c[i];
            console.log('🧠 تعلم خطأ OCR:', w[i], '→', c[i]);
        }
    }
    saveErrorMemory();
}

// تعلم خطأ تصنيف من التصحيح
function learnWrongClassification(code, wrongStorage, correctStorage) {
    if (!code || !wrongStorage || !correctStorage || wrongStorage === correctStorage) return;
    const upper = code.toUpperCase().trim();
    const prefix = upper.substring(0, Math.min(10, upper.length));
    if (!wrongClassifications[prefix]) {
        wrongClassifications[prefix] = { wrongStorage, correctStorage, count: 1 };
    } else {
        wrongClassifications[prefix].count++;
        wrongClassifications[prefix].wrongStorage = wrongStorage;
        wrongClassifications[prefix].correctStorage = correctStorage;
    }
    console.log('🧠 تعلم خطأ تصنيف:', prefix, '| كان:', wrongStorage, '→ الصح:', correctStorage, '| مرات:', wrongClassifications[prefix].count);
    saveErrorMemory();
}

// ═══════════════════════════════════════════════════════════════
// /api/lookup - بحث سريع بالكود (بدون صورة، بدون Gemini)
// ═══════════════════════════════════════════════════════════════

app.post('/api/lookup', (req, res) => {
    try {
        const { code, learnedCodes, source } = req.body;
        if (!code || code.length < 3) return res.json({ found: false });
        
        const cleaned = cleanReadCode(code);
        const upper = cleaned.toUpperCase();
        const isTesseract = (source === 'tesseract');
        console.log('🔍 lookup:', code, '→ cleaned:', cleaned, isTesseract ? '(من Tesseract - بدون fuzzy)' : '');
        
        // === التحقق إن الكود يشبه كود ذاكرة حقيقي (لو من Tesseract) ===
        if (isTesseract && !looksLikeMemoryCode(cleaned)) {
            console.log('⚠️ Tesseract قرأ نص مش شبه كود ذاكرة:', cleaned);
            return res.json({ found: false, code: cleaned, reason: 'not_memory_code' });
        }
        
        // 1. جرب الكود كما هو (exact match + DB فقط - بدون fuzzy cache)
        let result = lookupCodeStrict(cleaned, learnedCodes);
        if (result) {
            result.source = result.step || 'lookup';
            return res.json({ found: true, ...result });
        }
        
        // 2. جرب بعد تصحيح errorMemory
        const fixed = applyErrorMemoryFixes(upper);
        if (fixed !== upper) {
            result = lookupCodeStrict(fixed, learnedCodes);
            if (result) {
                result.source = 'errorMemory_fix';
                result.suggestion = 'قرأته ' + cleaned + ' وصححته لـ ' + fixed;
                return res.json({ found: true, ...result });
            }
        }
        
        // 3. fuzzy search - بس لو مش من Tesseract
        if (!isTesseract) {
            const fuzzy = fuzzySearchInDB(cleaned);
            if (fuzzy) {
                return res.json({
                    found: true,
                    code: fuzzy.code,
                    storage: fuzzy.storage,
                    type: fuzzy.type,
                    company: fuzzy.company,
                    ram: fuzzy.ram || extractRam(fuzzy.code),
                    suggestion: 'قرأته ' + cleaned + ' وأقرب كود ' + fuzzy.code,
                    source: 'fuzzy',
                    step: 'lookup_fuzzy'
                });
            }
        }
        
        // 4. مش لاقيه
        return res.json({ found: false, code: cleaned });
    } catch (error) {
        console.error('lookup error:', error.message);
        return res.json({ found: false });
    }
});

// === التحقق إن الكود يشبه كود ذاكرة حقيقي ===
// looksLikeMemoryCode تم دمجها مع isValidMemoryCode أعلاه (alias موجود)

// ═══════════════════════════════════════════════════════════════
// البرومبت الموحد - برومنت واحد في مكان واحد لكل جيميناي
// ═══════════════════════════════════════════════════════════════
const UNIFIED_PROMPT = `أنت خبير في شرائح الذاكرة (Memory IC chips). بتتكلم مصري.
هذه صورة بورد موبايل عليها شرائح.

مهم جداً:

دور على ايسي الذاكرة (Memory IC) بس - الشرائح اللي بتبدأ بـ Samsung KM/KLM/KLU أو SK Hynix H9/H26/H28/HN8 أو Toshiba THG أو SanDisk SDIN أو Kingston أو YMEC أو UNIC أو Micron JW/JZ

تجاهل تماماً أي ايسي رام أو بروسيسور مكتوب عليه MediaTek أو Qualcomm أو Snapdragon أو SDM أو MT
-الكود المنقوش على ايسي الذاكرة نفسه لازم تقراه بعنايه عشان هتطلع منه بيانات الذاكرة والرام

ركز في الكود الي في وسط المربع الاول ولو الصورة من بعيد وفيها شرائح كتير، اختار ايسي الذاكرة الصح واقرا الكود المنقوش الي عليه بعنايه

لو الكود مش واضح قول بالظبط كل الحروف الي واضحه وعرفت تقراها من اعلى الايسي بدون تخاريف
كل جلسه تتفتح لابد تشوف امثله التفكيك مره واحده ويخزن الي فهمه منها في دماغه عشان هتفكك بيها اي صوره طول الجلسه
لو الكود واضح فككه ورد بالنتيجه علي طول في الشات والنتيجه
لوفشلت دور عليه في الخبره المتراكمه بعد كده الجداول

ودي اهم خبره عندك طريقه تفكيك كل الشركات
=== عادي (Normal BGA) ===
Company: Samsung (سامسونج) - Code prefix: KM (first 2 letters = company ID)
Storage location: LINE 3 of chip - the letter BEFORE the number 100/200/600/700/800/900
Storage codes: N=8G | E=16G | X or D=32G | C or H or P=64G | G or V=128G | F or S=256G
RAM codes (same line): S or 2=1GB | 6=1.5GB | K or 1 or 3=2GB | A or B or 8=3GB | D or 4=4GB | C or J=6-8GB

Company: SK Hynix (هاينكس) - Code prefix: H9 (first 2 letters = company ID)
Storage location: LINE 2 - the digits after the first 4 characters
Storage codes: 17/18/19=16G | 26/27=32G | 52/53=64G | 16=128G
RAM codes: A4=0.5GB | A8=1GB | AB=2GB | AD=3GB | AC=4GB | AE=6GB

Company: Kingston (كينجستون) - Origin: TAIWAN
Storage location: LINE 4 left side - storage written explicitly (e.g. 16EMCP08-N = 16G)

Company: SanDisk (سان ديسك) - Code prefix: SDIN - Origin: TAIWAN
Storage location: LINE 2 - storage written explicitly (e.g. SDINBDA4-64G = 64G)

=== زجاجي (eMMC/UFS) ===
Company: Samsung (سامسونج زجاجي) - Code prefix: KLM or KLU (first 3 letters = company ID)
Storage location: LINE 3 - the 5th character pair indicates storage
Storage codes: AG=16G | BG=32G | CG=64G | DG=128G | EG=256G | FG=512G

Company: SK Hynix (هاينكس زجاجي) - Code prefix: H26 or H28 or HN8
Storage location: LINE 1 - digits in the code
Storage codes: 54=16G | 64=32G | 74=64G | 88=128G | 9=256G

Company: Toshiba (توشيبا) - Code prefix: THG - Origin: TAIWAN/JAPAN
Storage location: LINE 3
Storage codes: G7=16G | G8=32G | G9=64G | T0=128G | T1=256G | T2=512G

Company: SanDisk (سان ديسك زجاجي) - Code prefix: SDIN - Origin: CHINA
Storage location: LINE 2 or 3 - storage written explicitly (e.g. SDINBDA4-64G = 64G)

Company: Micron (ميكرون) - Code prefix: JW or JZ
Storage: full code lookup from table - no abbreviations

Company: YMEC (يمك) - Code prefix: YMEC
Storage location: bottom-left of chip - digit after YMEC
Storage codes: YMEC6=32G | YMEC7=64G | YMEC8=128G | YMEC9=256G

Company: UNIC (يونيك) - Code prefix: 08EMCP or 16EMCP
Storage location: last line
Storage codes: 05G=32G | 06G=64G | 07G=128G

Company: Kingston (كينجستون زجاجي) - Origin: CHINA
Storage location: LINE 4 - storage explicit with EMMC (e.g. EMMC32G = 32G)

عينك تكون في الكاميرا ولسانك في الشات
إذا تم العثور على معلومات واضحة في الصورة، يقوم النظام بالرد عبر الدردشة بالنتائج المستخلصة (مثال: "النص المكتوب على IC الذاكرة هو: XYZ123").
إذا لم يتم العثور على معلومات واضحة أو كانت غير مكتملة، يقوم النظام بالإبلاغ عن ذلك (مثال: "لم أتمكن من قراءة النص بوضوح من الصورة.").
إعادة تحليل منطقة محددة (اختياري): يمكن للمستخدم طلب إعادة تحليل منطقة محددة في الصورة للحصول على دقة أعلى.
واوصف دايما انت شايف ايه

لما تصنف كود، قول عرفت منين
لو المستخدم بيعلمك حاجة جديدة، قوله "تم الحفظ ✅"
لو مش عارف كود، قوله بصراحة وساعده
طبّق القواعد المخصصة واختصارات المدرب - دي أعلى أولوية
لو المدرب بيعلمك اختصار، رد بـ [SHORTCUT]{"prefix":"الحروف","storage":"المساحة","type":"عادي أو زجاجي","company":"الشركة"}[/SHORTCUT]

لو بيعلمك معلومة جديدة:
[TRAIN]{"code":"الكود","storage":"المساحة","type":"النوع"}[/TRAIN]`;

// buildSinglePrompt - يستخدم البرومنت الموحد + الخبرة المتراكمة + JSON format
function buildSinglePrompt() {
    const expertKnowledge = buildExpertKnowledge();
    return `${UNIFIED_PROMPT}

${expertKnowledge}
Return JSON ONLY:
{"code":"THE_CODE","storage":"number","type":"عادي or زجاجي","company":"name","ram":"number or null","reason":"which line/rule you used e.g. Samsung KM line3 letter X before 800=32G"}
If you can see a chip but can only read partial text (even 1-2 chars): {"code":"WHAT_YOU_SEE","storage":"","type":"","company":"","ram":null,"reason":"what I can see on chip"}
If no memory chip found: {"code":"NOT_FOUND","reason":"why"}`;
}

// ═══════════════════════════════════════════════════════════════
// /api/analyze - v21: Single Gemini Call + RAG + Confidence Scoring
// Gemini يقرأ ويصنف في طلب واحد + DB lookup + RAG selector
// ═══════════════════════════════════════════════════════════════

app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64, learnedCodes } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // ═══════════════════════════════════════════════════════
        // SINGLE GEMINI CALL: قراءة + تصنيف في طلب واحد
        // نفس البرومبت الموحد للمسار الأصلي وعين Gemini
        // ═══════════════════════════════════════════════════════
        const singlePrompt = buildSinglePrompt();

        let rawCode = '';
        let geminiStorage = '';
        let geminiType = '';
        let geminiCompany = '';
        let geminiRam = null;
        let geminiReason = '';

        try {
            const geminiResult = await model.generateContent({
                contents: [{ parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    { text: singlePrompt }
                ]}],
                generationConfig: { temperature: 0 }
            });
            let geminiText = geminiResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            console.log('🧠 Gemini Single-Pass:', geminiText);
            
            let parsed = null;
            try {
                parsed = JSON.parse(geminiText);
            } catch(e1) {
                const jsonMatch = geminiText.match(/\{[\s\S]*?"code"[\s\S]*?\}/);
                parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
            }
            
            if (parsed && parsed.code) {
                rawCode = cleanReadCode(parsed.code);
                geminiStorage = parsed.storage || '';
                geminiType = parsed.type || '';
                geminiCompany = parsed.company || '';
                geminiRam = parsed.ram || null;
                geminiReason = parsed.reason || '';
            }
        } catch (geminiErr) {
            console.error('Gemini Single-Pass فشل:', geminiErr.message);
            throw geminiErr;
        }

        // ═══════════════════════════════════════════════════════
        // VALIDATION GATE: هل الكود صالح؟
        // ═══════════════════════════════════════════════════════
        if (rawCode && rawCode !== 'NOT_FOUND' && rawCode.length >= 3 && !isValidMemoryCode(rawCode)) {
            console.log('🚫 Validation Gate: كود مش صالح "' + rawCode + '"');
            rawCode = '';
        }

        if (!rawCode || rawCode === 'NOT_FOUND' || rawCode.length < 3) {
            const noResult = { code: 'NOT_FOUND', storage: '', type: '', company: '', ram: null, step: 'no_code', confidence: 0 };
            return res.json(noResult);
        }

        // ═══════════════════════════════════════════════════════
        // FAST DB LOOKUP: بحث سريع في الجداول (أسرع من Gemini وأدق)
        // ═══════════════════════════════════════════════════════
        
        // Exact match
        const dbResult = lookupCode(rawCode, learnedCodes);
        if (dbResult && dbResult.storage && dbResult.type) {
            dbResult.step = 'db_exact';
            dbResult.confidence = 95;
            console.log('✅ DB exact:', rawCode, '→', dbResult.storage + 'GB', dbResult.type);
            setCache(rawCode, dbResult);
            return res.json(dbResult);
        }
        
        // ErrorMemory fix
        const fixed = applyErrorMemoryFixes(rawCode.toUpperCase());
        if (fixed !== rawCode.toUpperCase()) {
            const fixedResult = lookupCode(fixed, learnedCodes);
            if (fixedResult && fixedResult.storage && fixedResult.type) {
                fixedResult.step = 'db_errorfix';
                fixedResult.confidence = 90;
                fixedResult.suggestion = 'قرأته ' + rawCode + ' وصححته لـ ' + fixed;
                console.log('✅ ErrorFix:', rawCode, '→', fixed);
                setCache(rawCode, fixedResult);
                return res.json(fixedResult);
            }
        }

        // Fuzzy match (distance < 1.5)
        const fuzzy = fuzzySearchInDB(rawCode);
        if (fuzzy && fuzzy.distance <= 1.5) {
            const fuzzyResult = {
                code: fuzzy.code, storage: fuzzy.storage, type: fuzzy.type,
                company: fuzzy.company, ram: fuzzy.ram || extractRam(fuzzy.code),
                suggestion: 'قرأته ' + rawCode + ' وأقرب كود ' + fuzzy.code,
                step: 'db_fuzzy', confidence: 85
            };
            console.log('✅ Fuzzy (dist=' + fuzzy.distance + '):', rawCode, '→', fuzzy.code);
            setCache(rawCode, fuzzyResult);
            return res.json(fuzzyResult);
        }

        // ═══════════════════════════════════════════════════════
        // RAG SELECTOR: لو DB ملقاش → Gemini يختار من candidates
        // (طلب Gemini تاني بس بدون صورة = أسرع بكتير)
        // ═══════════════════════════════════════════════════════
        const candidates = getCandidatesForCode(rawCode);
        
        if (candidates.length > 0) {
            const candidateList = candidates.map((c, i) => 
                (i+1) + '. ' + c.code + ' → ' + c.storage + 'GB ' + c.type + ' (' + c.company + ')'
            ).join('\n');
            
            const selectorPrompt = `You are a hardware memory chip classification expert.

I read this code from a chip image: "${rawCode}"

Here are the closest matches from our database:
${candidateList}

Your job:
1. Choose the BEST match (considering OCR misread corrections: O↔0, B↔8, S↔5, I↔1, G↔6, Z↔2)
2. If none match well, classify using the code structure rules.

Return JSON only:
{"code":"CORRECT_CODE","storage":"number","type":"عادي or زجاجي","company":"name","ram":"number or null","matched_from_list":true/false}`;

            try {
                const selectResult = await model.generateContent({
                    contents: [{ parts: [{ text: selectorPrompt }] }],
                    generationConfig: { temperature: 0 }
                });
                let selectText = selectResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                console.log('🎯 RAG Selector:', selectText);
                
                let selected = null;
                try {
                    selected = JSON.parse(selectText);
                } catch(e1) {
                    const jsonMatch = selectText.match(/\{[\s\S]*?"code"[\s\S]*?\}/);
                    selected = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
                }
                
                if (selected && selected.code && selected.storage && selected.type) {
                    if (!selected.ram) selected.ram = extractRam(selected.code);
                    if (!selected.company) selected.company = detectCompany(selected.code);
                    
                    let confidence = 60;
                    if (selected.matched_from_list === true) confidence = 85;
                    const verifyDB = lookupCode(selected.code, learnedCodes);
                    if (verifyDB) confidence = 92;
                    
                    if (selected.code && isValidMemoryCode(selected.code) && selected.storage && selected.type) {
                        selected.step = 'rag_selector';
                        selected.confidence = confidence;
                        selected.suggestion = 'قرأته ' + rawCode + (selected.code !== rawCode ? ' واختار ' + selected.code : '');
                        console.log('✅ RAG (conf=' + confidence + '):', selected);
                        setCache(rawCode, selected);
                        return res.json(selected);
                    }
                }
            } catch (selErr) {
                console.error('RAG Selector فشل:', selErr.message);
            }
        }

        // ═══════════════════════════════════════════════════════
        // GEMINI DIRECT: لو كل حاجة فشلت → ناخد تصنيف Gemini الأصلي
        // مع فحص أخطاء التصنيف السابقة
        // ═══════════════════════════════════════════════════════
        if (geminiStorage && geminiType) {
            // فحص: هل Gemini اقترح مساحة اتصنفت غلط قبل كده لنفس الكود؟
            let finalStorage = geminiStorage;
            const correctedStorage = checkWrongClassification(rawCode, geminiStorage);
            if (correctedStorage) {
                console.log('⚠️ Gemini Direct: wrongClassifications صحح', geminiStorage, '→', correctedStorage);
                finalStorage = correctedStorage;
            }
            const geminiDirect = {
                code: rawCode, storage: finalStorage, type: geminiType,
                company: geminiCompany || detectCompany(rawCode),
                ram: geminiRam || extractRam(rawCode),
                step: 'gemini_direct', confidence: correctedStorage ? 75 : 65,
                reason: geminiReason || ''
            };
            if (correctedStorage) {
                geminiDirect.suggestion = 'Gemini قال ' + geminiStorage + ' بس اتصحح لـ ' + correctedStorage + ' من أخطاء سابقة';
            }
            console.log('✅ Gemini Direct (conf=' + geminiDirect.confidence + '):', geminiDirect);
            setCache(rawCode, geminiDirect);
            return res.json(geminiDirect);
        }

        // ═══════════════════════════════════════════════════════
        // PARTIAL: كود بدون تصنيف
        // ═══════════════════════════════════════════════════════
        const finalResult = {
            code: rawCode, storage: '', type: '', company: detectCompany(rawCode),
            ram: null, step: 'partial', confidence: 30
        };
        console.log('⚠️ Partial:', finalResult);
        setCache(rawCode, finalResult);
        res.json(finalResult);

    } catch (error) {
        const errText = (error.message || String(error)).toLowerCase();
        console.error("خطأ التحليل:", error.message || error);
        let errMsg = 'خطأ في التحليل';
        let step = 'failed';
        
        if (errText.includes('resource') && errText.includes('exhaust')) {
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
        res.status(500).json({ error: errMsg, step, confidence: 0 });
    }
});

// ═══════════════════════════════════════════════════════════════
// /api/gemini-race - عين Gemini المستقلة (تصنيف بالصورة بس)
// بتشتغل بالتوازي مع المسار الأصلي عشان نقارن الدقة
// نفس البرومبت بالظبط - مقارنة عادلة
// ═══════════════════════════════════════════════════════════════
app.post('/api/gemini-race', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: 'No image', code: '', storage: '', type: '' });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // نفس البرومبت بالظبط الي في /api/analyze
        const racePrompt = buildSinglePrompt();

        const rawBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        const result = await model.generateContent({
            contents: [{ parts: [
                { inlineData: { mimeType: 'image/jpeg', data: rawBase64 } },
                { text: racePrompt }
            ]}],
            generationConfig: { temperature: 0 }
        });

        let text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        console.log('👁️ Gemini Race:', text);

        let parsed = null;
        try {
            parsed = JSON.parse(text);
        } catch(e1) {
            const jsonMatch = text.match(/\{[\s\S]*?"code"[\s\S]*?\}/);
            parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }

        if (parsed && parsed.code && parsed.code !== 'NOT_FOUND') {
            parsed.code = cleanReadCode(parsed.code);
            if (!parsed.ram) parsed.ram = extractRam(parsed.code);
            if (!parsed.company) parsed.company = detectCompany(parsed.code);

            // Verify against DB for confidence boost
            const dbCheck = lookupCode(parsed.code, []);
            if (dbCheck && dbCheck.storage) {
                parsed.storage = dbCheck.storage;
                parsed.type = dbCheck.type;
                parsed.company = dbCheck.company || parsed.company;
                parsed.confidence = 92;
                parsed.dbVerified = true;
            } else {
                parsed.confidence = parsed.storage && parsed.type ? 70 : 30;
                parsed.dbVerified = false;
            }

            return res.json(parsed);
        }

        return res.json({ code: 'NOT_FOUND', storage: '', type: '', company: '', confidence: 0 });
    } catch (error) {
        console.error('Gemini Race error:', error.message);
        return res.status(500).json({ error: error.message.substring(0, 100), code: '', storage: '', type: '' });
    }
});

// ═══════════════════════════════════════════════════════════════
// getCandidatesForCode - دالة داخلية لجلب candidates بدون HTTP
// ═══════════════════════════════════════════════════════════════
function getCandidatesForCode(code) {
    if (!code || code.length < 3) return [];
    const upper = code.toUpperCase().trim();
    const candidates = [];

    function addFrom(db, type) {
        for (const [capacity, codes] of Object.entries(db)) {
            for (const c of codes) {
                const cu = c.toUpperCase();
                const prefixLen = Math.min(upper.length, cu.length, 4);
                let commonPrefix = 0;
                for (let i = 0; i < prefixLen; i++) {
                    if (upper[i] === cu[i]) commonPrefix++;
                    else break;
                }
                if (commonPrefix >= 2 || (upper.length >= 4 && cu.includes(upper.substring(0, 4)))) {
                    const parts = capacity.split('+');
                    const storage = type === 'عادي' ? parts[0] : capacity;
                    let ram = (type === 'عادي' && parts.length > 1) ? parts[1].replace(/D[0-9]|正码|杂码|UMCP/g,'').trim() : null;
                    if (!ram) ram = extractRam(c);
                    candidates.push({ code: c, storage, type, company: detectCompany(c), ram, similarity: commonPrefix });
                }
            }
        }
    }

    addFrom(NORMAL_DB, 'عادي');
    addFrom(EMMC_DB, 'زجاجي');
    addFrom(MICRON_DB, 'زجاجي');
    candidates.sort((a, b) => b.similarity - a.similarity);
    return candidates.slice(0, 10);
}

// دالة البحث الموحدة - بتدور في كل المصادر
// تنظيف الكود المقروء - استخراج الكود الصح لو Gemini قرأ أكتر من سطر
function cleanReadCode(code) {
    if (!code) return code;
    let c = code.replace(/[.,\s]+$/g, '').trim();
    
    // Micron: لو فيه JZ أو JW في النص - جيب الجزء ده بس
    // مثال: "8LA92 JZ050" → "JZ050" أو "8LA92 JZG50" → "JZG50"
    const jMatch = c.match(/\b(J[ZW][A-Z0-9]{2,6})\b/i);
    if (jMatch) {
        console.log('تنظيف Micron:', c, '→', jMatch[1]);
        return jMatch[1].toUpperCase();
    }
    
    // Samsung/Hynix/Toshiba/SanDisk: لو فيه كود معروف في النص
    const knownMatch = c.match(/\b(KM[A-Z0-9]{6,}|KL[MU][A-Z0-9]{6,}|H9[A-Z0-9]{6,}|H2[68][A-Z0-9]{6,}|HNST[A-Z0-9]{4,}|HN8T[A-Z0-9]{4,}|THG[A-Z0-9]{6,}|SDIN[A-Z0-9]{4,}|SDAD[A-Z0-9]{4,}|YMEC[A-Z0-9]{4,}|TY[A-Z0-9]{6,}|(?:08|16)E[MN]CP[A-Z0-9]{2,})\b/i);
    if (knownMatch && knownMatch[1].length < c.length) {
        console.log('تنظيف كود:', c, '→', knownMatch[1]);
        return knownMatch[1].toUpperCase();
    }
    
    return c;
}

// === بحث صارم بدون fuzzy (للاستخدام مع Tesseract) ===
function lookupCodeStrict(code, learnedCodes) {
    const cleanCode = cleanReadCode(code);
    const upperClean = cleanCode.toUpperCase();
    
    // شيك الكاش - مطابقة دقيقة فقط (بدون fuzzy)
    const cached = getCachedStrict(cleanCode);
    if (cached) return { ...cached, step: cached.step || 'cache' };
    
    // 1. تصحيحات المستخدم (أعلى أولوية) - مطابقة دقيقة
    if (learnedCodes && learnedCodes.length > 0) {
        for (const item of learnedCodes) {
            if (item.corrected && item.code && item.code.length >= 4) {
                const itemUpper = item.code.toUpperCase();
                if (upperClean === itemUpper || upperClean.startsWith(itemUpper) || itemUpper.startsWith(upperClean)) {
                    const result = { code: cleanCode, storage: item.storage, type: item.type === 'glass' ? 'زجاجي' : 'عادي', company: detectCompany(cleanCode), ram: item.ram || extractRam(cleanCode), step: 'correction' };
                    return result;
                }
            }
        }
    }
    
    // 2. الجداول والاختصارات المبرمجة
    const dbResult = searchInDB(cleanCode);
    if (dbResult) {
        dbResult.step = 'db';
        return dbResult;
    }
    
    // 2.5 اختصارات المدرب (trained shortcuts) - مسار 2
    const shortcutResult = searchTrainedShortcuts(cleanCode);
    if (shortcutResult) {
        return shortcutResult;
    }
    
    // 3. الأكواد المتعلمة - مطابقة دقيقة
    if (learnedCodes && learnedCodes.length > 0) {
        for (const item of learnedCodes) {
            if (!item.corrected && item.code && item.code.length >= 4) {
                const itemUpper = item.code.toUpperCase();
                if (upperClean === itemUpper || upperClean.startsWith(itemUpper) || itemUpper.startsWith(upperClean)) {
                    const result = { code: cleanCode, storage: item.storage, type: item.type === 'glass' ? 'زجاجي' : 'عادي', company: detectCompany(cleanCode), ram: item.ram || extractRam(cleanCode), step: 'learned' };
                    return result;
                }
            }
        }
    }
    
    // 4. learnedPatterns
    if (Object.keys(learnedPatterns).length > 0) {
        const prefix = upperClean.substring(0, Math.min(10, upperClean.length));
        const match = learnedPatterns[prefix];
        if (match && match.votes >= 1) {
            return { code: cleanCode, storage: match.storage, type: match.type, company: detectCompany(cleanCode), ram: match.ram || extractRam(cleanCode), step: 'pattern' };
        }
    }
    
    return null;
}

// === كاش صارم - مطابقة دقيقة فقط (بدون fuzzy) ===
function getCachedStrict(code) {
    if (!code) return null;
    const key = code.toUpperCase().trim();
    
    // 1. مطابقة دقيقة
    if (resultCache[key]) {
        console.log('من الكاش (دقيق):', key);
        return resultCache[key];
    }
    
    // 2. بدون شرطة وما بعدها
    const noDash = key.split('-')[0];
    if (noDash !== key && resultCache[noDash]) {
        console.log('من الكاش (بدون شرطة):', noDash);
        return resultCache[noDash];
    }
    
    // 3. بأول 10 حروف - بس لو الكود طويل كفاية
    if (key.length >= 12) {
        const prefix = key.substring(0, 10);
        for (const k of Object.keys(resultCache)) {
            if (k.length >= 10 && k.substring(0, 10) === prefix) {
                console.log('من الكاش (بأول 10):', k, 'لـ', key);
                return resultCache[k];
            }
        }
    }
    
    // لا fuzzy هنا!
    return null;
}

function lookupCode(code, learnedCodes) {
    const cleanCode = cleanReadCode(code);
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
                    const result = { code: cleanCode, storage: item.storage, type: item.type === 'glass' ? 'زجاجي' : 'عادي', company: detectCompany(cleanCode), ram: item.ram || extractRam(cleanCode), step: 'correction' };
                    return result;
                }
            }
        }
    }
    
    // 2. الجداول والاختصارات المبرمجة
    const dbResult = searchInDB(cleanCode);
    if (dbResult) {
        console.log('لقيته في الجداول:', dbResult);
        dbResult.step = 'db';
        return dbResult;
    }
    
    // 2.5 اختصارات المدرب (trained shortcuts) - مسار 2
    const shortcutResult = searchTrainedShortcuts(cleanCode);
    if (shortcutResult) {
        console.log('🎯 لقيته في اختصارات المدرب:', shortcutResult.suggestion);
        return shortcutResult;
    }
    
    // 3. الأكواد المتعلمة - مطابقة دقيقة
    if (learnedCodes && learnedCodes.length > 0) {
        for (const item of learnedCodes) {
            if (!item.corrected && item.code && item.code.length >= 4) {
                const itemUpper = item.code.toUpperCase();
                if (upperClean === itemUpper || upperClean.startsWith(itemUpper) || itemUpper.startsWith(upperClean)) {
                    console.log('لقيته في المتعلم:', item.code);
                    const result = { code: cleanCode, storage: item.storage, type: item.type === 'glass' ? 'زجاجي' : 'عادي', company: detectCompany(cleanCode), ram: item.ram || extractRam(cleanCode), step: 'learned' };
                    return result;
                }
            }
        }
    }
    
    // 4. learnedPatterns fallback - الأنماط المتعلمة من التصويت (أول 10 حروف)
    if (Object.keys(learnedPatterns).length > 0) {
        const prefix = upperClean.substring(0, Math.min(10, upperClean.length));
        const match = learnedPatterns[prefix];
        if (match && match.votes >= 1) {
            console.log('🧠 لقيته في الأنماط المتعلمة:', prefix, 'أصوات:', match.votes);
            return { code: cleanCode, storage: match.storage, type: match.type, company: detectCompany(cleanCode), ram: match.ram || extractRam(cleanCode), step: 'pattern' };
        }
    }
    
    return null;
}

// ═══════════════════════════════════════════════════════════════
// تأكيد النتيجة (صح) - يحفظ في الكاش
// ═══════════════════════════════════════════════════════════════

app.post('/api/confirm', (req, res) => {
    try {
        const { code, storage, type, company, ram, step } = req.body;
        if (!code || !storage) return res.status(400).json({ error: 'مفيش كود أو مساحة' });
        
        const result = { code, storage, type, company, ram: ram || extractRam(code), step, confirmed: true };
        setCache(code, result);
        // 5. ربط confirm بنظام التعلم
        learnPattern(code, storage, type, ram || extractRam(code));
        console.log('✅ المستخدم أكد:', code, '=', storage + 'GB', type, ram ? 'RAM:' + ram : '');
        res.json({ success: true, message: 'اتحفظ في الكاش + اتعلم النمط' });
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
        const { code, wrongResult, correctStorage, correctType, correctRam, step } = req.body;
        if (!code || !correctStorage) return res.status(400).json({ error: 'مفيش كود أو تصحيح' });
        
        // حفظ النتيجة الصح في الكاش
        const correctResult = {
            code,
            storage: correctStorage,
            type: correctType || 'عادي',
            ram: correctRam || extractRam(code),
            company: detectCompany(code),
            step: 'correction',
            confirmed: true
        };
        setCache(code, correctResult);
        // 5. ربط correct بنظام التعلم
        learnPattern(code, correctStorage, correctType || 'عادي', correctRam || extractRam(code));
        
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
        
        // تعلم أخطاء OCR من التصحيح
        if (wrongResult && wrongResult.code && wrongResult.code !== code) {
            learnOCRError(wrongResult.code, code);
        }
        
        // تعلم أخطاء التصنيف (المساحة الغلط vs الصح)
        if (wrongResult && wrongResult.storage && wrongResult.storage !== correctStorage) {
            learnWrongClassification(code, wrongResult.storage, correctStorage);
        }
        
        console.log('❌ تصحيح:', code, '| كان:', JSON.stringify(wrongResult), '| الصح:', correctStorage + 'GB', correctType);
        res.json({ success: true, message: 'اتحفظ التصحيح واتسجل الخطأ + اتعلم الخطأ' });
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

app.get('/api/cache-count', (req, res) => {
    res.json({ count: Object.keys(resultCache).length });
});

// ═══════════════════════════════════════════════════════════════
// Chat API - شات ذكي محسّن مع Gemini + تدريب + عرض + مسح + قواعد
// ═══════════════════════════════════════════════════════════════

// قواعد مخصصة يعلمها المستخدم للنظام
const JBIN_RULES_ID = '69c71c29c3097a1dd56a4604'; // bin خاص بالقواعد المخصصة + الاختصارات المُدرَّبة
let customRules = [];
// الشكل: [{ rule: "لما تلاقي N11 في كود Kingston يبقى DDR3", addedAt: "2024-..." }]

// ═══════════════════════════════════════════════════════════════
// نظام الاختصارات المُدرَّبة (Trained Shortcuts) - مسار 2 للدقة
// يتعلم من المدرب عبر الشات ويُستخدم في التصنيف الفعلي
// ═══════════════════════════════════════════════════════════════
let trainedShortcuts = [];
// الشكل: [{ prefix: "KM5H", company: "Samsung", storage: "64", type: "عادي", ram: "4", note: "...", trainedBy: "trainer", date: "..." }]

// حماية البيانات - PIN المدرب
const TRAINER_PIN = process.env.TRAINER_PIN || '1234';
// pending delete operations awaiting PIN confirmation (expire after 60s)
let pendingDeletes = Object.create(null);

// تنظيف العمليات المعلقة القديمة (أكبر من 60 ثانية)
function cleanExpiredPendingDeletes() {
    const now = Date.now();
    for (const key of Object.keys(pendingDeletes)) {
        if (now - pendingDeletes[key].time > 60000) {
            delete pendingDeletes[key];
        }
    }
}

// استخراج base64 raw من data URI
function extractRawBase64(imageData) {
    if (!imageData) return '';
    return imageData.includes(',') ? imageData.split(',')[1] : imageData;
}

async function loadRulesFromCloud() {
    try {
        const res = await fetch('https://api.jsonbin.io/v3/b/' + JBIN_RULES_ID + '/latest', {
            headers: { 'X-Master-Key': JBIN_MASTER }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        customRules = (data.record && data.record.rules) ? data.record.rules : [];
        trainedShortcuts = (data.record && data.record.shortcuts) ? data.record.shortcuts : [];
        console.log('📚 تم تحميل القواعد المخصصة:', customRules.length, 'قاعدة +', trainedShortcuts.length, 'اختصار مُدرَّب');
    } catch (e) {
        console.log('قواعد مخصصة: بدأنا من الصفر -', e.message);
        customRules = [];
        trainedShortcuts = [];
    }
}

function saveRulesToCloud() {
    setTimeout(async () => {
        try {
            await fetch('https://api.jsonbin.io/v3/b/' + JBIN_RULES_ID, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Master-Key': JBIN_MASTER },
                body: JSON.stringify({ rules: customRules, shortcuts: trainedShortcuts })
            });
            console.log('📚 تم حفظ القواعد:', customRules.length, '+ اختصارات:', trainedShortcuts.length);
        } catch (e) {
            console.error('خطأ حفظ القواعد:', e.message);
        }
    }, 2000);
}

// إضافة اختصار مُدرَّب جديد
function addTrainedShortcut(data) {
    if (!data.prefix || data.prefix.length < 2 || !data.storage) return false;
    const upper = data.prefix.toUpperCase().trim();
    // تحديث لو موجود بالفعل (نفس prefix)
    const existIdx = trainedShortcuts.findIndex(s => s.prefix.toUpperCase() === upper);
    const entry = {
        prefix: upper,
        company: data.company || detectCompany(upper) || 'Unknown',
        storage: String(data.storage),
        type: data.type || 'عادي',
        ram: data.ram || null,
        note: data.note || '',
        trainedBy: 'trainer',
        date: new Date().toISOString()
    };
    if (existIdx >= 0) {
        trainedShortcuts[existIdx] = entry;
        console.log('🎯 تحديث اختصار مُدرَّب:', upper, '→', entry.storage + 'GB', entry.type);
    } else {
        trainedShortcuts.push(entry);
        console.log('🎯 اختصار مُدرَّب جديد:', upper, '→', entry.storage + 'GB', entry.type);
    }
    saveRulesToCloud();
    return true;
}

// البحث في الاختصارات المُدرَّبة (أطول prefix match يكسب)
function searchTrainedShortcuts(code) {
    if (!code || code.length < 2 || trainedShortcuts.length === 0) return null;
    const upper = code.toUpperCase().trim();
    let bestMatch = null;
    let bestLen = 0;
    for (const shortcut of trainedShortcuts) {
        const prefix = shortcut.prefix.toUpperCase();
        if (upper.startsWith(prefix) && prefix.length > bestLen) {
            bestMatch = shortcut;
            bestLen = prefix.length;
        }
    }
    if (bestMatch) {
        return {
            code: upper,
            storage: bestMatch.storage,
            type: bestMatch.type,
            company: bestMatch.company || detectCompany(upper),
            ram: bestMatch.ram || extractRam(upper),
            step: 'trained_shortcut',
            confidence: 90,
            suggestion: 'من اختصار المدرب: ' + bestMatch.prefix + '→' + bestMatch.storage + 'GB'
        };
    }
    return null;
}

// بناء ملخص الخبرة المتراكمة (للاستخدام في prompts)
function buildExpertKnowledge() {
    let knowledge = '';
    // اختصارات مُدرَّبة (أول 20)
    if (trainedShortcuts.length > 0) {
        knowledge += '\nAdditional trained shortcuts from expert:\n';
        trainedShortcuts.slice(0, 20).forEach(s => {
            knowledge += '- ' + s.prefix + '... → ' + s.storage + 'GB ' + s.company + ' ' + s.type + (s.ram ? ' RAM:' + s.ram : '') + '\n';
        });
    }
    // قواعد مخصصة (أول 10)
    if (customRules.length > 0) {
        knowledge += '\nCustom rules from trainer (ALWAYS apply):\n';
        customRules.slice(0, 10).forEach(r => {
            knowledge += '- ' + r.rule + '\n';
        });
    }
    // تحذيرات أخطاء التصنيف (أول 10)
    const wrongKeys = Object.keys(wrongClassifications);
    if (wrongKeys.length > 0) {
        knowledge += '\nWARNING - Known classification mistakes (AVOID repeating):\n';
        wrongKeys.slice(0, 10).forEach(k => {
            const w = wrongClassifications[k];
            knowledge += '- ' + k + ': was wrongly classified as ' + w.wrongStorage + 'GB → correct is ' + w.correctStorage + 'GB\n';
        });
    }
    return knowledge;
}

loadRulesFromCloud();

// ═══ دالة تحديد نية المستخدم من الرسالة ═══
function detectIntent(message) {
    // Truncate to prevent ReDoS on long inputs
    const arabic = message.trim().substring(0, 200);
    
    // نية: تأكيد PIN (أرقام فقط - 4 أرقام)
    if (/^\d{4}$/.test(arabic)) {
        return 'pin_confirm';
    }
    
    // نية: عرض المحفوظات
    if (/محفوظ|متعلم|اتعلم|كاش|cache|learned|saved/i.test(arabic) &&
        /وري|عرض|شوف|ايه|كام|عدد/i.test(arabic)) {
        return 'list';
    }
    if (/^(المحفوظات|المتعلمات|الكاش|وريني)$/i.test(arabic.replace(/\s+/g,''))) {
        return 'list';
    }
    
    // نية: مسح كود
    if (/امسح|شيل|احذف|delete|remove/i.test(arabic) && /كود|code/i.test(arabic)) {
        return 'delete';
    }
    if (/^(امسح|شيل|احذف)\s/i.test(arabic)) {
        return 'delete';
    }
    
    // نية: مسح كل الأنماط/الكاش
    if (/امسح|شيل|احذف|clear/i.test(arabic) && /كل|جميع|كلها|all|الأنماط|الكاش|patterns/i.test(arabic)) {
        return 'clear_patterns';
    }
    
    // نية: تعليم اختصار
    if (/اختصار|shortcut/i.test(arabic) && /يعني|يبقى|معناه|=/i.test(arabic)) {
        return 'teach_shortcut';
    }
    if (/^(علم|ضيف|add)\s+(اختصار|shortcut)/i.test(arabic)) {
        return 'teach_shortcut';
    }
    
    // نية: عرض الاختصارات
    if (/اختصار|shortcuts/i.test(arabic) && /وري|عرض|شوف/i.test(arabic)) {
        return 'list_shortcuts';
    }
    if (/^(الاختصارات|shortcuts)$/i.test(arabic.replace(/\s+/g,''))) {
        return 'list_shortcuts';
    }
    
    // نية: تحليل صورة (عين Gemini)
    if (/صور|شريح|image|photo/i.test(arabic) && /حلل|شوف|بص|اقرأ|اقرا/i.test(arabic)) {
        return 'analyze_image';
    }
    if (/وريه الصور/i.test(arabic)) {
        return 'analyze_image';
    }
    
    // نية: تعليم قاعدة
    if (/لما تلاقي|لو لقيت|القاعدة|اعرف ان|خلي بالك|تعلم ان|اتعلم ان|لو شفت|لما تشوف|في حالة/i.test(arabic)) {
        return 'teach_rule';
    }
    
    // نية: سؤال عن مصدر الأخطاء
    if (/ليه غلط|منين الغلط|مصدر الخطأ|ايه سبب|الأخطاء|سجل الأخطاء|error/i.test(arabic)) {
        return 'error_source';
    }
    
    // نية: سؤال عن مصدر الإجابة (منين عرفت؟)
    if (/منين عرفت|الاجابه دي منين|الاجابة دي منين|عرفت منين|ازاي عرفت|طلعت منين|جبت منين|المصدر|منين الكلام|من فين/i.test(arabic)) {
        return 'explain_source';
    }
    
    // نية: عرض القواعد
    if (/القواعد|rules/i.test(arabic)) {
        return 'list_rules';
    }
    
    // Default: محادثة عادية مع Gemini
    return 'chat';
}

// ═══ دالة البحث عن كود في كل المصادر مع تحديد المصدر ═══
function findCodeEverywhere(code, learnedCodes) {
    if (!code) return null;
    const upper = code.toUpperCase().trim();
    
    // 1. كاش النتائج
    const cached = getCached(code);
    if (cached) {
        return { ...cached, source: 'cache', sourceText: '📦 من الكاش - المعلومة دي محفوظة عندي من قبل' };
    }
    
    // 2. تصحيحات المستخدم
    if (learnedCodes && learnedCodes.length > 0) {
        for (const item of learnedCodes) {
            if (item.corrected && item.code && item.code.toUpperCase() === upper) {
                return {
                    code: upper, storage: item.storage,
                    type: item.type === 'glass' ? 'زجاجي' : 'عادي',
                    company: detectCompany(upper),
                    ram: item.ram || extractRam(upper),
                    source: 'correction',
                    sourceText: '🧠 من التدريب - دي حاجة علمتهالي قبل كده (تصحيح)'
                };
            }
        }
    }
    
    // 3. الجداول
    const dbResult = searchInDB(code);
    if (dbResult) {
        return { ...dbResult, source: 'db', sourceText: '📊 من الجدول - لقيته في قاعدة البيانات' };
    }
    
    // 3.5 اختصارات المدرب
    const shortcutResult = searchTrainedShortcuts(code);
    if (shortcutResult) {
        return { ...shortcutResult, source: 'trained_shortcut', sourceText: '🎯 من اختصار المدرب - ' + shortcutResult.suggestion };
    }
    
    // 4. الأكواد المتعلمة
    if (learnedCodes && learnedCodes.length > 0) {
        for (const item of learnedCodes) {
            if (!item.corrected && item.code && item.code.toUpperCase() === upper) {
                return {
                    code: upper, storage: item.storage,
                    type: item.type === 'glass' ? 'زجاجي' : 'عادي',
                    company: detectCompany(upper),
                    ram: item.ram || extractRam(upper),
                    source: 'learned',
                    sourceText: '🧠 من التدريب - دي حاجة اتعلمتها'
                };
            }
        }
    }
    
    // 5. الأنماط المتعلمة
    if (Object.keys(learnedPatterns).length > 0) {
        const prefix = upper.substring(0, Math.min(10, upper.length));
        const match = learnedPatterns[prefix];
        if (match && match.votes >= 1) {
            return {
                code: upper, storage: match.storage, type: match.type,
                company: detectCompany(upper),
                ram: match.ram || extractRam(upper),
                source: 'pattern',
                sourceText: '🔄 من الأنماط المتعلمة (أصوات: ' + match.votes + ')'
            };
        }
    }
    
    return null;
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message, context, history, learnedCodes, lastImage } = req.body;
        if (!message) return res.status(400).json({ error: "No message" });

        const intent = detectIntent(message);
        console.log('💬 شات - نية:', intent, '- رسالة:', message.substring(0, 80));

        // ═══ نية: تأكيد PIN (للحذف المحمي) ═══
        if (intent === 'pin_confirm') {
            cleanExpiredPendingDeletes();
            const pin = message.trim();
            // دور على أي pending delete لنفس الجلسة
            const pendingKeys = Object.keys(pendingDeletes);
            if (pendingKeys.length === 0) {
                return res.json({ reply: '❓ مفيش عملية حذف منتظرة PIN', source: 'system', action: 'no_pending' });
            }
            const lastPending = pendingKeys[pendingKeys.length - 1];
            const pending = pendingDeletes[lastPending];
            if (pin === TRAINER_PIN) {
                // PIN صح - نفذ الحذف
                let deleted = false;
                let deletedFrom = [];
                const codeToDelete = pending.code;
                if (pending.action === 'delete_code') {
                    if (resultCache[codeToDelete]) {
                        delete resultCache[codeToDelete];
                        saveCache();
                        deleted = true;
                        deletedFrom.push('الكاش');
                    }
                    const prefix = codeToDelete.substring(0, Math.min(10, codeToDelete.length));
                    if (learnedPatterns[prefix]) {
                        delete learnedPatterns[prefix];
                        savePatternsToCloud();
                        deleted = true;
                        deletedFrom.push('الأنماط المتعلمة');
                    }
                } else if (pending.action === 'clear_all') {
                    // مسح كل الأنماط
                    const patCount = Object.keys(learnedPatterns).length;
                    Object.keys(learnedPatterns).forEach(k => delete learnedPatterns[k]);
                    savePatternsToCloud();
                    deleted = true;
                    deletedFrom.push('كل الأنماط (' + patCount + ')');
                }
                delete pendingDeletes[lastPending];
                if (deleted) {
                    return res.json({ reply: '🔓✅ PIN صح - تم مسح ' + (pending.code || 'الأنماط') + ' من: ' + deletedFrom.join(' + '), source: 'system', action: 'deleted', deletedCode: pending.code });
                } else {
                    return res.json({ reply: '❓ ' + (pending.code || '') + ' مش موجود', source: 'system', action: 'not_found' });
                }
            } else {
                delete pendingDeletes[lastPending];
                return res.json({ reply: '🔒❌ PIN غلط - العملية اترفضت', source: 'system', action: 'pin_rejected' });
            }
        }

        // ═══ نية: عرض المحفوظات ═══
        if (intent === 'list') {
            const cacheCount = Object.keys(resultCache).length;
            const patternCount = Object.keys(learnedPatterns).length;
            const learnedCount = (learnedCodes && learnedCodes.length) || 0;
            const rulesCount = customRules.length;
            const shortcutsCount = trainedShortcuts.length;
            
            let reply = '📋 المحفوظات عندي:\n\n';
            reply += '📦 كاش النتائج: ' + cacheCount + ' كود\n';
            reply += '🧠 أكواد متعلمة (من التدريب): ' + learnedCount + ' كود\n';
            reply += '🔄 أنماط متعلمة (من التصويت): ' + patternCount + ' نمط\n';
            reply += '📚 قواعد مخصصة: ' + rulesCount + ' قاعدة\n';
            reply += '🎯 اختصارات المدرب: ' + shortcutsCount + ' اختصار\n\n';
            
            // عرض آخر 10 أكواد من الكاش
            const cacheKeys = Object.keys(resultCache).slice(-10);
            if (cacheKeys.length > 0) {
                reply += '📦 آخر أكواد في الكاش:\n';
                cacheKeys.forEach(k => {
                    const v = resultCache[k];
                    reply += '- ' + k + ' → ' + (v.storage || '?') + 'GB ' + (v.type || '?') + '\n';
                });
            }
            
            // عرض آخر 10 أكواد متعلمة
            if (learnedCodes && learnedCodes.length > 0) {
                reply += '\n🧠 آخر أكواد متعلمة:\n';
                learnedCodes.slice(-10).forEach(c => {
                    reply += '- ' + c.code + ' → ' + (c.storage || '?') + 'GB ' + (c.type === 'glass' ? 'زجاجي' : 'عادي') + (c.corrected ? ' (تصحيح)' : '') + '\n';
                });
            }
            
            return res.json({ reply, source: 'system', action: 'list' });
        }

        // ═══ نية: مسح كود (محمي بـ PIN) ═══
        if (intent === 'delete') {
            // استخراج الكود من الرسالة
            const words = message.trim().split(/\s+/);
            let codeToDelete = null;
            for (const w of words) {
                const clean = w.replace(/[.,;:!?]{1,5}$/g, '').trim();
                if (clean.length >= 4 && /[A-Z0-9]/i.test(clean)) {
                    // تجاهل الكلمات العربية
                    if (!/^[\u0600-\u06FF]+$/.test(clean)) {
                        codeToDelete = clean.toUpperCase();
                    }
                }
            }
            
            if (!codeToDelete) {
                return res.json({ reply: '❓ قولي الكود الي عايز تمسحه - مثلاً: "امسح الكود KVR16N11"', source: 'system', action: 'delete_ask' });
            }
            
            // حفظ العملية المعلقة وطلب PIN
            const pendingKey = 'del_' + Date.now();
            pendingDeletes[pendingKey] = { code: codeToDelete, action: 'delete_code', time: Date.now() };
            return res.json({
                reply: '🔒 عملية حذف ' + codeToDelete + '\n⚠️ اكتب PIN المدرب (4 أرقام) للتأكيد:',
                source: 'system', action: 'pin_required'
            });
        }

        // ═══ نية: مسح كل الأنماط (محمي بـ PIN) ═══
        if (intent === 'clear_patterns') {
            const pendingKey = 'clear_' + Date.now();
            pendingDeletes[pendingKey] = { code: null, action: 'clear_all', time: Date.now() };
            return res.json({
                reply: '🔒 عملية مسح كل الأنماط المتعلمة (' + Object.keys(learnedPatterns).length + ' نمط)\n⚠️ اكتب PIN المدرب (4 أرقام) للتأكيد:',
                source: 'system', action: 'pin_required'
            });
        }

        // ═══ نية: تعليم اختصار جديد ═══
        if (intent === 'teach_shortcut') {
            // استخراج: "الاختصار KM5H يعني 64 سامسونج عادي"
            const codeMatch = message.match(/([A-Z0-9]{2,})/i);
            const sizeMatch = message.match(/(\d+)\s*(جيجا|GB|gb|G|g)?/i);
            
            if (!codeMatch || !sizeMatch) {
                return res.json({
                    reply: '❓ مفهمتش الاختصار - قولي بالشكل ده:\n"الاختصار KM5H يعني 64 سامسونج عادي"\nأو: "اختصار JZ1 يبقى 128 زجاجي"',
                    source: 'system', action: 'teach_shortcut_ask'
                });
            }
            
            const isGlass = /زجاجي|glass|emmc|ufs/i.test(message);
            const companyMatch = message.match(/(سامسونج|samsung|هاينكس|hynix|توشيبا|toshiba|سانديسك|sandisk|ميكرون|micron|ymec|unic)/i);
            let company = '';
            if (companyMatch) {
                const c = companyMatch[1].toLowerCase();
                if (c.includes('سامسونج') || c.includes('samsung')) company = 'Samsung';
                else if (c.includes('هاينكس') || c.includes('hynix')) company = 'SK Hynix';
                else if (c.includes('توشيبا') || c.includes('toshiba')) company = 'Toshiba';
                else if (c.includes('سانديسك') || c.includes('sandisk')) company = 'SanDisk';
                else if (c.includes('ميكرون') || c.includes('micron')) company = 'Micron';
                else company = companyMatch[1];
            }
            
            // استخراج الرام لو موجود (fixed non-backtracking regex)
            const ramMatch = message.match(/ram\s{0,3}[:=]?\s{0,3}(\d+)/i) || message.match(/رام\s{0,3}[:=]?\s{0,3}(\d+)/i);
            
            const success = addTrainedShortcut({
                prefix: codeMatch[1].toUpperCase(),
                storage: sizeMatch[1],
                type: isGlass ? 'زجاجي' : 'عادي',
                company: company,
                ram: ramMatch ? ramMatch[1] : null,
                note: message.trim().substring(0, 100)
            });
            
            if (success) {
                return res.json({
                    reply: '🎯 تم حفظ الاختصار! ✅\n' + codeMatch[1].toUpperCase() + ' → ' + sizeMatch[1] + 'GB ' + (isGlass ? 'زجاجي' : 'عادي') + (company ? ' ' + company : '') + '\n\n✅ تم الحفظ على السحابة\nعدد الاختصارات: ' + trainedShortcuts.length,
                    source: 'system', action: 'shortcut_saved'
                });
            } else {
                return res.json({ reply: '❌ مقدرتش أحفظ - تأكد إن الكود أكبر من حرفين والمساحة رقم', source: 'system', action: 'error' });
            }
        }

        // ═══ نية: عرض الاختصارات ═══
        if (intent === 'list_shortcuts') {
            if (trainedShortcuts.length === 0) {
                return res.json({
                    reply: '🎯 مفيش اختصارات مُدرَّبة لحد دلوقتي.\nعلمني اختصار جديد - مثلاً: "الاختصار KM5H يعني 64 سامسونج عادي"',
                    source: 'system', action: 'list_shortcuts'
                });
            }
            let reply = '🎯 اختصارات المدرب (' + trainedShortcuts.length + ' اختصار):\n\n';
            trainedShortcuts.forEach((s, i) => {
                reply += (i + 1) + '. ' + s.prefix + ' → ' + s.storage + 'GB ' + s.type + (s.company ? ' (' + s.company + ')' : '') + (s.ram ? ' RAM:' + s.ram : '') + '\n';
            });
            return res.json({ reply, source: 'system', action: 'list_shortcuts' });
        }

        // ═══ نية: تحليل صورة (عين Gemini) ═══
        if (intent === 'analyze_image') {
            if (!lastImage) {
                return res.json({
                    reply: '📷 مفيش صورة متاحة دلوقتي.\nصوّر الشريحة الأول وبعدين قولي "شوف الصورة" أو "حلل الصورة دي"',
                    source: 'system', action: 'no_image'
                });
            }
            // ابعت الصورة لـ Gemini للتحليل
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const imagePrompt = `${UNIFIED_PROMPT}

${buildExpertKnowledge()}

رد بالمصري بوضوح.`;
                
                const rawBase64 = extractRawBase64(lastImage);
                const imgResult = await model.generateContent({
                    contents: [{ parts: [
                        { inlineData: { data: rawBase64, mimeType: 'image/jpeg' } },
                        { text: imagePrompt }
                    ]}],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
                });
                const imgReply = imgResult.response.text().trim();
                return res.json({ reply: '👁️ شايف الصورة:\n\n' + imgReply, source: 'gemini_vision', action: 'image_analyzed' });
            } catch (imgErr) {
                console.error('عين Gemini فشلت:', imgErr.message);
                return res.json({ reply: '⚠️ مقدرتش أحلل الصورة - ' + imgErr.message.substring(0, 60), source: 'error', action: 'error' });
            }
        }

        // ═══ نية: تعليم قاعدة ═══
        if (intent === 'teach_rule') {
            const newRule = {
                rule: message.trim(),
                addedAt: new Date().toISOString()
            };
            customRules.push(newRule);
            saveRulesToCloud();
            
            // كمان علّم الأنماط لو فيه كود ومساحة
            const sizeMatch = message.match(/(\d+)\s*(جيجا|GB|gb|G|g)?/i);
            const codeMatch = message.match(/([A-Z0-9]{4,})/i);
            if (sizeMatch && codeMatch) {
                learnPattern(codeMatch[1], sizeMatch[1], message.includes('زجاجي') || message.includes('glass') ? 'زجاجي' : 'عادي', null);
            }
            
            return res.json({
                reply: '📚 تم حفظ القاعدة! ✅\n"' + message.trim().substring(0, 100) + '"\n\n✅ تم الحفظ على السحابة - مش هنساها أبداً\nعدد القواعد: ' + customRules.length,
                source: 'system', action: 'rule_saved'
            });
        }

        // ═══ نية: مصدر الأخطاء ═══
        if (intent === 'error_source') {
            let reply = '📊 تحليل الأخطاء:\n\n';
            
            if (errorLog.length === 0) {
                reply += 'مفيش أخطاء مسجلة لحد دلوقتي ✅';
            } else {
                // تحليل مصادر الأخطاء
                const sources = {};
                errorLog.forEach(e => {
                    const step = e.failedAtStep || 'unknown';
                    sources[step] = (sources[step] || 0) + 1;
                });
                
                reply += 'إجمالي الأخطاء: ' + errorLog.length + '\n\n';
                reply += 'مصادر الأخطاء:\n';
                for (const [step, count] of Object.entries(sources)) {
                    let stepName = step;
                    if (step === 'step0_fuzzy' || step === 'fuzzy') stepName = '🔍 OCR + تصحيح تقريبي';
                    else if (step === 'gemini') stepName = '🤖 Gemini حلل غلط';
                    else if (step === 'db') stepName = '📊 الجدول (نادر)';
                    else if (step === 'cache') stepName = '📦 الكاش (كان فيه غلط)';
                    else if (step === 'correction') stepName = '🧠 تصحيح سابق غلط';
                    else if (step === 'pattern') stepName = '🔄 نمط متعلم غلط';
                    else stepName = '❓ ' + step;
                    reply += '- ' + stepName + ': ' + count + ' مرة\n';
                }
                
                // آخر 5 أخطاء
                reply += '\nآخر 5 أخطاء:\n';
                errorLog.slice(-5).forEach(e => {
                    reply += '- ' + e.code + ': كان ' + JSON.stringify(e.wrongResult).substring(0, 50) + ' → الصح ' + e.correctStorage + 'GB ' + (e.correctType || '') + '\n';
                });
            }
            
            return res.json({ reply, source: 'system', action: 'error_analysis' });
        }

        // ═══ نية: شرح مصدر الإجابة (منين عرفت) ═══
        if (intent === 'explain_source') {
            // خد آخر كود من السياق
            const lastCode = context && context.code ? context.code : null;
            if (!lastCode) {
                return res.json({ reply: '❓ مفيش نتيجة سابقة أشرحلك منين جيتها.\nصور شريحة الأول أو ابعتلي كود أحلله.', source: 'system', action: 'no_context' });
            }
            
            // دور على الكود في كل المصادر
            const sourceResult = findCodeEverywhere(lastCode, learnedCodes);
            
            if (sourceResult) {
                // شرح تفصيلي بناءً على المصدر
                let explanation = '🔍 آخر كود: ' + lastCode + '\n\n';
                const stepMap = {
                    'cache': '📦 الكاش - النتيجة دي محفوظة من تحليل سابق',
                    'correction': '🧠 تصحيح المدرب - أنت علمتني الكود ده قبل كده وصححتلي',
                    'db': '📊 الجدول الأساسي - لقيته في قاعدة البيانات (NORMAL_DB أو EMMC_DB أو MICRON_DB)',
                    'trained_shortcut': '🎯 اختصار المدرب - أنت علمتني اختصار بيبدأ بالحروف دي',
                    'learned': '🧠 متعلم - دي حاجة اتعلمتها من تدريب سابق',
                    'pattern': '🔄 نمط متعلم - لقيت نمط شبهه اتعلمته قبل كده'
                };
                explanation += '📌 المصدر: ' + (stepMap[sourceResult.source] || sourceResult.sourceText || 'تحليلي') + '\n';
                explanation += '📋 النتيجة: ' + (sourceResult.storage || '?') + 'GB ' + (sourceResult.type || '?');
                if (sourceResult.ram) explanation += ' | RAM ' + sourceResult.ram + 'GB';
                if (sourceResult.company) explanation += ' | ' + sourceResult.company;
                explanation += '\n\n';
                
                // شرح إضافي عن القاعدة المستخدمة
                const company = (sourceResult.company || detectCompany(lastCode) || '').toLowerCase();
                if (company.includes('samsung') && lastCode.startsWith('KM')) {
                    explanation += '📖 القاعدة: Samsung KM (عادي) - السطر 3 - الحرف قبل 100/200/600/700/800/900\nN=8|E=16|X/D=32|C/H/P=64|G/V=128|F/S=256';
                } else if (company.includes('samsung') && (lastCode.startsWith('KLM') || lastCode.startsWith('KLU'))) {
                    explanation += '📖 القاعدة: Samsung KLM/KLU (زجاجي) - السطر 3\nAG=16|BG=32|CG=64|DG=128|EG=256|FG=512';
                } else if (company.includes('hynix') && lastCode.startsWith('H9')) {
                    explanation += '📖 القاعدة: SK Hynix H9 (عادي) - السطر 2 - الرقم بعد أول 4 حروف\n17/18/19=16|26/27=32|52/53=64|16=128';
                } else if (company.includes('hynix') && (lastCode.startsWith('H26') || lastCode.startsWith('H28') || lastCode.startsWith('HN8'))) {
                    explanation += '📖 القاعدة: SK Hynix H26/H28/HN8 (زجاجي) - السطر 1\n54=16|64=32|74=64|88=128|9=256';
                } else if (company.includes('toshiba') || lastCode.startsWith('THG')) {
                    explanation += '📖 القاعدة: Toshiba THG (زجاجي) - السطر 3\nG7=16|G8=32|G9=64|T0=128|T1=256|T2=512';
                } else if (lastCode.startsWith('YMEC') || lastCode.startsWith('TY')) {
                    explanation += '📖 القاعدة: YMEC (زجاجي) - أسفل يسار\n6=32|7=64|8=128|9=256';
                } else if (lastCode.includes('UNIC') || lastCode.includes('EMCP')) {
                    explanation += '📖 القاعدة: UNIC (زجاجي) - آخر سطر\n05G=32|06G=64|07G=128';
                } else if (company.includes('micron') || lastCode.startsWith('JW') || lastCode.startsWith('JZ')) {
                    explanation += '📖 القاعدة: Micron JW/JZ (زجاجي) - الكود كامل من الجدول';
                } else if (company.includes('sandisk') || lastCode.startsWith('SDIN')) {
                    explanation += '📖 القاعدة: SanDisk SDIN - المساحة مكتوبة صريحة في الكود';
                }
                
                explanation += '\n\nلو النتيجة غلط، قولي الصح وأنا هتعلم! 🎓';
                return res.json({ reply: explanation, source: 'system', action: 'explain_source' });
            } else {
                // الكود مش موجود في أي مصدر محلي - يبقى Gemini هو اللي صنفه
                let explanation = '🔍 آخر كود: ' + lastCode + '\n\n';
                explanation += '📌 المصدر: 🤖 Gemini AI - مالقتوش في الجداول ولا الاختصارات، فـ Gemini حلله بالذكاء الاصطناعي';
                if (context.storage) explanation += '\n📋 النتيجة: ' + context.storage + 'GB ' + (context.type || '?');
                explanation += '\n\n⚠️ تصنيف Gemini بيكون أقل دقة من الجداول. لو غلط قولي الصح!';
                return res.json({ reply: explanation, source: 'system', action: 'explain_source' });
            }
        }

        // ═══ نية: عرض القواعد ═══
        if (intent === 'list_rules') {
            if (customRules.length === 0) {
                return res.json({ reply: '📚 مفيش قواعد مخصصة لحد دلوقتي.\nعلمني قاعدة جديدة - مثلاً: "لما تلاقي N11 في كود Kingston يبقى DDR3"', source: 'system', action: 'list_rules' });
            }
            let reply = '📚 القواعد المخصصة (' + customRules.length + ' قاعدة):\n\n';
            customRules.forEach((r, i) => {
                reply += (i + 1) + '. ' + r.rule.substring(0, 80) + '\n';
            });
            return res.json({ reply, source: 'system', action: 'list_rules' });
        }

        // ═══ نية: محادثة عادية مع Gemini ═══
        // أولاً: لو فيه كود في الرسالة - دور عليه في كل المصادر
        const mentionedWords = message.trim().split(/\s+/);
        let foundCode = null;
        for (const w of mentionedWords) {
            const clean = w.replace(/[.,;:!?]{1,5}$/g, '').trim();
            if (clean.length >= 4 && /[A-Z0-9]/i.test(clean) && !/^[\u0600-\u06FF]+$/.test(clean)) {
                const result = findCodeEverywhere(clean, learnedCodes);
                if (result) {
                    foundCode = { word: clean, result };
                    break;
                }
            }
        }

        // لو لقينا الكود في مصادرنا - رد بالمصدر
        if (foundCode) {
            const r = foundCode.result;
            const reply = r.sourceText + '\n\n' + foundCode.word.toUpperCase() + ' → ' + (r.storage || '?') + 'GB ' + (r.type || '?') + (r.ram ? ' | RAM ' + r.ram + 'GB' : '') + (r.company ? ' | ' + r.company : '');
            return res.json({ reply, source: r.source, action: 'found' });
        }

        // لو مفيش كود معروف - ابعت لـ Gemini
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

        dbSummary += '\nاختصارات سامسونج (الحرف قبل الرقم): N=8, E=16, X/D=32, C/H/P=64, G/V=128, F/S=256\n';
        dbSummary += 'اختصارات YMEC (الحرف الخامس بعد YMEC): 6/G=32, 7=64, 8/B=128, 9=256 (زجاجي)\n';
        dbSummary += 'اختصارات UNIC: 05G=32, 06G=64, 07G=128 (زجاجي)\n';

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

        let patternsInfo = '';
        if (Object.keys(learnedPatterns).length > 0) {
            patternsInfo = '\nأنماط متعلمة من التصويت (' + Object.keys(learnedPatterns).length + ' نمط):\n';
            const sorted = Object.entries(learnedPatterns).sort((a,b) => b[1].votes - a[1].votes).slice(0, 15);
            sorted.forEach(([prefix, p]) => {
                patternsInfo += '- ' + prefix + '... = ' + p.storage + 'GB ' + p.type + ' (أصوات: ' + p.votes + ')\n';
            });
        }

        // القواعد المخصصة
        let rulesInfo = '';
        if (customRules.length > 0) {
            rulesInfo = '\nقواعد مخصصة علمها المستخدم (مهمة جداً - طبقها دايماً):\n';
            customRules.forEach(r => {
                rulesInfo += '- ' + r.rule + '\n';
            });
        }

        // اختصارات المدرب
        let shortcutsInfo = '';
        if (trainedShortcuts.length > 0) {
            shortcutsInfo = '\n🎯 اختصارات المدرب (' + trainedShortcuts.length + ' اختصار):\n';
            trainedShortcuts.slice(0, 20).forEach(s => {
                shortcutsInfo += '- ' + s.prefix + ' → ' + s.storage + 'GB ' + s.type + (s.company ? ' ' + s.company : '') + '\n';
            });
        }

        let historyText = '';
        if (history && history.length > 0) {
            historyText = '\nتاريخ المحادثة:\n';
            history.slice(-10).forEach(h => {
                historyText += (h.role === 'user' ? 'المستخدم' : 'أنت') + ': ' + h.text + '\n';
            });
        }

        const chatPrompt = `${UNIFIED_PROMPT}
اسمك "مساعد البحراوي". المدرب (الخبير) بيعلمك وأنت بتحفظ كل حاجة. أنت نسخة منه - بتتعلم منه وبتطبق اللي علمهولك.

${dbSummary}${correctionsInfo}${patternsInfo}${rulesInfo}${shortcutsInfo}

${buildExpertKnowledge()}

أو لو قاعدة عامة:
[RULE]{"rule":"القاعدة"}[/RULE]

${context ? 'السياق الحالي:\n- آخر كود: ' + (context.code || 'مفيش') + '\n- آخر نتيجة: ' + (context.storage || '?') + 'GB ' + (context.type || '?') + '\n- الشركة: ' + (context.company || '?') : ''}${historyText}

رسالة المستخدم: "${message}"
${lastImage ? '\n📷 المستخدم بعتلك صورة كمان - لو سألك عنها حللها' : ''}

رد بإيجاز ووضوح بالمصري. لو سأل عن حاجة مش ليها علاقة بالذاكرة، رد عليه بلطف وارجعه للموضوع.`;

        // بناء الـ parts: نص + صورة لو موجودة
        const parts = [{ text: chatPrompt }];
        if (lastImage) {
            const rawBase64 = extractRawBase64(lastImage);
            parts.unshift({ inlineData: { data: rawBase64, mimeType: 'image/jpeg' } });
        }

        const result = await model.generateContent({
            contents: [{ parts }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        });

        let reply = result.response.text().trim();
        let action = 'chat';
        let source = 'gemini';

        // استخراج أوامر التدريب من رد Gemini
        const trainMatch = reply.match(/\[TRAIN\](.*?)\[\/TRAIN\]/s);
        if (trainMatch) {
            try {
                const trainData = JSON.parse(trainMatch[1]);
                if (trainData.code && trainData.storage) {
                    // حفظ في learnedPatterns
                    learnPattern(trainData.code, trainData.storage, trainData.type || 'عادي', trainData.ram || null);
                    action = 'trained';
                    console.log('🧠 شات: تدريب جديد -', trainData.code, '=', trainData.storage + 'GB');
                }
            } catch (e) { /* تجاهل لو JSON غلط */ }
            // شيل التاج من الرد
            reply = reply.replace(/\[TRAIN\].*?\[\/TRAIN\]/s, '').trim();
            if (!reply.includes('تم الحفظ') && !reply.includes('✅')) {
                reply += '\n\n✅ تم الحفظ على السحابة';
            }
        }

        // استخراج قواعد من رد Gemini
        const ruleMatch = reply.match(/\[RULE\](.*?)\[\/RULE\]/s);
        if (ruleMatch) {
            try {
                const ruleData = JSON.parse(ruleMatch[1]);
                if (ruleData.rule) {
                    customRules.push({ rule: ruleData.rule, addedAt: new Date().toISOString() });
                    saveRulesToCloud();
                    action = 'rule_saved';
                    console.log('📚 شات: قاعدة جديدة -', ruleData.rule);
                }
            } catch (e) { /* تجاهل */ }
            reply = reply.replace(/\[RULE\].*?\[\/RULE\]/s, '').trim();
            if (!reply.includes('تم الحفظ') && !reply.includes('✅')) {
                reply += '\n\n📚 تم حفظ القاعدة على السحابة ✅';
            }
        }

        // استخراج اختصارات من رد Gemini
        const shortcutMatch = reply.match(/\[SHORTCUT\](.*?)\[\/SHORTCUT\]/s);
        if (shortcutMatch) {
            try {
                const scData = JSON.parse(shortcutMatch[1]);
                if (scData.prefix && scData.storage) {
                    addTrainedShortcut(scData);
                    action = 'shortcut_saved';
                    console.log('🎯 شات: اختصار جديد -', scData.prefix, '=', scData.storage + 'GB');
                }
            } catch (e) { /* تجاهل */ }
            reply = reply.replace(/\[SHORTCUT\].*?\[\/SHORTCUT\]/s, '').trim();
            if (!reply.includes('تم الحفظ') && !reply.includes('✅')) {
                reply += '\n\n🎯 تم حفظ الاختصار على السحابة ✅';
            }
        }

        res.json({ reply, source, action });
    } catch (error) {
        console.error("Chat error:", error);
        res.json({ reply: '⚠️ مش قادر أرد دلوقتي - جرب تاني', source: 'error', action: 'error' });
    }
});

// ═══════════════════════════════════════════════════════════════
// /api/vision-ocr - Google Cloud Vision OCR (FAST path)
// بديل Tesseract.js - أسرع وأدق على الموبايل (0.5-1.5 ثانية)
// ═══════════════════════════════════════════════════════════════
app.post('/api/vision-ocr', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: 'No image provided', text: '' });

        const VISION_KEY = process.env.GOOGLE_VISION_KEY || '';

        if (!VISION_KEY) {
            // fallback: استخدم Gemini كـ OCR سريع بدون تصنيف
            console.log('⚠️ GOOGLE_VISION_KEY غير موجود - fallback إلى Gemini OCR');
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const rawBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
            const ocrPrompt = `Read ONLY the memory chip code from this image. Memory chips start with: KM, KLM, KLU, H9, H26, H28, HN, THG, SDIN, SDAD, JW, JZ, YMEC, TY, 08EMCP, 16EMCP.\nReturn ONLY the code text, nothing else. If not found return: NOT_FOUND`;
            const result = await model.generateContent({
                contents: [{ parts: [
                    { inlineData: { data: rawBase64, mimeType: 'image/jpeg' } },
                    { text: ocrPrompt }
                ]}],
                generationConfig: { temperature: 0 }
            });
            const text = result.response.text().replace(/```/g, '').trim();
            console.log('🔤 Gemini OCR fallback:', text);
            return res.json({ text: text === 'NOT_FOUND' ? '' : text, source: 'gemini_ocr' });
        }

        // Google Cloud Vision API
        const rawBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        const visionRes = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requests: [{
                        image: { content: rawBase64 },
                        features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
                    }]
                })
            }
        );

        if (!visionRes.ok) {
            const errData = await visionRes.json().catch(() => ({}));
            console.error('Vision API error:', visionRes.status, errData);
            return res.status(500).json({ error: 'Vision API failed', text: '' });
        }

        const visionData = await visionRes.json();
        const annotations = visionData.responses &&
            visionData.responses[0] &&
            visionData.responses[0].textAnnotations;

        if (!annotations || annotations.length === 0) {
            console.log('🔤 Vision: لا يوجد نص');
            return res.json({ text: '', source: 'vision' });
        }

        // أول annotation = كل النص في الصورة
        const fullText = annotations[0].description || '';
        console.log('🔤 Vision OCR raw:', fullText.substring(0, 200));

        // استخراج كود الذاكرة من النص
        const lines = fullText.split(/[\n\r\s]+/).filter(l => l.length >= 4);
        let bestCode = '';
        for (const line of lines) {
            const cleaned = cleanReadCode(line.trim());
            if (isValidMemoryCode(cleaned)) {
                bestCode = cleaned;
                break;
            }
        }

        // لو ملقاش كود مباشرة - جرب cleanReadCode على النص الكامل
        if (!bestCode) {
            const fullCleaned = cleanReadCode(fullText.replace(/[\n\r]/g, ' ').trim());
            if (isValidMemoryCode(fullCleaned)) bestCode = fullCleaned;
        }

        console.log('🔤 Vision OCR best code:', bestCode || '(لا يوجد)');
        return res.json({ text: bestCode || fullText.substring(0, 100), source: 'vision', rawText: fullText.substring(0, 500) });

    } catch (error) {
        console.error('Vision OCR error:', error.message);
        return res.status(500).json({ error: error.message, text: '' });
    }
});

app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// ═══════════════════════════════════════════════════════════════
// Module exports for testing
// ═══════════════════════════════════════════════════════════════
module.exports = {
    app,
    extractRam,
    searchInDB,
    detectCompany,
    isValidMemoryCode,
    looksLikeMemoryCode,
    fuzzySearchInDB,
    cleanReadCode,
    getCandidatesForCode,
    applyErrorMemoryFixes,
    checkWrongClassification,
    learnOCRError,
    learnWrongClassification,
    learnPattern,
    lookupCode,
    lookupCodeStrict,
    getCached,
    getCachedStrict,
    setCache,
    NORMAL_DB,
    EMMC_DB,
    MICRON_DB,
    SAMSUNG_RAM_MAP,
    HYNIX_RAM_MAP,
    errorMemory,
    wrongClassifications,
    learnedPatterns,
    resultCache
};
