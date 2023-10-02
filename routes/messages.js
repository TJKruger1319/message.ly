const Router = require("express").Router;
const Message = require("../models/message");
const {ensureCorrectUser} = require("../middleware/auth");

const router = new Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
Router.get("/:id", ensureCorrectUser, async function(req, res, next){
    try {
        const message = await Message.get(req.params.id);
        return res.json({message});
    } catch(e) {
        return next(e);
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
Router.post("/", ensureCorrectUser, async function(req, res, next){
    try {
        const {from_username, to_username, body} = req.body;
        const message = await Message.create(from_username, to_username, body);
        return res.json({message});
    } catch(e) {
        return next(e);
    }
})



/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
Router.post("/:id/read", ensureCorrectUser, async function(req, res, next){
    try {
        const message = await Message.markRead(req.params.id);
        return res.json({message});
    } catch(e) {
        return next(e);
    }
})
