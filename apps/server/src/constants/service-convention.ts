import z from 'zod';

export const serviceConfigMapSchema = z.object({
  service: z.enum(['S3', 'CloudFront', 'EC2', 'VPC']),
  service_task: z.string(),
  service_sections: z.array(z.string()),
  fixed_option: z.record(z.string(), z.string()),
});

export type TServiceConfigMap = z.infer<typeof serviceConfigMapSchema>;
