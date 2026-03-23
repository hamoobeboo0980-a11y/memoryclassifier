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
// بناء نص الجداول للبرومبت
// ═══════════════════════════════════════════════════════════════

function buildDBText() {
    let lines = [];

    lines.push('=== جدول العادي ===');
    lines.push('(المساحة+RAM: قائمة الأكواد)');
    for (const [capacity, codes] of Object.entries(NORMAL_DB)) {
        const storage = capacity.split('+')[0];
        lines.push(`${capacity}GB → ${codes.join(' | ')}`);
    }

    lines.push('');
    lines.push('=== جدول الزجاجي (EMMC/UFS) ===');
    lines.push('(المساحة: قائمة الأكواد)');
    for (const [size, codes] of Object.entries(EMMC_DB)) {
        lines.push(`${size}GB → ${codes.join(' | ')}`);
    }

    lines.push('');
    lines.push('=== Micron (JW/JZ) - زجاجي ===');
    for (const [size, codes] of Object.entries(MICRON_DB)) {
        lines.push(`${size}GB → ${codes.join(' | ')}`);
    }

    return lines.join('\n');
}

const DB_TEXT = buildDBText();

const SHORTCUTS_TEXT = `=== اختصارات العادي ===

Samsung (KM) - الحرف قبل 000/100/200/600/700/800/900 في الكود:
N=8GB | E=16GB | X=32GB | D=32GB | C=64GB | H=64GB | P=64GB | G=128GB | V=128GB | F=256GB | S=256GB
مثال: KMK7X000VM → X قبل 000 → 32GB عادي
مثال: KMRH60014M → H قبل 600 → 64GB عادي

SK Hynix (H9) - الرقمان في الموضع 5-6 من الكود:
17/18/19 = 16GB | 26/27 = 32GB | 52/53 = 64GB | 16 = 128GB
مثال: H9TQ17ADFTMC → 17 → 16GB عادي
مثال: H9TQ52ACLTMC → 52 → 64GB عادي

SanDisk (SDIN) - المساحة مكتوبة صريحة في الكود:
16G=16GB | 32G=32GB | 64G=64GB | 128G=128GB | 256G=256GB | 512G=512GB

=== اختصارات الزجاجي ===

Samsung EMMC (KLM/KLU) - الحرفان في الموضع 5-6 من الكود:
AG=16GB | BG=32GB | CG=64GB | DG=128GB | EG=256GB | FG=512GB
مثال: KLMAG4FE4B-B002 → AG → 16GB زجاجي
مثال: KLMDG8JENB-B041 → DG → 128GB زجاجي

Toshiba (THG) - الحرفان في الموضع 7-8 من الكود:
G7=16GB | G8=32GB | G9=64GB | T0=128GB | T1=256GB | T2=512GB
مثال: THGBMAG7A2JBAIR → G7 → 16GB زجاجي

SK Hynix EMMC (H26/H28) - الأرقام بعد H26M أو H28:
54=16GB | 64=32GB | 74=64GB | 88=128GB | 9=256GB
مثال: H26M54002EMR → 54 → 16GB زجاجي
مثال: H28U88301AMR → 88 → 128GB زجاجي

UNIC - آخر 3 حروف من الكود:
05G = 32GB | 06G = 64GB | 07G = 128GB

YMEC - الحرف الخامس من الكود:
6=32GB | 7=64GB | 8=128GB | 9=256GB`;

// ═══════════════════════════════════════════════════════════════
// API Endpoint
// ═══════════════════════════════════════════════════════════════

