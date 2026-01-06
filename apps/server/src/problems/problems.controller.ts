import { Controller, Post, Param, Body } from '@nestjs/common';
import { SubmitRequestDto } from './dto/submit-request.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Post(':problemId/submit')
  submit(
    @Param('problemId') problemId: string,
    @Body() body: SubmitRequestDto,
  ) {
    return this.problemsService.submit(problemId, body);
  }
}
