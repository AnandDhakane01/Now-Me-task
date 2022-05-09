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
  @ManyToOne((type) => Posts, (post) => post.replies)
  @JoinColumn({ name: "postId" })
  post!: Posts;

  @Column()
  replyId!: number;
  @ManyToOne((type) => Posts, (post) => post.replies)
  @JoinColumn({ name: "replyId" })
  reply!: Posts;
}
