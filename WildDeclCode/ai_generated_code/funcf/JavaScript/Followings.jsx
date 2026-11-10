```jsx
return (
  // this ui Crafted with standard coding tools(i make some small changes)
  <div className="p-4 max-w-3xl mx-auto">
    <h1 className="text-center text-xl font-bold my-1">
      {users.length} Following
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <div
          onClick={() => handleVisitUserProfile(user.name)}
          key={user.user_id}
          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:shadow-red-600 shadow-emerald-200 transition-all duration-300 cursor-pointer"
        >
          <img
            src={user.picture}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.username}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
```