import { useState, useRef } from "react";
import Hls from "hls.js";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useDropzone, FileRejection } from "react-dropzone";

interface ReactDropzoneComponentProps {
  onFileSelect: (file: File) => void;
}

const ReactDropzoneComponent: React.FC<ReactDropzoneComponentProps> = ({
  onFileSelect,
}) => {
  const { getRootProps, getInputProps, acceptedFiles, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          onFileSelect(acceptedFiles[0]);
        }
      },
      onDropRejected: (fileRejections) => {
        console.log("Rejected files:", fileRejections);
        toast.error("File type or size not supported.");
      },
      accept: {
        "application/x-mpegURL": [".m3u8"],
        "video/mp4": [".mp4"],
      },
      maxSize: 20 * 1024 * 1024,
      maxFiles: 1,
    });

  return (
    <div
      {...getRootProps()}
      className="dropzone bg-white rounded-xl px-3 mx-4 py-5 cursor-pointer"
    >
      <input {...getInputProps()} />
      <p>Drag 'n' drop a file here, or click to select a file</p>
      {acceptedFiles.length > 0 && (
        <div>
          <h4>Accepted File:</h4>
          <ul>
            {acceptedFiles.map((file) => (
              <li key={file.name}>
                {file.name} - {file.size} bytes
              </li>
            ))}
          </ul>
        </div>
      )}
      {fileRejections.length > 0 && (
        <div>
          <h4>Rejected Files:</h4>
          <ul>
            {fileRejections.map(({ file, errors }: FileRejection) => (
              <li key={file.name}>
                {file.name} - {errors.map((e) => e.message).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function App() {
  const [m3u8file, setM3u8file] = useState("");
  const [hlsfile, setHlsfile] = useState<File | null>(null);
  const [inputtype, setInputtype] = useState("link");
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const video = videoRef.current;

    if (!video || !hlsfile) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      const fileUrl = URL.createObjectURL(hlsfile);

      hls.loadSource(fileUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());

      return () => {
        hls.destroy();
        URL.revokeObjectURL(fileUrl);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = URL.createObjectURL(hlsfile);
      video.addEventListener("loadedmetadata", () => video.play());
    }
  };

  const stream = () => {
    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(m3u8file);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = m3u8file;
      video.addEventListener("loadedmetadata", () => video.play());
    }
  };

  const Filetype = () => (
    <div className="bg-white mt-10 space-x-4 px-2 rounded-xl">
      <span
        className={`cursor-pointer ${
          inputtype === "link" ? "text-slate-300" : ""
        }`}
        onClick={() => setInputtype("link")}
      >
        Link
      </span>
      <span
        className={`cursor-pointer ${
          inputtype === "file" ? "text-slate-300" : ""
        }`}
        onClick={() => {
          setInputtype("file");
          setM3u8file("");
        }}
      >
        File
      </span>
    </div>
  );

  const Input = () => {
    if (inputtype === "link") {
      return (
        <div className="mt-10 xl:mt-26 flex flex-row rounded-md justify-center bg-white xl:w-96">
          <div className="w-[80%]">
            <input
              placeholder="your m3u8 file link here..."
              onChange={(e) => setM3u8file(e.target.value)}
              type="text"
              value={m3u8file}
              className="bg-white p-1 outline-none w-full"
            />
          </div>
          <div
            className="bg-blue-500 w-[20%] p-1   cursor-pointer"
            onClick={stream}
          >
            <h1>convert</h1>
          </div>
        </div>
      );
    }
    if (inputtype === "file") {
      return (
        <div className="mt-10 flex flex-col justify-center items-center">
          <ReactDropzoneComponent onFileSelect={(file) => setHlsfile(file)} />
          <br />
          <div className="text-white bg-blue-600">
            <button className="cursor-pointer px-3 py-1" onClick={play}>
              Play
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-screen h-screen bg-[#131314]">
      <div className="h-full w-full flex flex-col items-center">
        <div>
          <h1 className="text-transparent bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text py-4 text-4xl lg:text-8xl font-semibold font-Raleway">
            HlM4
          </h1>
        </div>
        <div className="lg:mt-16">
          <p className="text-3xl mx-16 text-slate-400 text-center lg:text-5xl font-Raleway font-medium brightness-200">
            Hls(M3U8) to MP4 Converter.
          </p>
        </div>
        <Filetype />
        {Input()}
        <div className="mt-16 mx-8 lg:mx-0">
          <video
            ref={videoRef}
            controls
            className="border-2 border-slate-400 h-[250px] w-[450px]"
          />
        </div>
        <div className="mt-8">
          <button
            className="bg-green-400 p-1"
            onClick={() => toast.error("Functionality unavailable")}
          >
            Download
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
