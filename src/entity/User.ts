import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { ChatRoom } from "./ChatRoom";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    imageUrl: string;

    @OneToOne(() => ChatRoom, (chatRoom) => chatRoom.user, {
        onDelete: "SET NULL",
    })
    @JoinColumn()
    chatRoom: ChatRoom;
}
