import { Controller } from '@nestjs/common';
import { LeavesService } from './leaves.service';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}
}
