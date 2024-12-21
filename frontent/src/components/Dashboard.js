import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  Input,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Dashboard() {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quota, setQuota] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const toast = useToast();


  useEffect(() => {
    fetchQuota();
  }, []);

  const fetchQuota = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/quota/", {
        withCredentials: true,
      });
      setQuota(response.data[0]);
    } catch (error) {
      console.error("Error fetching quota:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        setAudioFile(new File([blob], "recording.wav", { type: "audio/wav" }));
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        status: "info",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description:
          "Could not start recording. Please check your microphone permissions.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      toast({
        title: "Recording Stopped",
        status: "info",
        duration: 2000,
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      toast({
        title: "File Selected",
        description: file.name,
        status: "success",
        duration: 2000,
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an audio file",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) {
      toast({
        title: "No Audio File",
        description: "Please record or upload an audio file first",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/transcribe/",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscription(response.data.transcription_text);
      await fetchQuota();

      toast({
        title: "Transcription Complete",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Transcription Failed",
        description: error.response?.data?.error || "An error occurred",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current || !transcription) return;

    const currentTime = audioRef.current.currentTime;
    const newIndex = transcription.findIndex((word) => {
      const startTime = word.start;
      const endTime = word.end;
      return currentTime >= startTime && currentTime <= endTime;
    });

    if (newIndex !== -1) {
      setCurrentWordIndex(newIndex);
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Audio Transcription Dashboard</Heading>

        {/* Quota Display */}
        {quota && (
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={2}>
                <Text>Quota Remaining: {quota.minutes_remaining} minutes</Text>
                <Progress
                  value={(quota.used_minutes / quota.total_minutes) * 100}
                  colorScheme="blue"
                />
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Recording Controls */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack spacing={4}>
                <Button
                  colorScheme="red"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  display="none"
                  id="audio-upload"
                />
                <Button as="label" htmlFor="audio-upload" colorScheme="blue">
                  Upload Audio
                </Button>
              </HStack>

              {audioFile && <Text>Selected: {audioFile.name}</Text>}

              <Button
                colorScheme="green"
                isLoading={isProcessing}
                onClick={handleTranscribe}
                isDisabled={!audioFile || isProcessing}
              >
                Transcribe Audio
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Audio Playback and Transcription */}
        {transcription && (
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <audio
                  ref={audioRef}
                  controls
                  onTimeUpdate={handleAudioTimeUpdate}
                  src={audioFile ? URL.createObjectURL(audioFile) : ""}
                />

                <Box p={4} borderWidth={1} borderRadius="md">
                  {transcription.map((word, index) => (
                    <Text
                      key={index}
                      as="span"
                      mx={1}
                      bg={
                        currentWordIndex === index
                          ? "yellow.200"
                          : "transparent"
                      }
                      transition="background-color 0.2s"
                    >
                      {word.text}
                    </Text>
                  ))}
                </Box>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
}

export default Dashboard;
