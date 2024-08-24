import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ModPoster} from "./ModPoster";
import {AppDataSource} from "../data-source";

@Entity()
export class Mod {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({array: true, type: "text"})
    robots: string[];

    @Column()
    verified: boolean;

    @Column()
    version: string;

    @Column()
    baseSimVersion: string;

    @Column()
    link: string;

    @Column()
    thumbnail: string;

    @Column()
    sourceCode: string;

    @Column()
    windowsPath: string;

    @Column()
    linuxPath: string;

    @Column()
    macPath: string;

    @ManyToOne(() => ModPoster, modPoster => modPoster.mods)
    poster:ModPoster;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({default: 0})
    downloads: number;

    static async isNameAvailable(name:string) {
        let mods = await AppDataSource.manager.createQueryBuilder(Mod, "mod").getMany();

        let names = mods.map(e => e.name);

        return !names.includes(name)
    }
}