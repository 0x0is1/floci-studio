export function parseDockerStream(raw: Buffer | string | any): string {
  if (!raw) return '';
  if (typeof raw !== 'string' && !Buffer.isBuffer(raw)) {
    return typeof raw === 'object' ? JSON.stringify(raw, null, 2) : String(raw);
  }

  const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw, 'binary');
  if (buf.length >= 8 && (buf[0] === 1 || buf[0] === 2) && buf[1] === 0 && buf[2] === 0 && buf[3] === 0) {
    let offset = 0;
    let output = '';
    while (offset + 8 <= buf.length) {
      const type = buf[offset];
      if (type !== 1 && type !== 2) {
        output += buf.subarray(offset).toString('utf-8');
        break;
      }
      const size = buf.readUInt32BE(offset + 4);
      offset += 8;
      if (offset + size <= buf.length) {
        output += buf.subarray(offset, offset + size).toString('utf-8');
        offset += size;
      } else {
        output += buf.subarray(offset).toString('utf-8');
        break;
      }
    }
    return output;
  }

  return buf.toString('utf-8');
}

