require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;

async function synthesizeSpeech(inputText) {
  const apiKey = process.env.API_KEY;
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const requestPayload = {
    input: { text: inputText },
    voice: { languageCode: 'pl-PL', name: 'pl-PL-Wavenet-B' },
    audioConfig: {
      audioEncoding: 'MP3', // Change the encoding to MP3
      pitch: -1.5,
      speakingRate: 0.7,
    },
  };

  try {
    const response = await axios.post(url, requestPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const outputFile = 'output.mp3'; // Change the file extension back to .mp3 for MP3 encoding
    const audioContent = response.data.audioContent;
    fs.writeFileSync(outputFile, audioContent, 'base64');
    console.log(`Audio content written to file: ${outputFile}`);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

if (argv._.length > 0) {
  const inputFilePath = argv._[0];
  const inputText = fs.readFileSync(inputFilePath, 'utf8');
  synthesizeSpeech(inputText);
} else {
  console.error('Please provide a valid input text file.');
}
