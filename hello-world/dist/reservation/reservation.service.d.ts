import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { User } from '../user/entities/user.entity';
export declare class ReservationService {
    private reservationRepository;
    private readonly MOVIE_DURATION_HOURS;
    constructor(reservationRepository: Repository<Reservation>);
    create(createReservationDto: CreateReservationDto, user: User): Promise<Reservation>;
    findAllByUser(userId: number): Promise<Reservation[]>;
    findOne(id: number, userId: number): Promise<Reservation>;
    cancel(id: number, userId: number): Promise<Reservation>;
}
