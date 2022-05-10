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
exports.Posts_To_Replies = void 0;
const typeorm_1 = require("typeorm");
const posts_1 = require("./posts");
let Posts_To_Replies = class Posts_To_Replies extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Posts_To_Replies.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Posts_To_Replies.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Posts_To_Replies.prototype, "replyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => posts_1.Posts, (rep) => rep.replies, { onDelete: "CASCADE" }),
    __metadata("design:type", posts_1.Posts)
], Posts_To_Replies.prototype, "reply", void 0);
Posts_To_Replies = __decorate([
    (0, typeorm_1.Entity)()
], Posts_To_Replies);
exports.Posts_To_Replies = Posts_To_Replies;
