import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig'; // Sử dụng instance Axios đã cấu hình
import './List.css'; // Sử dụng CSS chung

// API để quản lý User (Chỉ ADMIN được dùng)
const userApi = {
    getAll: () => api.get('/auth/users'),
    // Thêm các hàm sửa/xóa/cập nhật role nếu cần:
    // delete: (id) => api.delete(`/users/${id}`),
    // updateRole: (id, role) => api.put(`/users/${id}/role`, { role }), 
};


function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await userApi.getAll();
            // API trả về trực tiếp mảng UserDTO
            const userData = res.data.data || res.data; 

            if (Array.isArray(userData)) {
                setUsers(userData);
            } else {
                setUsers([]);
            }
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải danh sách users:", err);
            setError('Không thể tải danh sách người dùng. (Yêu cầu quyền ADMIN)');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Tùy chọn: Hàm xử lý xóa user
    /*
    const handleDelete = async (id) => {
        if (window.confirm("Xóa người dùng này?")) {
            await userApi.delete(id);
            fetchUsers();
        }
    };
    */
    
    // Tùy chọn: Hàm xử lý cập nhật role (Ví dụ)
    /*
    const handleUpdateRole = async (id, currentRole) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        if (window.confirm(`Đổi vai trò thành ${newRole} cho user này?`)) {
            await userApi.updateRole(id, newRole);
            fetchUsers();
        }
    };
    */

    return (
        <div className="card">
            <h2>Quản lý Người dùng</h2>
            <div className="top-bar">
                {/* Có thể thêm thanh tìm kiếm/filter */}
            </div>

            {loading && <p>Đang tải...</p>}
            {!loading && error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        {/*
                                        <button 
                                            className="edit" 
                                            onClick={() => handleUpdateRole(user.id, user.role)}
                                            style={{backgroundColor: user.role === 'ADMIN' ? '#ffc107' : '#2196f3'}}
                                        >
                                            {user.role === 'ADMIN' ? 'Set USER' : 'Set ADMIN'}
                                        </button>
                                        <button className="delete" onClick={() => handleDelete(user.id)}>Xóa</button>
                                        */}
                                        <span>Không có chức năng sửa/xóa</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>Không tìm thấy người dùng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserList;