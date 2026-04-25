# Face AI Models

Place the following OpenCV-compatible ONNX files in this directory for server-side face recognition:

- `face_detection_yunet_2023mar.onnx`
- `face_recognition_sface_2021dec.onnx`

These model names match the defaults in [config/settings.py](/Users/ishanpande/Documents/New%20project/elearning-platform/services/backend/config/settings.py).

Official references:

- YuNet detector: https://github.com/opencv/opencv_zoo/tree/main/models/face_detection_yunet
- SFace recognizer: https://github.com/opencv/opencv_zoo/tree/main/models/face_recognition_sface

In production, mount this directory into the backend container or override `FACE_DETECTOR_MODEL_PATH` and `FACE_RECOGNIZER_MODEL_PATH`.
