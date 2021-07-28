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
  entryArray: [
    {
      content: String,
      timestamp: Date,
      _id: mongoose.Types.ObjectId,
    },
  ],
});

const User = mongoose.model("User", userSchema, "UserEntry");

// routes to /user. This is the main page the user sees after authenticating.
router
  .route("/")
  .get((req: express.Request, res: express.Response) => {
    const userId = req.query.uid;
    let date = null;

    if (req.query && req.query.d) {
      date = req.query.d;
    }

    console.log(userId);
    console.log(date);

    User.findById(userId, (err: mongoose.NativeError, userInfo) => {
      if (err) {
        console.log(err);
        res.send("/error/unregistered");
      } else {
        if (date !== null) {
          const checkDate = new Date(date).toLocaleDateString();
          res.render("user", {
            uid: userId,
            uname: userInfo.username,
            entries: userInfo.entryArray.filter((item) => {
              const itemDate = new Date(item.timestamp).toLocaleDateString();
              return itemDate === checkDate;
            }),
          });
        } else {
          res.render("user", {
            uid: userId,
            uname: userInfo.username,
            entries: userInfo.entryArray,
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

  console.log(entryId);

  User.findById(paramId, (err: mongoose.NativeError, post) => {
    if (err) {
      console.error(err);
    } else {
      res.render("post", {
        posts: post.entryArray.filter((item) => {
          return item._id.toString() === entryId;
        }),
      });
    }
  });
});

module.exports = router;
