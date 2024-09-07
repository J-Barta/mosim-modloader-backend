import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Mod} from "./Mod";
import {Exclude} from "class-transformer";
import {AppDataSource} from "../data-source";

@Entity()
export class ModPoster {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    randomToken: string;

    @Column()
    verified: boolean;

    @Column()
    @Exclude()
    passwordHash: string;

    @Column({array: true, type: "text"})
    roles: string[];

    @OneToMany(() => Mod, mod => mod.poster)
    @Exclude()
    mods: Mod[];

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    modIds: number[];

    isAdmin() {
        return this.roles.includes("admin");
    }

    getModIds() {
        return this.mods.map(e => e.id);
    }

    static async getPosterFromEmail(email:string) {
        return await AppDataSource.manager
            .createQueryBuilder(ModPoster, "poster")
            .leftJoinAndSelect("poster.mods", "mods")
            .where("poster.email = :email", {email: email})
            .getOne();
    }

    static async getPosterFromId(id:string) {
        return await AppDataSource.manager
            .createQueryBuilder(ModPoster, "poster")
            .leftJoinAndSelect("poster.mods", "mods")
            .where("poster.id = :id", {id: id})
            .getOne();
    }

    static async getPosterFromRandomToken(token:string) {
        return await AppDataSource.manager
            .createQueryBuilder(ModPoster, "poster")
            .leftJoinAndSelect("poster.mods", "mods")
            .where("poster.randomToken = :token", {token: token})
            .getOne();
    }

    static async getAllAdmins():Promise<ModPoster[]> {
        let users = await  AppDataSource.manager
            .createQueryBuilder(ModPoster, "poster")
            .getMany();

        users = users.filter(e => e.isAdmin());

        return users;
    }

    //Is name available
    static async isNameAvailable(name:string) {
        let posters = await AppDataSource.manager.createQueryBuilder(ModPoster, "poster").getMany();

        let names = posters.map(e => e.name);

        return !names.includes(name)
    }

    //Is email available
    static async isEmailAvailable(email:string) {
        let posters = await AppDataSource.manager.createQueryBuilder(ModPoster, "poster").getMany();

        let emails = posters.map(e => e.email);

        return !emails.includes(email)
    }
}