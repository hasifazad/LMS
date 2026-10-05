
interface List {
    name: {
        fullname: string
    },
    num: number,
}

function Test() {


    let list: List;

    return (
        <div>
            <h1>{list.name.fullname}</h1>
            <p>{list.num}</p>
        </div>
    )
}

export default Test