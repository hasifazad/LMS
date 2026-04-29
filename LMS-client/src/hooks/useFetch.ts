
import { useEffect, useState } from "react";
import { fetchData } from "../axios/fetchData";




const useFetch = (url: String, method: String) => {


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetchData({ url, method });



                setData(response.data.data);
            } catch (err: any) {
                setError(err.message);


            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [url]);

    return { data, loading, error };

}

export default useFetch;