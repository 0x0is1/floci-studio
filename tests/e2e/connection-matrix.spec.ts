import { test, expect } from '@playwright/test';
import { validateAwsConnection } from '../../frontends/playground/src/lib/rules/connectionMatrix';

test.describe('Strict AWS Connection Matrix E2E Logic', () => {
  test('disallows invalid architectural connections with descriptive reasons', () => {
    // S3 cannot route directly to ALB
    const s3ToAlb = validateAwsConnection('s3', 'alb');
    expect(s3ToAlb.allowed).toBe(false);
    expect(s3ToAlb.reason).toContain('Invalid AWS architecture pattern');

    // VPC cannot connect directly to S3
    const vpcToS3 = validateAwsConnection('vpc', 's3');
    expect(vpcToS3.allowed).toBe(false);
    expect(vpcToS3.reason).toContain('Invalid AWS architecture pattern');
  });

  test('allows and auto-configures valid architectural connections', () => {
    // CloudFront to EC2
    const cfToEc2 = validateAwsConnection('cloudfront', 'ec2');
    expect(cfToEc2.allowed).toBe(true);
    expect(cfToEc2.defaultData?.port).toBe(8080);

    // EC2 to S3
    const ec2ToS3 = validateAwsConnection('ec2', 's3');
    expect(ec2ToS3.allowed).toBe(true);
    expect(ec2ToS3.defaultData?.iamPolicy).toContain('s3:PutObject');
    expect(ec2ToS3.defaultData?.envVarName).toBe('S3_BUCKET_NAME');

    // EC2 to RDS
    const ec2ToRds = validateAwsConnection('ec2', 'rds');
    expect(ec2ToRds.allowed).toBe(true);
    expect(ec2ToRds.defaultData?.port).toBe(5432);
    expect(ec2ToRds.defaultData?.envVarName).toBe('DATABASE_URL');
  });
});
