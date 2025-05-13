import React from 'react';

const EditProfilePage = () => {
  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      <form className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" placeholder="Tell us about yourself"></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar</label>
          <input type="file" id="avatar" name="avatar" />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
