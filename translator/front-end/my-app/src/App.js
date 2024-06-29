import React, { useState, useEffect } from "react";
import { Button, Stack, IconButton } from "@mui/material";
import { MicNone, MicOff, Refresh, VolumeUp, VolumeOff } from "@mui/icons-material";

import { useSpeech } from "react-text-to-speech";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import languages from "./languages.json";
import TextField from "./components/TextField";

const defaultValues = {
  fromLanguage: { code: "en-US", name: "English" },
  toLanguage: "English",
  enteredText: "",
  translatedText: "",
};

function App() {
  const [translator, setTranslator] = useState(defaultValues);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const { speechStatus, start, stop } = useSpeech({
    text: translator.translatedText,
    lang: "hi-IN",
    voiceURI: "Google IN English",
  });

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (isListening) {
      setTranslator((prev) => ({ ...prev, enteredText: "" }));
      SpeechRecognition.startListening({
        continuous: true,
        language: translator.fromLanguage.code,
      });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isListening, translator.fromLanguage]);

  useEffect(() => {
    getLanguages();
  }, []);

  const getLanguages = () => {
    axios
      .get("http://localhost:8000/api/supported-languages")
      .then((response) => {
        const languages = response.data.supportedLanguages;
        const transformedData = Object.keys(languages).map((key) => ({
          key: key,
          label: languages[key],
        }));
        setData(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      text: translator.enteredText || transcript,
      fromLanguage: translator.fromLanguage.key,
      toLanguage: translator.toLanguage.key,
    };
    axios
      .post("http://localhost:8000/api/translate", data)
      .then((response) => {
        setTranslator((prev) => ({
          ...prev,
          translatedText: response.data.translation,
        }));
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100%"
      gap={2}
    >
      <Stack direction="row" gap={2}>
        <Stack alignItems="center" justifyContent="center">
          <IconButton onClick={toggleListening}>
            {isListening ? <MicOff sx={{ color: "red" }} /> : <MicNone />}
          </IconButton>
        </Stack>
        <Stack>
          <Stack direction="row" gap={2}>
            <Autocomplete
              value={translator.fromLanguage}
              options={Object.entries(languages).map(([code, name]) => ({
                code,
                name,
              }))}
              onChange={(event, value) => {
                resetTranscript();
                setTranslator((prev) => ({ ...prev, fromLanguage: value }));
              }}
              sx={{ width: 300, mb: 2 }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) =>
                option.code === value.code
              }
              renderInput={(params) => (
                <TextField {...params} label="Speech Language" />
              )}
            />
            <Autocomplete
              value={translator.toLanguage}
              options={data}
              onChange={(_, value) =>
                setTranslator((prev) => ({ ...prev, toLanguage: value }))
              }
              sx={{ width: 300, mb: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="To language" />
              )}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <TextField
              label="Enter some text"
              variant="outlined"
              Autocomplete
              value={translator.enteredText || transcript}
              onChange={(e) => {
                resetTranscript();
                setTranslator((prev) => ({
                  ...prev,
                  enteredText: e.target.value,
                }));
              }}
            />

            <TextField
              label="Translated text"
              variant="outlined"
              value={translator.translatedText}
              multiline
              InputLabelProps={{ shrink: true }}
              readOnly
            />
            {speechStatus !== "started" ? (
              <Button disabled={!translator.translatedText} onClick={start}>
                <VolumeUp />
              </Button>
            ) : (
              <Button onClick={stop}>
                <VolumeOff />
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginRight: "0.75rem" }}
        >
          Translate
        </Button>

        <IconButton variant="outlined">
          <Refresh
            onClick={() => {
              resetTranscript();
              setTranslator(defaultValues);
            }}
            sx={{ color: "#2196f3" }}
          />
        </IconButton>
      </Stack>
      {!browserSupportsSpeechRecognition && (
        <div>Browser doesn't support speech recognition.</div>
      )}
    </Stack>
  );
}

export default App;
