import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { Posts } from "./posts";

@Entity()
export class Posts_To_Replies extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Posts, (post) => post.replies)
  post!: Posts;

  @ManyToOne((type) => Posts, (post) => post.replies)
  reply!: Posts;
}
