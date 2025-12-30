export default function Finance() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0);

    const add = async () => {
        await api.post("/finance", { title, amount });
        alert("Added");
    };

    return (
        <>
            <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
            <input type="number" onChange={e => setAmount(+e.target.value)} />
            <button onClick={add}>Add</button>
        </>
    );
}
