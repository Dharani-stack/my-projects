import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  IconButton,
  Typography,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  MicNone,
  MicOff,
  Refresh,
  VolumeUp,
  VolumeOff,
  Translate
} from "@mui/icons-material";


import { useSpeech } from "react-text-to-speech";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import languages from "./languages.json";
import TextField from "./components/TextField";
import InputBase from "./components/InputBase";


const defaultValues = {
  fromLanguage: { code: "en-US", name: "English" },
  toLanguage: { key: "en", label: "English" },
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
    console.log("Initial 'translator' state:", translator);
    console.log("Initial 'data' state:", data);
  }, []);

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

        setData(transformedData, console.log(transformedData));
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
    event.preventDefault(translator);
    const data = {
      text: translator.enteredText || transcript,
      fromLanguage: translator.fromLanguage.code,
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
        // Display error message to user
        alert("Translation failed: " + error.message);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      // height="100vh"
      mt={5}
      width="100%"
      gap={2}
    >
      <Typography variant="h5">Translator <Translate sx={{color:'blue'}} /></Typography>

      <Stack gap={2}>
        <Stack
        //  alignItems="center"
          justifyContent="center" gap={10} direction={"row"}>
          <Stack>
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
                <TextField
                  {...params}
                  variant="standard"
                  label="Choose your language"
                />
              )}
            />
          </Stack>

          <Stack>
            <InputBase
              label="Enter text ..."
              Autocomplete
              multiline
              value={translator.enteredText || transcript}
              onChange={(e) => {
                resetTranscript();
                setTranslator((prev) => ({
                  ...prev,
                  enteredText: e.target.value,
                }));
              }}
              InputProps={{
                style: { fontSize: '20px' },
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={toggleListening}>
                      {isListening ? (
                        <Tooltip title="Turn off mic">
                          <MicOff sx={{ color: "red" }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Turn on Mic">
                          <MicNone />
                        </Tooltip>
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
        <Stack sx={{ gap: "10rem" }} >
          <Stack
            direction="row"
            // alignItems="center"
            justifyContent="center"
            gap={10}
          >
            <Autocomplete
              value={translator.toLanguage}
              options={data || []}
              onChange={(_, value) => {
                console.log(
                  "Previous 'toLanguage' value:",
                  translator.toLanguage
                );
                console.log("New 'toLanguage' value:", value);

                setTranslator((prev) => {
                  const newValue = value || defaultValues.toLanguage;
                  console.log("Updated 'toLanguage' value:", newValue);
                  return { ...prev, toLanguage: newValue };
                });
              }}
              sx={{ width: 300, mb: 2 }}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="Choose language to translate" />
              )}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) => option.key === value.key}
            />

            <InputBase
              label="Translated text"
              value={translator.translatedText}
              multiline
              readOnly
              InputProps={{
                style: { fontSize: '25px' },
                startAdornment: (
                  <InputAdornment position="start">
                    {speechStatus !== "started" ? (
                      <IconButton
                        disabled={!translator.translatedText}
                        onClick={start}
                      >
                        <Tooltip title="Listen">
                        <VolumeUp />
                        </Tooltip>
                      </IconButton>
                    ) : (
                      <IconButton onClick={stop}>
                       <Tooltip title="Turn off">
                        <VolumeOff sx={{color:'red'}} />
                        </Tooltip>

                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row"  justifyContent="center" alignItems="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginRight: "0.75rem"}}
        >
          Translate
        </Button>

        <IconButton variant="outlined">
          <Tooltip title="Refresh">
          <Refresh
            onClick={() => {
              resetTranscript();
              setTranslator(defaultValues);
            }}
            sx={{ color: "#2196f3" }}
          />
          </Tooltip>
        </IconButton>
      </Stack>
      {!browserSupportsSpeechRecognition && (
        <div>Browser doesn't support speech recognition.</div>
      )}
    </Stack>
  );
}

export default App;
