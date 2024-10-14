import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    roomId: string;

    @Column()
    author: string;

    @Column()
    authorImage: string;

    @Column("text")
    message: string;
}
