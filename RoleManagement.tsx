import React, { useState, useEffect } from 'react';
import { FileStorage } from '../../utils/fileStorage';

interface Role {
    id: number;
    name: string;
    permissions: string[];
    tenant_id: number;
}

const RoleManagement: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [tenantId, setTenantId] = useState<number>(1);
    const roleStorage = new FileStorage<Role>('roles');

    useEffect(() => {
        loadRoles();
    }, [tenantId]);

    const loadRoles = () => {
        const data = roleStorage.getAll(tenantId);
        setRoles(data);
    };

    const handleSave = (roleData: Omit<Role, 'id'>) => {
        if (editingRole) {
            roleStorage.update(editingRole.id, roleData, tenantId);
        } else {
            roleStorage.create(roleData);
        }
        loadRoles();
        setShowForm(false);
        setEditingRole(null);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            roleStorage.delete(id, tenantId);
            loadRoles();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Role Management</h2>
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
                <RoleForm
                    role={editingRole}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingRole(null); }}
                />
            )}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Permissions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map(role => (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td>{role.permissions.join(', ')}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(role)}>Edit</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(role.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-success" onClick={() => { setEditingRole(null); setShowForm(true); }}>Add New Role</button>
        </div>
    );
};

interface RoleFormProps {
    role: Role | null;
    onSave: (role: Omit<Role, 'id'>) => void;
    onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: role?.name || '',
        permissions: role?.permissions || [],
        tenant_id: role?.tenant_id || 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handlePermissionChange = (permission: string, checked: boolean) => {
        if (checked) {
            setFormData({ ...formData, permissions: [...formData.permissions, permission] });
        } else {
            setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== permission) });
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5>{role ? 'Edit Role' : 'Add New Role'}</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter role name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Permissions</label>
                        <div>
                            {['read', 'write', 'delete', 'admin'].map(perm => (
                                <div key={perm} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={formData.permissions.includes(perm)}
                                        onChange={(e) => handlePermissionChange(perm, e.target.checked)}
                                    />
                                    <label className="form-check-label">{perm}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default RoleManagement;
