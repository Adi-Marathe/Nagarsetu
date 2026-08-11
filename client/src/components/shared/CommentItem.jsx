import React from 'react';

const CommentItem = ({ comment }) => (
  <div className="comment-item">
    <div className="comment-header">
      <span className="comment-user">{comment.user?.name}</span>
      <span className="comment-role">{comment.user?.role}</span>
    </div>
    <p className="comment-text">{comment.text}</p>
    <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
  </div>
);

export default CommentItem;
