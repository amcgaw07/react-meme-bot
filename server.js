const thesaurus = require("thesaurus");
const Twit = require("twit"),
  fs = require("fs"),
  path = require("path"),
  config = require(path.join(__dirname, "config.js"));

const T = new Twit(config);

//standard emotion types which correspond to the image libraries
const stdEmotions = ["angry", "sad", "confused", "afraid", "happy", "funny"];

//compare requested emotion against synonyms of the standard emotions to see if there is a match, if not return x
function isValidEmotion(emotion) {
  if (emotion.length === 1) return "x"; //invalid input, return instruction string
  for (const validEmotion of stdEmotions) {
    const validEmotionSyn = thesaurus.find(validEmotion);
    if (validEmotionSyn.indexOf(emotion) > -1) return validEmotion;
  }
  return "x"; //bot will return instructions on x command
}

//setup stream to wait for user mentions
let stream = T.stream("statuses/filter", { track: "@reactmemebot" });
stream.on("tweet", tweetEvent);

//Function called when bot is mentioned
function tweetEvent(eventMsg) {
  //grab user who sent tweet to bot
  const replyFrom = "@" + eventMsg.user.screen_name;
  //grab id of tweet to reply to
  const id = eventMsg.id_str;
  //grab requested emotion for reaction meme
  const emotion = eventMsg.text
    .split(" ")
    .filter((str) => !str.includes("@"))[0];

  //check if the emotion is valid
  const verifiedEmotion = isValidEmotion(emotion.toLowerCase());

  tweetRandomImage(replyFrom, id, verifiedEmotion);
}

const randomFromArray = (images) => {
  return images[Math.floor(Math.random() * images.length)];
};

const tweetRandomImage = (replyFrom, id, emotion) => {
  if (emotion === "x") {
    T.post(
      "statuses/update",
      {
        status: `${replyFrom} usable emotions are ${stdEmotions.join(
          ", "
        )} and their synonyms`,
        in_reply_to_status_id: id,
      },
      function (err, data, response) {
        if (err) {
          console.log("error:", err);
        } else {
          console.log("returned instructions");
        }
      }
    );
  } else {
    fs.readdir(__dirname + `/images/${emotion}/`, function (err, files) {
      if (err) {
        console.log("error:", err);
      } else {
        let images = [];
        files.forEach(function (f) {
          images.push(f);
        });

        console.log("opening an image");

        const imagePath = path.join(
            __dirname,
            `/images/${emotion}/` + randomFromArray(images)
          ),
          b64content = fs.readFileSync(imagePath, { encoding: "base64" });
        console.log("uploading an image");

        T.post(
          "media/upload",
          { media_data: b64content },
          function (err, data, response) {
            if (err) {
              console.log("error:", err);
            } else {
              const image = data;
              console.log("image uploaded, adding description...");

              T.post(
                "media/metadata/create",
                {
                  media_id: image.media_id_string,
                  alt_text: {
                    text: emotion,
                  },
                },
                function (err, data, response) {
                  console.log("tweeting the image...");
                  console.log(id);

                  T.post(
                    "statuses/update",
                    {
                      status: replyFrom,
                      media_ids: [image.media_id_string],
                      in_reply_to_status_id: id,
                    },
                    function (err, data, response) {
                      if (err) {
                        console.log("error:", err);
                      } else {
                        console.log("posted an image");
                      }
                    }
                  );
                }
              );
            }
          }
        );
      }
    });
  }
};

//tweet random image every 10 seconds
// setInterval(() => {
//   tweetRandomImage();
// }, 10000);

//basic posting structure
// T.post(
//   "statuses/update",
//   { status: "Look, I am Tweeting!" },
//   function (err, data, response) {
//     console.log(data);
//   }
// );
