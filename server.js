const express = require("express");
const fs = require("fs");
const util = require("util");
const ejs = require("ejs");
const path = require("path");
const shortid = require("shortid");

const textToSpeech = require("@google-cloud/text-to-speech");
const app = express();
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const client = new textToSpeech.TextToSpeechClient();

app.post("/generateAudio", async (req, res) => {
  const promptArray = req.body.promptArray;
  const audioFolder = `./public/audio/${shortid.generate()}`;

  fs.mkdir(audioFolder, (err) => {
    if (err) {
      throw err;
    }
  });

  const generatedFiles = [];
  async function generateAudioFiles(array, index) {
    try {
      let fileName = array[0];
      let prompt = array[1];

      const request = {
        audioConfig: {
          audioEncoding: "LINEAR16",
          effectsProfileId: ["telephony-class-application"],
          pitch: 0,
          speakingRate: 1,
        },
        input: {
          text: prompt,
        },
        voice: {
          languageCode: "nl-NL",
          name: "nl-NL-Wavenet-D",
        },
      };

      const [response] = await client.synthesizeSpeech(request);
      const writeFile = util.promisify(fs.writeFile);
      await writeFile(
        `${audioFolder}/${fileName}.alaw`,
        response.audioContent,
        "binary"
      );
      console.log(`Audio content written to file: ${fileName}`);
      generatedFiles.push(fileName);
      console.log(generatedFiles);
    } catch (error) {
      console.log(json(error));
    }
  }

  await Promise.all(promptArray.map(generateAudioFiles));

  res.json({ folder: audioFolder, filenames: generatedFiles });
});

// async function generateAudio(text, cb) {
//   let fileName = shortid.generate();
//   const request = {
//     audioConfig: {
//       audioEncoding: "LINEAR16",
//       effectsProfileId: ["telephony-class-application"],
//       pitch: 0,
//       speakingRate: 1,
//     },
//     input: {
//       text: text,
//     },
//     voice: {
//       languageCode: "nl-NL",
//       name: "nl-NL-Wavenet-D",
//     },
//   };

//   try {
//     const [response] = await client.synthesizeSpeech(request);
//     console.log(response);
//     const writeFile = util.promisify(fs.writeFile);
//     await writeFile(
//       `./public/audio/${fileName}.alaw`,
//       response.audioContent,
//       "binary"
//     );
//     console.log(`Audio content written to file: ${fileName}`);
//     cb(fileName);
//   } catch (error) {
//     console.log(error);
//   }
// }

app.get("/", (req, res) => res.render("index"));

app.listen(5000, () => console.log("listening on port 5000"));
