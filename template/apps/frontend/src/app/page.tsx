import { useEffect, useState } from 'react'
import { User } from '@jagadhis/types'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    setUsers(data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name: newUser.name, email: newUser.email }])
        .select();

      if (error) throw error;

      // Add new user to state and reset form
      if (data) {
        setUsers([...users, ...data]);
        setNewUser({ name: '', email: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding user');
      console.error('Error adding user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Add User Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* User List */}
      <div className="bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold p-4 border-b">User List</h2>
        <ul className="divide-y">
          {users.map(user => (
            <li key={user.id} className="p-4">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-600">{user.email}</div>
            </li>
          ))}
        </ul>
        {users.length === 0 && (
          <p className="p-4 text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
}