const fs = require('fs');
const path = 'c:/Users/Sachin/OneDrive/Desktop/React/legalease-ai/legaleaseai/src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /\}\s+const onDrop = \(e\) => \{/m;

const replacement = `}

// ─── DOCUMENT UPLOAD ───
function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Invalid file type. Please upload a PDF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please upload a file smaller than 10MB.");
      return;
    }

    const fileItem = {
      name: file.name,
      size: file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + " MB" : (file.size / 1024).toFixed(1) + " KB",
      progress: 0,
      done: false,
      error: null,
      analysis: null,
    };

    setFiles((prev) => [fileItem, ...prev]);
    setSelectedFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    let progressInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        )
      );
    }, 500);

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "Authorization": \`Bearer \${token}\`
        },
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, progress: 100, done: true, analysis: data.analysis }
            : f
        )
      );
    } catch (err) {
      clearInterval(progressInterval);
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, progress: 0, error: err.message } : f
        )
      );
    }
  };

  const onDrop = (e) => {`;

code = code.replace(regex, replacement);
fs.writeFileSync(path, code);
