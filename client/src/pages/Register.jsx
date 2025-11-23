import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// The "export default" below is crucial for the error you saw
export default function Register() {
    const [formData, setFormData] = useState({ orgName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.orgName, formData.email, formData.password);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Email might be in use.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register Organization</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full p-2 border rounded border-gray-300"
                            value={formData.orgName}
                            onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                        <input
                            type="email"
                            className="mt-1 block w-full p-2 border rounded border-gray-300"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 block w-full p-2 border rounded border-gray-300"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
}