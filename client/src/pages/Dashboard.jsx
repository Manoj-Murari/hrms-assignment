import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [teams, setTeams] = useState([]);

    // Form States
    const [newEmpName, setNewEmpName] = useState('');
    const [newEmpRole, setNewEmpRole] = useState('');
    const [newTeamName, setNewTeamName] = useState('');
    const [selectedEmp, setSelectedEmp] = useState(null); // For assigning teams

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, teamRes] = await Promise.all([
                api.get('/employees'),
                api.get('/teams')
            ]);
            setEmployees(empRes.data);
            setTeams(teamRes.data);
        } catch (err) {
            console.error("Failed to fetch data");
        }
    };

    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        await api.post('/employees', { name: newEmpName, role: newEmpRole });
        setNewEmpName(''); setNewEmpRole('');
        fetchData();
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        await api.post('/teams', { name: newTeamName });
        setNewTeamName('');
        fetchData();
    };

    const handleAssignTeam = async (empId, teamId) => {
        // Current logic: Replace teams. To add, you'd need to merge arrays.
        // For this assignment, we simply assign the selected team.
        await api.post(`/employees/${empId}/assign-teams`, { teamIds: [teamId] });
        fetchData();
        alert("Team Assigned!");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">HRMS Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.email}</span>
                    <button onClick={logout} className="text-red-500 hover:text-red-700 font-semibold">Logout</button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT COLUMN: MANAGEMENT */}
                <div className="space-y-8">

                    {/* Create Employee Form */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">Add Employee</h2>
                        <form onSubmit={handleCreateEmployee} className="flex gap-2">
                            <input
                                placeholder="Name"
                                className="border p-2 rounded w-full"
                                value={newEmpName} onChange={e => setNewEmpName(e.target.value)} required
                            />
                            <input
                                placeholder="Role"
                                className="border p-2 rounded w-full"
                                value={newEmpRole} onChange={e => setNewEmpRole(e.target.value)} required
                            />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                        </form>
                    </div>

                    {/* Create Team Form */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">Add Team</h2>
                        <form onSubmit={handleCreateTeam} className="flex gap-2">
                            <input
                                placeholder="Team Name"
                                className="border p-2 rounded w-full"
                                value={newTeamName} onChange={e => setNewTeamName(e.target.value)} required
                            />
                            <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: LISTS */}
                <div className="space-y-8">

                    {/* Employee List */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">Employees</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {employees.map(emp => (
                                <div key={emp.id} className="border-b pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{emp.name}</p>
                                            <p className="text-sm text-gray-500">{emp.role}</p>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {emp.teams?.map(t => (
                                                    <span key={t.id} className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                                                        {t.name}
                                                    </span>
                                                ))}
                                                {emp.teams?.length === 0 && <span className="text-xs text-gray-400">No teams</span>}
                                            </div>
                                        </div>

                                        {/* Simple Team Assignment Dropdown */}
                                        <select
                                            className="text-sm border rounded p-1"
                                            onChange={(e) => handleAssignTeam(emp.id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>+ Assign Team</option>
                                            {teams.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                            {employees.length === 0 && <p className="text-gray-400">No employees found.</p>}
                        </div>
                    </div>

                    {/* Teams List */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">Teams Available</h2>
                        <ul className="list-disc pl-5 text-gray-700">
                            {teams.map(t => <li key={t.id}>{t.name}</li>)}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}