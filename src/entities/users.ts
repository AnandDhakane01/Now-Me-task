import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Posts } from "./posts";

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @OneToMany((type) => Posts, (post) => post.user) posts!: Posts[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
