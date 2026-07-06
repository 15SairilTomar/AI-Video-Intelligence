import { useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [actionItems, setActionItems] = useState([]);
  const [keyDecisions, setKeyDecisions] = useState([]);
  const [openQuestions, setOpenQuestions] = useState([]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");

  async function analyzeVideo() {

  if (!videoUrl.trim()) {
    alert("Please enter a YouTube URL.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:8001/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: videoUrl,
      }),
    });

    const data = await response.json();

    setTitle(data.title);
    setSummary(data.summary);
    setActionItems(data.action_items);
    setKeyDecisions(data.key_decisions);
    setOpenQuestions(data.open_questions);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  async function askQuestion() {
    try {
      const response = await fetch("http://127.0.0.1:8001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: chatQuestion,
        }),
      });

      const data = await response.json();

      setChatAnswer(data.answer);
      setChatQuestion(""); 

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 py-8">
  <div className="max-w-6xl mx-auto px-6">
      <div className="font-extrabold text-3xl flex justify-center p-2">AI VIDEO ASSISTANT </div><br></br>
    <div className="bg-orange-400 p-4 border-5 rounded-3xl">
       <div 
     className="bg-yellow-200 
     p-3

     border-2 rounded-2xl
     flex-col justify-center"
     >
      <div className="flex justify-center text-2xl font-black">
         <h1>AI Video Assistant</h1>
      </div>
<br></br>
      <div className="flex justify-center">
        <input
        type="text"
        placeholder="Paste YouTube URL or local path"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        style={{ width: "600px",
    height: "50px",
    padding: "10px",
    backgroundColor: "#FFFDD0",
    color: "black",
    border: "2px solid black",
    borderRadius: "8px",
    outline: "none",
    fontSize: "16px" }}
      />
      </div>
      <br /><br />

      <div className="flex p-3 justify-center">
        <button onClick={analyzeVideo} 
      className= "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Analyze Video
      </button>

      {
  loading && (
    <div className="flex flex-col items-center mt-6">

      <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>

      <p className="mt-4 text-lg font-semibold">
        Processing your video...
      </p>

      <p className="text-gray-700">
        Downloading • Transcribing • Generating Summary...
      </p>

    </div>
  )
}
      </div>

      
     </div>
<br></br>
    <div
    className="flex-col font-bold
    p-3 border-2 rounded-2xl
    bg-yellow-100"
    >
      <h2 className="flex justify-center
      text-2xl
      ">Title-</h2>
      <p>{title}</p>

      <h2 className="flex justify-center text-2xl">Summary-</h2>
      <p>{summary}</p>

      <h2 className="flex justify-center text-2xl">Action Items-</h2>
      <ul>
        {actionItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h2 className="flex justify-center text-2xl">Key Decisions-</h2>
      <ul>
        {keyDecisions.map((decision, index) => (
          <li key={index}>{decision}</li>
        ))}
      </ul>

      <h2 className="flex justify-center text-2xl">Open Questions-</h2>
      <ul>
        {openQuestions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>

     

    </div>
    </div>
      <div className="flex justify-center
      mb-4 pl-10 mt-4  p-4
      
      ">
        <h1
      className="text-3xl font-bold  mb-4"
      >   Chat with the AI Assistant: </h1>
      </div>

    <div className="bg-pink-700 p-3 h-100 rounded-2xl border-8">
        <div className="flex justify-center">
        <input
        type="text"
        placeholder="Ask a question..."
        value={chatQuestion}
        onChange={(e) => setChatQuestion(e.target.value)}
        style={{
          width: "700px",
          padding: "10px",
backgroundColor: "pink", 
color: "black",
height: "100px",
border: "4px solid black",
borderRadius: "8px",
outline: "none",
fontSize: "18px"

        }}
      />
      </div>

    <div className="flex justify-center p-4">
  <button
    onClick={askQuestion}
    className="bg-blue-400 hover:bg-blue-600 text-white font-semibold w-40 h-12 rounded-xl shadow-lg transition duration-300"
  >
    Send
  </button>
</div>

  

     <div className="flex flex-col h-40 justify-center
     rounded-2xl border-4 p-3 
     
     bg-pink-200"> 
<h1 className="font-bold text-2xl ">Answer:</h1>
     
      <p>{chatAnswer}</p>

     </div>
    </div>
    </div>
    </div>
  );
}

export default App;


