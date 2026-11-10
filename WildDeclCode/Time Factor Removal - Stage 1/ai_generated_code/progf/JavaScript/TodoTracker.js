var _import = require('react');
var axios = require('axios');

/** This code was Supported via standard programming aids */

function TodoTracker() {
    const [todos, setTodos] = useState([]);
    const [dones, setDones] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(function () {
        // Fetch the todos from the Rust service when the component mounts
        axios.get('http://localhost:8000/todos').then(response => {
            setTodos(response.data.filter((todo) => todo.completed === false));
            setDones(response.data.filter((todo) => todo.completed === true));
        });
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        // Add the new todo to the Rust service
        axios.post('http://localhost:8000/todos', {id:0, title: newTodo, completed: false }).then(function response {
            setTodos([...todos, response.data]);
            setNewTodo('');
        });
    }

    function handleDelete(id) {
        // Remove the todo from the Rust service
        axios.delete("http://localhost:8000/todos/" + (id) + "").then(function () {
            setTodos(todos.filter(todo => todo.id !== id));
            setDones(dones.filter(todo => todo.id !== id));
        });
    }

    function handleToggle(id) {
        // Toggle the "completed" status of the todo in the Rust service

        const todo = [...todos,...dones].find(function todo { return todo.id === id; });
        axios.patch("http://localhost:8000/todos/" + (id) + "", {id: todo.id, title: todo.title, completed: !todo.completed }).then(function response {
            if (todo.completed) {
                setTodos([...todos,response.data])
                setDones(dones.filter(dones => dones.id !== id));
            } else {
                setTodos(todos.filter(todo => todo.id !== id));
                setDones([...dones,response.data])
            }
        });
    }

    return (
        <div>
            <h1>Todo Tracker</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={function event { return setNewTodo(event.target.value); }}
                />
                <button type="submit">Add Todo</button>
            </form>
            <h3>In Progress</h3>
            <ul>
                {todos.map(function todo { return (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggle(todo.id)}
                        />
                        {todo.title}
                        <button onClick={() => handleDelete(todo.id)}>Delete</button>
                    </li>
                ); })}
            </ul>
            <hr/>
           <h3>Done</h3>
            <ul>
                {dones.map(function done { return (
                    <li key={done.id}>
                        <input
                            type="checkbox"
                            checked={done.completed}
                            onChange={() => handleToggle(done.id)}
                        />
                        {done.title}
                        <button onClick={() => handleDelete(done.id)}>Delete</button>
                    </li>
                ); })}
            </ul>
        </div>
    );
}

module.exports = TodoTracker;
