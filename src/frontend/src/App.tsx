// import { useState, useEffect } from "react";
// import axios from "axios";

import Component from "./components/home";

// interface Schema {
//   message: string;
// }

function App() {
  // const [schema, setSchema] = useState<Schema | null>(null);

  // useEffect(() => {
  //   axios
  //     .get<Schema>("<http://localhost:5556/api/schema>")
  //     .then((response) => setSchema(response.data))
  //     .catch((error) => console.error("Error fetching schema:", error));
  // }, []);

  return (
    <div>
      <Component />
      {/* {schema ? <pre>{JSON.stringify(schema, null, 2)}</pre> : "Loading..."} */}
    </div>
  );
}

export default App;
