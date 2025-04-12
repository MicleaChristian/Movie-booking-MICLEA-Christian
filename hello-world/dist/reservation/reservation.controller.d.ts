import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
export declare class ReservationController {
    private readonly reservationService;
    constructor(reservationService: ReservationService);
    create(createReservationDto: CreateReservationDto, req: any): Promise<Reservation>;
    findAll(req: any): Promise<Reservation[]>;
    findOne(id: number, req: any): Promise<Reservation>;
    cancel(id: number, req: any): Promise<Reservation>;
}
