import { useMemo, useState } from 'react';

function EmployeesPage() {
  const [employees, setEmployees] = useState([
    { name: 'Rahul Sharma', role: 'Software Engineer', department: 'IT', status: 'Active' },
    { name: 'Priya Verma', role: 'HR Manager', department: 'HR', status: 'Active' },
    { name: 'Amit Kumar', role: 'Data Analyst', department: 'Analytics', status: 'On Leave' },
    { name: 'Sneha Reddy', role: 'Recruiter', department: 'HR', status: 'Active' },
    { name: 'Arjun Singh', role: 'AI Engineer', department: 'AI Team', status: 'Active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', department: '', status: 'Active' });

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return employees;

    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(term) ||
      employee.role.toLowerCase().includes(term) ||
      employee.department.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  const handleAddClick = () => {
    setNewEmployee({ name: '', role: '', department: '', status: 'Active' });
    setShowModal(true);
  };

  const handleSaveEmployee = (event) => {
    event.preventDefault();
    if (!newEmployee.name.trim() || !newEmployee.role.trim() || !newEmployee.department.trim()) {
      return;
    }

    setEmployees((current) => [...current, { ...newEmployee, name: newEmployee.name.trim(), role: newEmployee.role.trim(), department: newEmployee.department.trim() }]);
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setNewEmployee((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-6 p-6 md:p-10">
      <div className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-300/10 border border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Employee Directory</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Team members</h2>
            <p className="mt-2 text-sm text-slate-500">Search, review, and manage your current employee roster.</p>
          </div>
          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Add Employee
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <label className="block text-sm font-medium text-slate-700">Search employees</label>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, role, or department"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-300/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Employee Name</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Role</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Department</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredEmployees.map((employee) => (
                <tr key={`${employee.name}-${employee.role}`} className="hover:bg-slate-50 transition">
                  <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-900">{employee.name}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-700">{employee.role}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-700">{employee.department}</td>
                  <td className="whitespace-nowrap px-6 py-5 text-sm">
                    <span className={`inline-flex rounded-full px-3 py-1 font-semibold ${employee.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-900/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-500">New Employee</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-900">Add a new team member</h3>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-500 transition hover:text-slate-900">Close</button>
            </div>

            <form onSubmit={handleSaveEmployee} className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Name</span>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(event) => handleInputChange('name', event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Role</span>
                  <input
                    type="text"
                    value={newEmployee.role}
                    onChange={(event) => handleInputChange('role', event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Department</span>
                  <input
                    type="text"
                    value={newEmployee.department}
                    onChange={(event) => handleInputChange('department', event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <select
                    value={newEmployee.status}
                    onChange={(event) => handleInputChange('status', event.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-3xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;
