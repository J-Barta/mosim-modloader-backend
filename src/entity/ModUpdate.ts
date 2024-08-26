import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Mod} from "./Mod";
import {Exclude} from "class-transformer";


@Entity()
export class ModUpdate {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Mod, mod => mod.update)
    @Exclude()
    mod:Mod

    @Column({nullable: true})
    name: string

    @Column({nullable: true})
    description: string;

    @Column({array: true, type: "text", nullable: true})
    robots: string[];

    @Column({nullable: true})
    version: string;

    @Column({nullable: true})
    baseSimVersion: string;

    @Column({nullable: true})
    link: string;

    @Column({nullable: true})
    thumbnail: string;

    @Column({nullable: true})
    sourceCode: string;

    @Column({nullable: true})
    windowsPath: string;

    @Column({nullable: true})
    linuxPath: string;

    @Column({nullable: true})
    macPath: string;

    @Column()
    created: Date;
}