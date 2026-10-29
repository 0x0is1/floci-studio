export const config = {
  port: Number(process.env.PORT || 4501),
  flociEndpoint: process.env.FLOCI_ENDPOINT || 'http://localhost:4566',
  dataDir: process.env.DATA_DIR || './data',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
};
