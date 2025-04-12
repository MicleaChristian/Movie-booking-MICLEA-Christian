import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The reservation has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request, time conflict or invalid data.',
  })
  async create(@Body() createReservationDto: CreateReservationDto, @Request() req): Promise<Reservation> {
    return this.reservationService.create(createReservationDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all active reservations for the user.',
  })
  async findAll(@Request() req): Promise<Reservation[]> {
    return this.reservationService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reservation by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the reservation with the specified ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reservation not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Reservation> {
    return this.reservationService.findOne(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a reservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The reservation has been successfully cancelled.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reservation not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot cancel: already cancelled or already started.',
  })
  async cancel(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Reservation> {
    return this.reservationService.cancel(id, req.user.id);
  }
} 