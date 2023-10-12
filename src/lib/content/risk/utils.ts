export const colorMap = {
  red: "#e74c3c", //61-100
  orange: "#f5b041", //36-60
  green: "#2ecc71", //0-35
  null: null, //404
};


export const getRiskColor = (score: number): string | null => {
  if (score === 404 || score === 30) {
    return colorMap.null;
  }
  if (score <= 35) {
    return colorMap.green;
  }
  if (score <= 60) {
    return colorMap.orange;
  }
  return colorMap.red;
};

export const getRiskStatus = (score: number): string | null => {
  if (score === 404 || score === 30) {
    return 'N/A';
  }
  if (score <= 35) {
    return 'Low';
  }
  if (score <= 60) {
    return 'Medium';
  }
  return 'High';
};

export const getRiskPercentage = (statusStr: string): number | null => {
  switch (statusStr.toUpperCase()) {
    // make case letter random
    case 'B':
      return 10;
    case 'C':
      return 20;
    case 'D':
      return 29; // 30 is considered null
    case 'E':
      return 40;
    case 'F':
      return 50;
    case 'G':
      return 60;
    case 'H':
      return 70;
    case 'I':
      return 80;
    case 'J':
      return 90;
    case 'K':
      return 100;
    default:
      return null;
  }
};

export const roundToTwo = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
