import { useState, useEffect } from "react";

const AutoRefreshData = () => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
        // Fetch or update data logic here
        const response = await fetch("https://api.example.com/data");
        const result = await response.json();
        setData(result);
    };

    useEffect(() => {
        fetchData(); // Fetch initially
        const interval = setInterval(fetchData, 60000); // Refresh every minute

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
};

export default AutoRefreshData;
