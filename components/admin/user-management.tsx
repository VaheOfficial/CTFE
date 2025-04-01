import { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { PasswordResetModal } from './password-reset-modal';
import { ApiService } from '@/lib/api.service';
import { toast } from 'sonner';

// Ensure this type matches the one in PasswordResetModal
type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  accountStatus: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string; // Add this to be compatible with the modal's type
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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  
  // Password reset state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  
  // Function to fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiService = new ApiService();
      const response = await apiService.getAllUsers();
      
      if (!response.success) {
        setError(response.message || 'Failed to fetch users');
        return;
      }
      
      setUsers(response.data);
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch users from API when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const handleSaveUser = async () => {
    if (selectedUser && editForm) {
      try {
        setIsSaving(true);
        const apiService = new ApiService();
        const response = await apiService.updateUserAsAdmin(selectedUser._id, editForm);
        
        if (!response.success) {
          toast.error(response.message || 'Failed to update user', { richColors: true, position: 'top-center'});
          return;
        }
        
        // Update the local state with the updated user
        const updatedUsers = users.map((user) =>
          user._id === selectedUser._id ? { ...user, ...editForm } : user
        );
        setUsers(updatedUsers);
        setSelectedUser({ ...selectedUser, ...editForm });
        toast.success('User updated successfully', { richColors: true, position: 'top-center'});
        setIsEditing(false);
        
        // Refresh the users list to get the latest data
        fetchUsers();
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while updating the user', { richColors: true, position: 'top-center'});
      } finally {
        setIsSaving(false);
      }
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
    setEditForm({ ...editForm, accountStatus: status });
  };
  
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };
  
  const handleCloseResetModal = () => {
    setIsResetModalOpen(false);
    // Refresh the users list after password reset
    fetchUsers();
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b00]" />
          </div>
        ) : error ? (
          <div className="text-[#ff2d55] p-4 bg-[#ff2d55]/10 rounded">
            {error}
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user._id}
                  className={`w-full text-left p-3 rounded ${
                    selectedUser?._id === user._id
                      ? 'bg-[#1a1a1a] border-l-2 border-[#ff6b00]'
                      : 'hover:bg-[#121212]'
                  }`}
                  onClick={() => handleSelectUser(user)}
                  type="button"
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-[#a3a3a3]">{user.email}</div>
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${roleColor[user.role]}`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                    <span className={`text-xs ${statusColor[user.accountStatus]}`}>
                      {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-[#a3a3a3]">
                No users found
              </div>
            )}
          </div>
        )}
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
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleSaveUser} 
                    className="text-sm bg-[#ff6b00] hover:bg-[#ff6b00]/80 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
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
                      value={editForm.name ?? ''}
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
                      value={editForm.email ?? ''}
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
                    value={editForm.role ?? ''}
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
                        checked={editForm.accountStatus === 'active'}
                        onCheckedChange={() => handleStatusToggle('active')}
                      />
                      <Label htmlFor="active" className="cursor-pointer">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="suspended"
                        checked={editForm.accountStatus === 'suspended'}
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
                    <div className={`font-medium ${statusColor[selectedUser.accountStatus]}`}>
                      {selectedUser.accountStatus.charAt(0).toUpperCase() + selectedUser.accountStatus.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-[#121212] rounded-md">
                  <div className="text-sm text-[#a3a3a3]">Last Login</div>
                  <div className="font-medium">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</div>
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