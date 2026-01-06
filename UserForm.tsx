import React, { useState } from 'react';
import { User } from '../../models/User';

interface UserFormProps {
    user: User | null;
    onSave: (user: Omit<User, 'id'>) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: '',
        role: user?.role || 'USER' as 'ADMIN' | 'USER',
        department_id: user?.department_id || 1,
        tenant_id: user?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{user ? 'Edit User' : 'Add New User'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!user}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            className="form-select"
                            title="Select user role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'USER' })}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Department ID</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter department ID"
                            value={formData.department_id}
                            onChange={(e) => setFormData({ ...formData, department_id: parseInt(e.target.value) })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
