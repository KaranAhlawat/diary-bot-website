import express = require("express");
import mongoose = require("mongoose");

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://Karan:DqFZv45zzXeRVz6@diary-db.3fg7h.mongodb.net/Entry",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

interface EntryType {
  content: string;
  timestamp: Date;
}

interface UserType {
  _id: number;
  username: string;
  entries?: EntryType[];
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
  entries: [
    {
      content: String,
      timestamp: Date,
    },
  ],
});

const User = mongoose.model("User", userSchema, "UserEntry");

// routes to /user. This is the main page the user sees after authenticating.
router
  .route("/")
  .get((req: express.Request, res: express.Response) => {
    const userId = req.query.uid;
    let date = "";
    if (req.query && req.query.d) {
      date = (req.query as any).d;

      User.find(
        { _id: userId },
        (err: mongoose.NativeError, userInfo: UserType) => {
          if (err) {
            console.log(err);
            res.send("/error/unregistered");
          } else {
            res.render("user", {
              uid: userId,
              uname: userInfo.username,
              entries: userInfo.entries,
            });
          }
        }
      );
    }

    console.log(userId);
    console.log(date);

    User.findById(userId, (err: mongoose.NativeError, userInfo) => {
      if (err) {
        console.log(err);
        res.send("/error/unregistered");
      } else {
        res.render("user", {
          uid: userId,
          uname: userInfo.username,
          entries: userInfo.entries,
        });
      }
    });
  })
  .post((req: express.Request, res: express.Response) => {
    const date = encodeURIComponent(req.body.selectedDate);
    const paramId = req.query.uid;

    res.redirect(`/user?uid=${paramId}&d=${date}`);
  });

module.exports = router;
