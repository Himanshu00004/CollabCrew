export default function Register() {
  return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="bg-black bg-opacity-80 p-6 rounded-lg w-96">
        <h2 className="text-2xl mb-4">Register</h2>
        <input type="text" placeholder="Username" className="w-full p-2 mb-2 border text-black" />
        <input type="email" placeholder="Email" className="w-full p-2 mb-2 border text-black" />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border text-black" />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
      </div>
    </div>
  );
}