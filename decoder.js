// rgData: input, raw digital sample array
// rgValue: output, decoded data array
// rgFlag: output, decoded flag array

var c = rgData.length // c = number of raw samples
var prevClock = false; // previous cock signal level
var update = false;

function shit(start, end, val) {
        for (var j = start; j < end; j++) {
            rgFlag[j] = state;
            rgValue[j] = val;
        }
        state = (state + 1) % 11;
        return end;
}

const States = {
    IDLE: 0,
    START: 1,
    TRANS_BIT: 2,
    CMD_IDX: 3,
    ARG: 4,
    CRC: 5,
    RSP_WAIT: 6,
    RSP_START: 7,
    RSP_TRANS: 8,
    RSP_IDX: 9,
    RSP_CONTENT: 10
}

var state = States.IDLE;
var cStart = 0;
var negedge = 0;
var count;
var cmdIdx;
var arg;
var crc;

for(var i = 0; i < c; i++){ // for each sample
    var s = rgData[i]; // current sample
    var in_clk = 1&(s>>1); // pin0 is the clock signal
    var in_cmd = 1&(s>>0); // pin1 is the CMD signal

    if (prevClock && !in_clk) { // clock negedge
        negedge = i;
    }

    if (!prevClock && in_clk) { // clock posedge
        switch (state) {
            case States.IDLE:
                if (!in_cmd) {
                    cStart = shit(cStart, negedge, 0);
                }
                break;
            case States.START:
                cStart = shit(cStart, negedge, 0);
                break;
            case States.TRANS_BIT:
                cStart = shit(cStart, negedge, 0);
                count = 0;
                cmdIdx = 0;
                // flow into next state
            case States.CMD_IDX:
                cmdIdx |= in_cmd << (5 - count);
                if (count++ == 6) {
                    cStart = shit(cStart, negedge, cmdIdx);
                    count = 0;
                    arg = 0;
                    break;
                } else {
                    break;
                }
            case States.ARG:
                arg |= in_cmd << (31 - count);
                if (count++ == 32) {
                    cStart = shit(cStart, negedge, arg);
                    count = 0;
                    crc = 0;
                    break;
                } else {
                    break;
                }
            case States.CRC:
                crc |= in_cmd << (6 - count);
                if (count++ == 7) {
                    cStart = shit(cStart, negedge, crc);
                    count = 0;
                    break;
                } else {
                    break;
                }
            case States.RSP_WAIT:
                count++;
                if (count > 10) {
                    state = States.IDLE;
                }
                if (!in_cmd) {
                    cStart = shit(cStart, negedge, 0);
                }
                break;
            case States.RSP_START:
                cStart = shit(cStart, negedge, 0);
                break;
            case States.RSP_TRANS:
                cStart = shit(cStart, negedge, 0);
                count = 0;
                cmdIdx = 0;
                // flow into next state
            case States.RSP_IDX:
                cmdIdx |= in_cmd << (5 - count);
                if (count++ == 6) {
                    cStart = shit(cStart, negedge, cmdIdx);
                    count = 0;
                } else {
                    break;
                }
            case States.RSP_CONTENT:
                if (count++ == 40) {
                    cStart = shit(cStart, negedge, cmdIdx);
                    count = 0;
                } else {
                    break;
                }
        }
    }
    prevClock = in_clk;
}