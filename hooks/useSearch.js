import { useState, useEffect } from "react";

const useSearch = (data, key) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) =>
      item[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredData(filtered);
  }, [searchQuery, data]);

  return { searchQuery, setSearchQuery, filteredData };
};

export default useSearch;
