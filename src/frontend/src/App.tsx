// import { useState, useEffect } from "react";
// import axios from "axios";

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
      <h1 className="text-center text-3xl">Maven Studio - Under development</h1>
      {/* {schema ? <pre>{JSON.stringify(schema, null, 2)}</pre> : "Loading..."} */}
    </div>
  );
}

export default App;
