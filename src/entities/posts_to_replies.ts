import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";
import { Posts } from "./posts";

@Entity()
export class Posts_To_Replies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  postId!: number;

  @Column()
  replyId!: number;
  @ManyToOne((type) => Posts, (rep) => rep.replies, { onDelete: "CASCADE" })
  reply!: Posts;
}
