// Supported via standard GitHub programming aids

var _import = require('react');

var NewBook = function ({ addBook }) {
    var [title, setTitle] = useState('');
    var [author, setAuthor] = useState('');

    var handleSubmit = (e) => {
        e.preventDefault();
        addBook({ title, author });
        setTitle('');
        setAuthor('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Author:</label>
                <input 
                    type="text" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">Add Book</button>
        </form>
    );
};

module.exports = NewBook;
