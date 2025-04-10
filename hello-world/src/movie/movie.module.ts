import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [HttpModule],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
