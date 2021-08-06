import express = require("express");
import mongoose = require("mongoose");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_SERVER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

interface UserType {
  _id: number;
  username: string;
  Entry?: [];
}

const userSchema = new mongoose.Schema<UserType>({
  _id: {
    type: Number,
    require: true,
  },
  username: {
    type: String,
    required: true,
  },
  Entry: [],
});

const User = mongoose.model<UserType>("User", userSchema, "UserEntry");

// routes to /user. This is the main page the user sees after authenticating.
router
  .route("/")
  .get((req: express.Request, res: express.Response) => {
    const userId = req.query.uid;
    let date = null;

    if (req.query && req.query.d) {
      date = req.query.d;
    }

    User.findById(userId, (err: mongoose.NativeError, userInfo: UserType) => {
      if (err) {
        console.log(err);
        res.send("/error/unregistered");
      } else {
        if (date !== null) {
          const checkDate = new Date(date).toLocaleDateString();
          res.render("user", {
            uid: userId,
            uname: userInfo.username,
            entries: userInfo.Entry.filter((item) => {
              const itemDate = Object.keys(item)[0];
              const extractedDate = new Date(itemDate).toLocaleDateString();
              return extractedDate === checkDate;
            }),
          });
        } else {
          res.render("user", {
            uid: userId,
            uname: userInfo.username,
            entries: userInfo.Entry,
          });
        }
      }
    });
  })
  .post((req: express.Request, res: express.Response) => {
    const date = encodeURIComponent(req.body.selectedDate);
    const paramId = req.query.uid;

    res.redirect(`/user?uid=${paramId}&d=${date}`);
  });

router.get("/entry/:entryId", (req: express.Request, res: express.Response) => {
  const entryId = req.params.entryId;
  const paramId = req.query.uid;

  User.findById(paramId, (err: mongoose.NativeError, post: UserType) => {
    if (err) {
      console.error(err);
    } else {
      res.render("post", {
        posts: post.Entry.filter((item) => {
          return Object.keys(item)[0] === entryId;
        }),
      });
    }
  });
});

module.exports = router;
