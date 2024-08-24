import {Request, Response} from 'express';
import {Mod} from "../entity/Mod";
import {ModPoster} from "../entity/ModPoster";
import {AppDataSource} from "../data-source";
import Poster from "../routes/poster";
import {instanceToPlain} from "class-transformer";

export const createMod = async (req: Request, res: Response) => {
    let user = await ModPoster.getPosterFromRandomToken(req.headers.token);

    if (!user) {
        return res.status(404).send("User not found");
    } else if (!user.verified) {
        return res.status(401).send("User not verified");
    }

    let mod = new Mod();

    mod.name = req.body.name;
    mod.robots = req.body.robots;
    mod.description = req.body.description;
    mod.verified = false;
    mod.sourceCode = req.body.sourceCode;
    mod.version = req.body.version;
    mod.baseSimVersion = req.body.baseSimVersion;
    mod.link = req.body.link;
    mod.thumbnail = req.body.thumbnail;

    mod.poster = user;

    mod.windowsPath = req.body.windowsPath;
    mod.linuxPath = req.body.linuxPath;
    mod.macPath = req.body.macPath;

    mod.createdAt = new Date(Date.now());
    mod.updatedAt = new Date(Date.now());

    await AppDataSource.manager.save(mod);

    return res.status(200).send(mod);
}

export const checkAvailability = async (req: Request, res: Response) => {
    if (await Mod.isNameAvailable(req.query.name)) {
        return res.status(200).send({name: req.query.name, available: false});
    } else {
        return res.status(200).send({name: req.query.name, available: true});
    }
}

export const getAllMods = async (req: Request, res: Response) => {
    let mods = await AppDataSource.manager.createQueryBuilder(Mod, "mod").leftJoinAndSelect("mod.poster", "poster").getMany();

    return res.status(200).send(instanceToPlain(mods));
}

export const addDownload = async (req: Request, res: Response) => {
    let mod = await AppDataSource.manager.createQueryBuilder(Mod, "mod").where("mod.id = :id", {id: req.query.id}).getOne();

    if (mod.downloads == null) {
        mod.downloads = 0;
    }

    mod.downloads += 1;
    await AppDataSource.manager.save(mod);

    return res.status(200).send(mod)
}
