import { useState, useEffect } from "react";

export default function OpenAISearch({ dataForAI, searchKeyword , setIsDataReceived}) {

  const [abstract, setAbstract] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchKeyword) return;

    const fetchAbstract = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/openai-api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchKeyword, dataset: dataForAI })
        });
        const data = await res.json();
        setAbstract(data.abstract);
      } catch (err) {
        console.error(err);
        setAbstract("Error fetching summary.");
      }
      setLoading(false);
    };

    fetchAbstract();
  }, [dataForAI, searchKeyword]);

  useEffect(() => {
    if (abstract && !loading) {
      setIsDataReceived(true);
    }
  }, [abstract, loading, setIsDataReceived]);

  return (
    <div>
      {loading ? <p>Sit back and relax...</p> : <p>{abstract}</p>}
    </div>
  );
}
