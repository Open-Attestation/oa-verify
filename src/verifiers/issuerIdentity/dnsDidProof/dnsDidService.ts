import axios from "axios";

// This service will be migrated to the "@govtechsg/dnsprove" dep at a later stage

export interface IDNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export interface IDNSQueryResponse {
  AD: boolean; // Whether all response data was validated with DNSSEC,
  Answer: IDNSRecord[];
}

const isDidDnsRecord = ({ data }: IDNSRecord) => {
  return data.includes("openatts") && data.includes("a=dns-did");
};

interface DecodedDnsRecord {
  [key: string]: string;
}

const trimTrailingSemicolon = (str: string) => {
  return str.endsWith(";") ? str.substring(0, str.length - 1) : str;
};

const decodeDidDnsRecord = ({ data }: IDNSRecord) => {
  const rawRecord = data.slice(1, -1);
  const keyValuePairs = rawRecord.trim().split(" "); // tokenize into key=value; elements
  const matcher = /(.+)=(.+)/;
  const record: DecodedDnsRecord = {};
  keyValuePairs.forEach((pair) => {
    const matched = matcher.exec(pair);
    if (matched) {
      const [, key, value] = matched;
      record[key] = trimTrailingSemicolon(value);
    }
  });
  return record;
};

const parseDidDnsRecord = ({ a, v, p }: DecodedDnsRecord) => {
  return {
    algorithm: a,
    publicKey: p,
    version: v,
  };
};

export const getDnsDidRecords = async (domain: string) => {
  const { data } = await axios.get<IDNSQueryResponse>(`https://dns.google/resolve?name=${domain}&type=TXT`);
  return data.Answer.filter(isDidDnsRecord).map(decodeDidDnsRecord).map(parseDidDnsRecord);
};
