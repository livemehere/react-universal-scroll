import { Scroll } from "./lib";
function App() {
  return (
    <div>
      <Scroll
        style={{
          background: "#f1f1f1",
        }}
        dir={"horizontal"}
        wheel={{
          step: 30,
          reverse: false,
        }}
        grab={{
          useGrabCursor: true,
        }}
        bar={{
          size: 10,
          marginFromEdge: 3,
          style: {
            background: "#575757",
          },
          track: {
            size: 16,
            style: {
              background: "#bebebe",
            },
          },
        }}
      >
        <ul
          style={{
            display: "flex",
          }}
        >
          <li>Google</li>
          <li>Facebook</li>
          <li>Microsoft</li>
          <li>Apple</li>
          <li>Amazon</li>
          <li>Google</li>
          <li>Facebook</li>
          <li>Microsoft</li>
          <li>Apple</li>
          <li>Amazon</li>
        </ul>
      </Scroll>
    </div>
  );
}

export default App;
