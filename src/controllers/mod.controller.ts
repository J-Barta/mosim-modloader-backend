import {Request, Response} from 'express';
import {Mod} from "../entity/Mod";
import {ModPoster} from "../entity/ModPoster";
import {AppDataSource} from "../data-source";
import {instanceToPlain} from "class-transformer";
import {sendModApprovalNotification, sendModUploadRequest} from "../util/mailjet";
import configJson from "../../config.json";
import {ModUpdate} from "../entity/ModUpdate";

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

    ModPoster.getAllAdmins().then(admin => {
        sendModUploadRequest(admin.email, mod);
    })

    return res.status(200).send(mod);
}

export const requestModUpdate = async (req: Request, res: Response) => {
    let user = await ModPoster.getPosterFromRandomToken(req.headers.token);

    if (!user) {
        return res.status(404).send("User not found");
    } else if (!user.verified) {
        return res.status(401).send("User not verified");
    }

    let mod = await AppDataSource.manager
        .createQueryBuilder(Mod, "mod")
        .where("mod.id = :id", {id: req.body.id})
        .leftJoinAndSelect("mod.poster", "poster")
        .leftJoinAndSelect("mod.update", "update")
        .getOne();

    if (!mod) {
        return res.status(404).send("Mod not found");
    }
    if (mod.poster.id !== user.id) {
        return res.status(401).send("You don't own this mod! How naughty!");
    }

    let update = new ModUpdate();

    update.mod = mod;
    mod.update = update;

    if (req.body.name !== mod.name) {
        update.name = req.body.name;
    }

    if (req.body.description !== mod.description) {
        update.description = req.body.description;
    }

    if (req.body.robots.join(",") !== mod.robots.join(",")) {
        update.robots = req.body.robots;
    }

    if (req.body.version !== mod.version) {
        update.version = req.body.version;
    }

    if (req.body.baseSimVersion !== mod.baseSimVersion) {
        update.baseSimVersion = req.body.baseSimVersion;
    }

    if (req.body.link !== mod.link) {
        update.link = req.body.link;
    }

    if (req.body.thumbnail !== mod.thumbnail) {
        update.thumbnail = req.body.thumbnail;
    }

    if (req.body.sourceCode !== mod.sourceCode) {
        update.sourceCode = req.body.sourceCode;
    }

    if (req.body.windowsPath !== mod.windowsPath) {
        update.windowsPath = req.body.windowsPath;
    }

    if (req.body.linuxPath !== mod.linuxPath) {
        update.linuxPath = req.body.linuxPath;
    }

    if (req.body.macPath !== mod.macPath) {
        update.macPath = req.body.macPath;
    }

    update.created = new Date(Date.now());

    ModPoster.getAllAdmins().then(admin => {
        sendModUploadRequest(admin.email, mod);
    })

    await AppDataSource.manager.save(update);

    return res.status(200).send(instanceToPlain(mod));
}

export const rejectModUpdate = async (req: Request, res: Response) => {
    let user = await ModPoster.getPosterFromRandomToken(req.headers.token);

    if (!user) {
        return res.status(404).send("User not found");
    } else if (!user.verified) {
        return res.status(401).send("User not verified");
    } else if (!user.isAdmin()) {
        return res.status(401).send("User not admin");
    }

    let mod = await AppDataSource.manager
        .createQueryBuilder(Mod, "mod")
        .where("mod.id = :id", {id: req.query.id})
        .leftJoinAndSelect("mod.poster", "poster")
        .leftJoinAndSelect("mod.update", "update")
        .getOne();

    let update = mod.update

    if (!update) {
        return res.status(404).send("Update not found");
    } if (update.id != req.query.updateId) {
        return res.status(401).send("Update doesn't match");
    }

    mod.update = null;

    await AppDataSource.manager.save(mod);

    return res.status(200).send(mod);
}

export const approveModUpdate = async (req: Request, res: Response) => {
    let user = await ModPoster.getPosterFromRandomToken(req.headers.token);

    if (!user) {
        return res.status(404).send("User not found");
    } else if (!user.verified) {
        return res.status(401).send("User not verified");
    } else if (!user.isAdmin()) {
        return res.status(401).send("User not admin");
    }

    let mod = await AppDataSource.manager
        .createQueryBuilder(Mod, "mod")
        .where("mod.id = :id", {id: req.query.id})
        .leftJoinAndSelect("mod.poster", "poster")
        .leftJoinAndSelect("mod.update", "update")
        .getOne();

    let update = mod.update

    if (!update) {
        return res.status(404).send("Update not found");
    } if (update.id != req.query.updateId) {
        return res.status(401).send("Update doesn't match");
    }

    mod.update = null;

    if (update.name) {
        mod.name = update.name;
    }
    if (update.description) {
        mod.description = update.description;
    }
    if (update.robots) {
        mod.robots = update.robots;
    }
    if (update.version) {
        mod.version = update.version;
    }
    if (update.baseSimVersion) {
        mod.baseSimVersion = update.baseSimVersion;
    }
    if (update.link) {
        mod.link = update.link;
    }
    if (update.thumbnail) {
        mod.thumbnail = update.thumbnail;
    }
    if (update.sourceCode) {
        mod.sourceCode = update.sourceCode;
    }
    if (update.windowsPath) {
        mod.windowsPath = update.windowsPath;
    }
    if (update.linuxPath) {
        mod.linuxPath = update.linuxPath;
    }
    if (update.macPath) {
        mod.macPath = update.macPath;
    }

    mod.updatedAt = update.created;

    await AppDataSource.manager.save(mod);

    sendModApprovalNotification(mod.poster.email, mod);

    return res.status(200).send(mod);
}

export const checkAvailability = async (req: Request, res: Response) => {
    if (await Mod.isNameAvailable(req.query.name)) {
        return res.status(200).send({name: req.query.name, available: true});
    } else {
        return res.status(200).send({name: req.query.name, available: false});
    }
}

export const getAllMods = async (req: Request, res: Response) => {
    let mods = await AppDataSource.manager
        .createQueryBuilder(Mod, "mod")
        .leftJoinAndSelect("mod.poster", "poster")
        .leftJoinAndSelect("mod.update", "update")
        .getMany();

    return res.status(200).send(instanceToPlain(mods));
}

let addingDownload = false;

export const addDownload = async (req: Request, res: Response) => {
    while (addingDownload) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    addingDownload = true;
    let mod = await AppDataSource.manager.createQueryBuilder(Mod, "mod").where("mod.id = :id", {id: req.query.id}).getOne();

    if (mod.downloads == null) {
        mod.downloads = 0;
    }

    mod.downloads += 1;
    await AppDataSource.manager.save(mod);

    addingDownload = false;

    return res.status(200).send(mod)
}

export const verifyMod = async (req: Request, res: Response) => {
    let mod = await AppDataSource.manager
        .createQueryBuilder(Mod, "mod")
        .where("mod.id = :id", {id: req.query.id})
        .leftJoinAndSelect("mod.poster", "poster")
        .getOne();

    if (!mod) {
        return res.status(404).send("Mod not found");
    }

    let user = await ModPoster.getPosterFromRandomToken(req.headers.token);

    if (!user) {
        return res.status(404).send("User not found");
    } else if (!user.verified) {
        return res.status(401).send("User not verified");
    } else if (!user.isAdmin()) {
        return res.status(401).send("User not admin");
    }

    mod.verified = true;
    await AppDataSource.manager.save(mod);

    sendModApprovalNotification(mod.poster.email, mod);

    return res.status(200).send(mod);
}
