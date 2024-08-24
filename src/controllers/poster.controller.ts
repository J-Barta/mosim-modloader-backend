import {Request, Response} from "express";
import {ModPoster} from "../entity/ModPoster";
import {AppDataSource} from "../data-source";
import {generateSafeRandomToken, stringToHash} from "../util/AuthUtil";
import {instanceToPlain} from "class-transformer";
import {sendVerificationEmail} from "../util/mailjet";
import configJson from "../../config.json";


export const getUserFromToken = async (req: Request, res: Response) => {
    const user = await ModPoster.getPosterFromRandomToken(req.query.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    user.modIds = user.getModIds();

    return res.status(200).send(instanceToPlain(user));
}

export const createUser = async (req: Request, res: Response) => {
    let poster = new ModPoster();

    const users = await AppDataSource.manager
        .createQueryBuilder(ModPoster, "poster")
        .getMany();

    poster.randomToken = generateSafeRandomToken(users.map(e => e.randomToken));

    poster.name = req.query.name;
    poster.email = req.query.email;
    poster.verified = false;
    poster.passwordHash = stringToHash(req.query.password);

    poster.roles = [];
    if (configJson.admin_user === poster.email) poster.roles = ['admin'];

    poster.mods = [];

    poster.created_at = new Date(Date.now());
    poster.updated_at = new Date(Date.now());

    //Send verification email to the user
    let responseStatus = await sendVerificationEmail(poster.email, poster.name, poster.randomToken)

    console.log(responseStatus);

    await AppDataSource.manager.save(poster);

    const userPlain = instanceToPlain(poster);

    return res.status(200).json(userPlain);
}

export const changeUserName = async (req: Request, res: Response) => {
    const user = await ModPoster.getPosterFromRandomToken(req.query.token as string)

    if (!user) {
        return res.status(404).send("User not found");
    }

    if (req.query.name === "") return res.status(400).send("Name cannot be empty");

    user.name = req.query.name as string;

    await AppDataSource.manager.save(user);

    return res.status(200).send("Name changed");

}

export const sendVerificationEndpoint = async (req: Request, res: Response) => {
    const poster = await ModPoster.getPosterFromRandomToken(req.query.email as string)

    if (!poster) {
        return res.status(404).send("User not found");
    }

    let responseStatus = await sendVerificationEmail(poster.email, poster.name, poster.randomToken)

    return res.status(200).send("Email sent");
}

export const verifyUser = async (req: Request, res: Response) => {
    const poster = await ModPoster.getPosterFromRandomToken(req.query.token as string)

    if (!poster) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }

    poster.verified = true;

    await AppDataSource.manager.save(poster);

    //Return a success message (user verified)
    return res.status(200).send("User verified");
}

export const authenticateUser = async (req: Request, res: Response) => {
    const poster = await ModPoster.getPosterFromEmail(req.query.email as string)

    if (!poster) {
        return res.status(404).send("User not found");
    }

    if (poster.passwordHash !== stringToHash(req.query.password)) return res.status(403).send("Invalid token");

    if (!poster.verified) return res.status(403).send("User not verified");

    await AppDataSource.manager.save(poster);

    poster.modIds = poster.getModIds();

    return res.status(200).send(poster);
}

export const deleteUser = async (req: Request, res: Response) => {
    const userToDelete = await ModPoster.getPosterFromEmail(req.query.email as string)

    const userRequesting = await ModPoster.getPosterFromRandomToken(req.headers.token as string)

    if (!userToDelete) {
        return res.status(404).send("User not found");
    } else if (!userRequesting) {
        return res.status(404).send("Requesting user not found");
    }

    if (userRequesting.roles.includes("admin")) {
    } else {
        if(req.query.password) {
            if (userToDelete.passwordHash !== stringToHash(req.query.password)) {
                return res.status(403).send("Incorrect Password");
            }
        } else if (userToDelete.randomToken !== req.query.token) {
            return res.status(403).send("Incorrect Password");
        } else if (userRequesting.id !== userToDelete.id) {
            return res.status(403).send("Unauthorized");
        }
    }

    await AppDataSource.manager.remove(userToDelete);

    return res.status(200).send("User deleted");
}


export const cancelUser = async (req: Request, res: Response) => {
    const poster = await ModPoster.getPosterFromRandomToken(req.query.token as string)

    if (!poster) {
        //Return an error message (could not find user to verify)
        return res.status(404).send("User not found");
    }

    await AppDataSource.manager.remove(poster);

    //Return a success message (user verified)
    return res.status(200).send("User removed");
}
