// value: value sample
// flag: flag sample

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

function Value2Text(flag, value){
    switch(flag){
      case States.IDLE: return "X";
      case States.START: return "S";
      case States.TRANS_BIT: return "T";
      case States.CMD_IDX: return "CMD" + value;
      case States.ARG: return "arg: " + "b"+value.toString(2);
      case States.CRC: return "crc: " + "b"+value.toString(2);
      case States.RSP_WAIT: return "Waiting";
      case States.RSP_START: return "S";
      case States.RSP_TRANS: return "T";
      case States.RSP_IDX: return "CMD" + value;
      case States.RSP_CONTENT: return "Content";
      default: return value; // decimal
  //    default: return "0x"+value.toString(16).toUpperCase(); // hexadecimal
  //    default: return "b"+value.toString(2); // binary
    }
  }
  