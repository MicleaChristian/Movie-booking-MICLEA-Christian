import { User } from '../../user/entities/user.entity';
export declare class Reservation {
    id: number;
    userId: number;
    user: User;
    movieId: number;
    movieTitle: string;
    startTime: Date;
    endTime: Date;
    isCancelled: boolean;
    createdAt: Date;
}
