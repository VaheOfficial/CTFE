import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { PasswordResetModal } from './password-reset-modal';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
};

// Function to generate a strong password
const generateStrongPassword = () => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  
  // Ensure at least one of each character type
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Add additional random characters to reach desired length (12-16 chars)
  const length = Math.floor(Math.random() * 5) + 12; // Length between 12-16
  const allChars = uppercase + lowercase + numbers + symbols;
  
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane.smith@agency.gov',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-11-15T14:32:00Z',
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john.doe@agency.gov',
      role: 'operator',
      status: 'active',
      lastLogin: '2023-11-14T09:15:00Z',
    },
    {
      id: '3',
      name: 'Emily Johnson',
      email: 'emily.johnson@contractor.com',
      role: 'viewer',
      status: 'pending',
      lastLogin: 'Never',
    },
    {
      id: '4',
      name: 'Michael Chen',
      email: 'michael.chen@agency.gov',
      role: 'operator',
      status: 'suspended',
      lastLogin: '2023-10-25T11:45:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  
  // Password reset state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setEditForm(user);
    setIsEditing(false);
  };

  const handleEditUser = () => {
    setIsEditing(true);
  };

  const handleSaveUser = () => {
    if (selectedUser && editForm) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...editForm } : user
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, ...editForm });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm(selectedUser || {});
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleStatusToggle = (status: 'active' | 'suspended') => {
    setEditForm({ ...editForm, status });
  };
  
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };
  
  const handleCloseResetModal = () => {
    setIsResetModalOpen(false);
  };

  const statusColor = {
    active: 'text-green-500',
    suspended: 'text-[#ff2d55]',
    pending: 'text-[#ff6b00]',
  };

  const roleColor = {
    admin: 'bg-[#ff2d55]/10 text-[#ff2d55]',
    operator: 'bg-[#ff6b00]/10 text-[#ff6b00]',
    viewer: 'bg-[#3a3a3c]/20 text-[#f5f5f5]',
  };

  const handleKeyPress = (e: React.KeyboardEvent, user: User) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectUser(user);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* User list */}
      <div className="col-span-12 md:col-span-5 p-4 border-r border-[#1a1a1a]">
        <div className="mb-4">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#121212] border-[#2a2a2a]"
          />
        </div>
        <ul className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className={`p-3 rounded cursor-pointer ${
                selectedUser?.id === user.id
                  ? 'bg-[#1a1a1a] border-l-2 border-[#ff6b00]'
                  : 'hover:bg-[#121212]'
              }`}
              onClick={() => handleSelectUser(user)}
              onKeyDown={(e) => handleKeyPress(e, user)}
              tabIndex={0}
              aria-selected={selectedUser?.id === user.id}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-[#a3a3a3]">{user.email}</div>
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${roleColor[user.role]}`}
                >
                  {user.role.toUpperCase()}
                </span>
                <span className={`text-xs ${statusColor[user.status]}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* User details */}
      <div className="col-span-12 md:col-span-7 p-4">
        {selectedUser ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">User Details</h3>
              {!isEditing ? (
                <div className="space-x-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleEditUser} 
                    className="text-sm"
                  >
                    Edit User
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenResetModal}
                    className="text-sm bg-[#ff2d55] hover:bg-[#ff2d55]/80 text-white"
                  >
                    Reset Password
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleCancelEdit} 
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleSaveUser} 
                    className="text-sm bg-[#ff6b00] hover:bg-[#ff6b00]/80 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-[#e0e0e0]">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleInputChange}
                      className="mt-1 bg-[#121212] border-[#2a2a2a]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#e0e0e0]">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editForm.email || ''}
                      onChange={handleInputChange}
                      className="mt-1 bg-[#121212] border-[#2a2a2a]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role" className="text-[#e0e0e0]">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={editForm.role || ''}
                    onChange={handleInputChange}
                    className="w-full mt-1 bg-[#121212] border border-[#2a2a2a] rounded-md p-2 text-[#f5f5f5]"
                  >
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <Label className="text-[#e0e0e0] block mb-2">Account Status</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={editForm.status === 'active'}
                        onCheckedChange={() => handleStatusToggle('active')}
                      />
                      <Label htmlFor="active" className="cursor-pointer">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="suspended"
                        checked={editForm.status === 'suspended'}
                        onCheckedChange={() => handleStatusToggle('suspended')}
                      />
                      <Label htmlFor="suspended" className="cursor-pointer">Suspended</Label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#121212] rounded-md">
                    <div className="text-sm text-[#a3a3a3]">Name</div>
                    <div className="font-medium">{selectedUser.name}</div>
                  </div>
                  <div className="p-3 bg-[#121212] rounded-md">
                    <div className="text-sm text-[#a3a3a3]">Email</div>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  <div className="p-3 bg-[#121212] rounded-md">
                    <div className="text-sm text-[#a3a3a3]">Role</div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${roleColor[selectedUser.role]}`}>
                        {selectedUser.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#121212] rounded-md">
                    <div className="text-sm text-[#a3a3a3]">Status</div>
                    <div className={`font-medium ${statusColor[selectedUser.status]}`}>
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-[#121212] rounded-md">
                  <div className="text-sm text-[#a3a3a3]">Last Login</div>
                  <div className="font-medium">{selectedUser.lastLogin}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-[#a3a3a3]">
            Select a user to view details
          </div>
        )}
      </div>
      
      {/* Password Reset Modal */}
      <PasswordResetModal
        user={selectedUser}
        isOpen={isResetModalOpen}
        onClose={handleCloseResetModal}
      />
    </div>
  );
} 