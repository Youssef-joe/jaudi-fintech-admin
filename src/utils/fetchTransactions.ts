import axios from "axios";


export const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/transactions/mine", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
}