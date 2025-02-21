import { applyDecorators, UseGuards } from '@nestjs/common';
import { BlockRequestsGuard } from 'utils/guard/block-requests.guard';

export function BlockRequests() {
  return applyDecorators(UseGuards(BlockRequestsGuard));
}
