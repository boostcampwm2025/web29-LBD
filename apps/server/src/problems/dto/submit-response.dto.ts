export type FeedbackDto = {
  serviceType: string;
  service?: string;
  field?: string;
  code: string;
  message: string;
};

export class SubmitResponseDto {
  result: 'PASS' | 'FAIL';
  feedback: FeedbackDto[];
}
