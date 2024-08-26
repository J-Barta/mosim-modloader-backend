import "reflect-metadata"
import { DataSource } from "typeorm"
import {ModPoster} from "./entity/ModPoster";
import {Mod} from "./entity/Mod";
import {ModUpdate} from "./entity/ModUpdate";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "mosim",
  database: "mosim-modloader",
  synchronize: true,
  logging: false,
  entities: [Mod, ModPoster, ModUpdate],
  subscribers: [],
  migrations: [],
})
