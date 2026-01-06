import { Controller, Post, Param, Body } from '@nestjs/common';
import { SubmitRequestDto } from './dto/submit-request.dto';

@Controller('problems')
export class ProblemsController {
  @Post(':problemId/submit')
  submit(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('problemId') problemId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: SubmitRequestDto,
  ) {
    return {
      result: 'PASS',
      feedback: [],
    };
  }
}