app.post('/api/analyze', async (req, res) => {
    try {
        const { imageBase64, learnedCodes } = req.body;
        if (!imageBase64) return res.status(400).json({ error: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // بناء قسم الدروس المتعلمة
        let learnedSection = '';
        if (learnedCodes && learnedCodes.length > 0) {
            learnedSection = '\n═══════════════════════════════════════\nأكواد تعلمتها من المستخدم - أولوية قصوى\n═══════════════════════════════════════\n';
            for (const item of learnedCodes) {
                learnedSection += `${item.code} → ${item.storage}GB ${item.type === 'glass' ? 'زجاجي' : 'عادي'}\n`;
            }
        }

        const prompt = `أنت خبير متخصص بدرجة عالية جداً في قراءة وتصنيف شرائح الذاكرة (IC chips) على لوحات الهواتف المحمولة.

مهمتك: انظر للصورة، اقرأ كود شريحة الذاكرة بدقة شديدة، ثم ابحث في الجداول وحدد المساحة والنوع.

═══════════════════════════════════════
الخطوة 1: تجاهل تماماً
═══════════════════════════════════════
تجاهل: Qualcomm / Snapdragon / Mediatek / CPU / GPU
ركز فقط على شريحة الذاكرة (Samsung / SK Hynix / Toshiba / SanDisk / Micron / Kingston / YMEC / UNIC)

═══════════════════════════════════════
الخطوة 2: اقرأ الكود بدقة شديدة
═══════════════════════════════════════
قواعد القراءة حسب الشركة:

Samsung (KM): اقرأ السطر الثالث كود رئيسي + السطر الذي فوقه (اللاحقة مثل B314, B419, B316)
  مثال: السطر الثالث = KMK7X000VM والسطر فوقه = B314 → الكود الكامل = KMK7X000VM-B314

Samsung (KLM/KLU): اقرأ الكود الرئيسي + اللاحقة من السطر المجاور
  مثال: KLMAG4FE4B + B002 → الكود الكامل = KLMAG4FE4B-B002

SK Hynix (H9): اقرأ الكود الكامل في سطر واحد (مثال: H9TQ17ADFTMC)
SK Hynix (H26/H28/HN8): اقرأ الكود الكامل (مثال: H26M54002EMR)
SanDisk (SDIN): اقرأ السطر الثاني (مثال: SDIN7DU2-16G)
Toshiba (THG): اقرأ السطر الثالث (مثال: THGBMAG7A2JBAIR)
Kingston: اقرأ الجزء الأيسر من السطر الرابع فقط
Micron (JW/JZ): اقرأ الكود الكامل (مثال: JZ144)
YMEC: اقرأ آخر سطر في الجهة اليسرى السفلى
UNIC: اقرأ آخر سطر

تنبيهات مهمة للحروف المتشابهة:
- G مقابل 6: G له ذيل صغير، 6 دائري مغلق
- B مقابل 8: B له نتوءان مسطحة، 8 حلقتان دائريتان
- 0 مقابل O: 0 بيضاوي قليلاً، O دائري تام
- I مقابل 1: انظر للسياق والطول
- لو الصورة مقلوبة أو مائلة، صحح ذهنياً أولاً

═══════════════════════════════════════
الخطوة 3: ابحث في جدول العادي أولاً
═══════════════════════════════════════
${DB_TEXT}

═══════════════════════════════════════
الخطوة 4: لو ما لقيتش - استخدم الاختصارات
═══════════════════════════════════════
${SHORTCUTS_TEXT}
${learnedSection}
═══════════════════════════════════════
الخطوة 5: أرجع النتيجة
═══════════════════════════════════════
أرجع JSON فقط بهذا الشكل بدون أي نص إضافي:
{"code":"الكود_الكامل","storage":"المساحة_بالأرقام_فقط","type":"عادي أو زجاجي","company":"اسم_الشركة"}

أمثلة على النتائج الصحيحة:
{"code":"KMK7X000VM-B314","storage":"32","type":"عادي","company":"Samsung"}
{"code":"KLMAG4FE4B-B002","storage":"16","type":"زجاجي","company":"Samsung"}
{"code":"H9TQ17ADFTMC","storage":"16","type":"عادي","company":"SK Hynix"}
{"code":"THGBMAG7A2JBAIR","storage":"16","type":"زجاجي","company":"Toshiba"}
{"code":"H26M54002EMR","storage":"16","type":"زجاجي","company":"SK Hynix"}
{"code":"JZ144","storage":"128","type":"زجاجي","company":"Micron"}

لو ما قدرتش تقرأ الكود خالص: {"code":"","storage":"","type":"","company":""}`;

        const result = await model.generateContent({
            contents: [{ parts: [
                { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
                { text: prompt }
            ]}],
            generationConfig: {
                temperature: 0,
                topP: 1,
                responseMimeType: "application/json"
            }
        });

        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsed;
        try {
            // محاولة 1: parse مباشر
            parsed = JSON.parse(text);
        } catch(e1) {
            try {
                // محاولة 2: استخراج JSON بـ regex
                const jsonMatch = text.match(/\{[\s\S]*?"code"[\s\S]*?\}/);
                parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { code: '', storage: '', type: '', company: '' };
            } catch(e2) {
                parsed = { code: '', storage: '', type: '', company: '' };
            }
        }

        res.json(parsed);
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
