import ChatWindow from "../components/ChatWindow";

function AIAssistant() {

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%"
    }}>

      <div style={{
        background: "white",
        padding: "15px 20px",
        borderRadius: 10,
        marginBottom: 15
      }}>
        <h2 style={{ margin: 0 }}>
          AI Virtual Assistant
        </h2>

        <p style={{ color: "#666" }}>
          Enterprise AI assistant powered by Ollama + LangChain
        </p>
      </div>

      <div style={{
        flex: 1,
        background: "white",
        borderRadius: 10,
        padding: 15,
        minHeight: "75vh"
      }}>
        <ChatWindow />
      </div>

    </div>
  );
}

export default AIAssistant;