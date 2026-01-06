import React, { useState, useEffect } from 'react';
import { User } from '../../models/User';
import UserForm from './UserForm';
import { FileStorage } from '../../utils/fileStorage';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);

    const userStorage = new FileStorage<User>('users');

    useEffect(() => {
        loadUsers();
    }, [tenantId]);

    const loadUsers = () => {
        const data = userStorage.getAll(tenantId);
        setUsers(data);
    };

    const handleSave = (userData: Omit<User, 'id'>) => {
        if (editingUser) {
            userStorage.update(editingUser.id, userData, tenantId);
        } else {
            userStorage.create(userData);
        }
        loadUsers();
        setShowForm(false);
        setEditingUser(null);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            userStorage.delete(id, tenantId);
            loadUsers();
        }
    };

    return (
        <div className="container mt-4">
            <h2>User Management</h2>
            <div className="mb-3">
                <label className="form-label">Tenant ID</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Enter tenant ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(parseInt(e.target.value))}
                />
            </div>
            {showForm && (
                <UserForm
                    user={editingUser}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingUser(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td>{user.department_id}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(user)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingUser(null); setShowForm(true); }}>Add New User</button>
        </div>
    );
};

export default UserList;
