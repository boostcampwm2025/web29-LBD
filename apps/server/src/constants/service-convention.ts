import z from 'zod';

export const serviceConfigMapSchema = z.object({
  serviceName: z.enum(['s3', 'cloudFront', 'ec2', 'vpc']),
  serviceTask: z.string(),
  serviceSections: z.array(z.string()),
});

export type TServiceConfigMap = z.infer<typeof serviceConfigMapSchema>;
