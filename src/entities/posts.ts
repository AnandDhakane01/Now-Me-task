import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Posts_To_Replies } from "./posts_to_replies";
import { Users } from "./users";

@Entity()
export class Posts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  thought!: string;

  @Column()
  userId!: number;
  @JoinColumn()
  @ManyToOne(() => Users, (user) => user.posts, { onDelete: "CASCADE" })
  user!: Users;

  @OneToMany((type) => Posts_To_Replies, (rep) => rep.replyId)
  replies!: Posts_To_Replies[];

  @Column()
  is_base!: boolean;

  @Column()
  anonymous!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
