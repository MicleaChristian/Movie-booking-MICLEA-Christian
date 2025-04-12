import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'The ID of the movie to reserve',
    example: 550,
  })
  @IsNotEmpty()
  @IsNumber()
  movieId: number;

  @ApiProperty({
    description: 'The title of the movie',
    example: 'Fight Club',
  })
  @IsNotEmpty()
  @IsString()
  movieTitle: string;

  @ApiProperty({
    description: 'Start time of the movie (ISO format)',
    example: '2023-10-30T18:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;
} 