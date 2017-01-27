
const uuidV4 = require('uuid/v4');

var uuidTable = [];
var dimensione = 1000000;

for (i = 0; i < dimensione; i++) {
    uuidTable[i] = uuidV4();
}

var crcTable = [];
var inizio = Date.now();
uuidTable.forEach(function (uuid) {
    crcTable.push(crc32_compute_string(uuid).toString(36));
}, this);
var fine = Date.now();
console.log('Millisecondi per calcolo hash di ' + dimensione + ' uuids: ' + (fine - inizio));
console.log('Esempio di hash :');
for (i = 0; i < 10; i++) {
    console.log('Uuid: ' + uuidTable[i] + '  --->  Hash = CRC32 in base 36: ' + crcTable[i]);
}

//conto le collisioni
var sorted_arr = crcTable.slice().sort();
var results = [];
for (var i = 0; i < crcTable.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
    }
}

console.log('Su ' + dimensione + ' hash ci sono queste collisioni: ' + results.length);







function crc32_generate() {
    var table = new Array()
    var i, j, n

    for (i = 0; i < 256; i++) {
        n = i
        for (j = 8; j > 0; j--) {
            if ((n & 1) == 1) {
                n = (n >>> 1) ^ 0xEDB88320
            } else {
                n = n >>> 1
            }
        }
        table[i] = n
    }

    return table
}

function crc32_initial() {
    return 0xFFFFFFFF
}

function crc32_final(crc) {
    crc = ~crc
    return crc < 0 ? 0xFFFFFFFF + crc + 1 : crc
}

function crc32_compute_string(str) {
    var crc = 0
    var table = crc32_generate()
    var i

    crc = crc32_initial()

    for (i = 0; i < str.length; i++)
        crc = (crc >>> 8) ^ table[str.charCodeAt(i) ^ (crc & 0x000000FF)]

    crc = crc32_final(crc)
    return crc
}
