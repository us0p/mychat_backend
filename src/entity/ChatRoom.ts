import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    roomName: string;

    @OneToOne(() => User, (user) => user.chatRoom)
    user: User;
}
