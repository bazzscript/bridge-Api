"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor(email, password, id, createdAt) {
        this.email = email;
        this.password = password;
        this.id = id;
        this.createdAt = createdAt;
    }
}
exports.UserModel = UserModel;
