import { User } from "../entity/User";
import { getConnection, getRepository } from "typeorm";
import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server-express";

interface IUserObject {
    imageUrl: string;
    username: string;
}

export class UserController extends DataSource {
    async registerUser(userObject: IUserObject) {
        const user = new User();
        user.imageUrl = userObject.imageUrl;
        user.username = userObject.username;

        try {
            const insertedUser = await getConnection().manager.save(user);
            return insertedUser;
        } catch (error: any) {
            if (error.code === "SQLITE_CONSTRAINT") {
                throw new UserInputError("Username já existe");
            }
        }
    }

    async getUser(id: any) {
        try {
            const filteredUser = await getConnection()
                .getRepository(User)
                .findOne({ id: id });
            return filteredUser;
        } catch (error) {
            console.log("error: ", error);
            throw new Error("Erro interno");
        }
    }

    async updateUserImage(username: string, imageUrl: string) {
        try {
            const user = await getConnection()
                .getRepository(User)
                .findOne({ username });
            if (user) {
                user.imageUrl = imageUrl;
                const updatedUser = await getConnection()
                    .getRepository(User)
                    .save(user);
                return updatedUser;
            }

            throw new Error();
        } catch (error) {
            console.log("error: ", error);
            throw new UserInputError("Username não encontrado");
        }
    }
}
