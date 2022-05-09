import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Posts_To_Replies } from "./posts_to_replies";
import { Users } from "./users";

@Entity()
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  thought!: string;

  @ManyToOne((type) => Users, (user) => user.posts)
  user!: Users;

  @OneToMany((type) => Posts_To_Replies, (replies) => replies.post)
  replies!: Posts_To_Replies[];

  @CreateDateColumn()
  createdAt!: Date;
}
