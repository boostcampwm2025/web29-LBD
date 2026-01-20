export interface IPRange {
  start: number;
  end: number;
}

function ipToLong(ip: string): number {
  const octets = ip.split('.');
  if (octets.length !== 4) throw new Error(`Invalid IP: ${ip}`);

  return (
    ((parseInt(octets[0], 10) << 24) |
      (parseInt(octets[1], 10) << 16) |
      (parseInt(octets[2], 10) << 8) |
      parseInt(octets[3], 10)) >>>
    0
  );
}

function getCidrRange(cidr: string): IPRange {
  const [ipPart, prefixPart] = cidr.split('/');
  if (!ipPart || !prefixPart) throw new Error();

  const ipNum = ipToLong(ipPart);
  const prefix = parseInt(prefixPart, 10);
  if (prefix < 0 || prefix > 32) throw new Error();

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const start = (ipNum & mask) >>> 0;
  const end = (start | (~mask >>> 0)) >>> 0;

  return { start, end };
}

export function isCidrOverlap(cidr1: string, cidr2: string): boolean {
  try {
    const range1 = getCidrRange(cidr1);
    const range2 = getCidrRange(cidr2);
    return range1.start <= range2.end && range1.end >= range2.start;
  } catch {
    return false;
  }
}

export function containsCidr(parentCidr: string, childCidr: string): boolean {
  try {
    const parent = getCidrRange(parentCidr);
    const child = getCidrRange(childCidr);
    return parent.start <= child.start && parent.end >= child.end;
  } catch {
    return false;
  }
}
