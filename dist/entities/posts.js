"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Posts = void 0;
const typeorm_1 = require("typeorm");
const posts_to_replies_1 = require("./posts_to_replies");
const users_1 = require("./users");
let Posts = class Posts extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Posts.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Posts.prototype, "thought", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => users_1.Users, (user) => user.posts),
    __metadata("design:type", users_1.Users)
], Posts.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => posts_to_replies_1.Posts_To_Replies, (replies) => replies.post),
    __metadata("design:type", Array)
], Posts.prototype, "replies", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Posts.prototype, "createdAt", void 0);
Posts = __decorate([
    (0, typeorm_1.Entity)()
], Posts);
exports.Posts = Posts;
