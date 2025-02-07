// src/components/joinboard/CommentsSection.jsx
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import {
  getAllCommentByJoinBoardId,
  createComment,
  deleteComment,
  updateComment,
} from '../../service/JoinBoardService';
import ReplyInputContainer from './ReplyInputContainer';
import EditCommentInput from './EditCommentInput';
import './CommentsSection.css';

const CommentsSection = ({ joinBoardId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [replyToId, setReplyToId] = useState(null);

  const fetchComments = async () => {
    try {
      const data = await getAllCommentByJoinBoardId(joinBoardId);
      setComments(data);
    } catch (error) {
      console.error('댓글을 불러오는 데 실패했습니다.', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [joinBoardId]);

  // 트리 구조로 댓글 정리
  const organizeComments = (commentsArr) => {
    const commentMap = {};
    const rootComments = [];

    commentsArr.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    commentsArr.forEach((comment) => {
      if (comment.parentCommentId) {
        if (commentMap[comment.parentCommentId]) {
          commentMap[comment.parentCommentId].replies.push(commentMap[comment.id]);
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      await createComment(joinBoardId, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  // 댓글 수정 모드 관리
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
  };

  const handleEditSubmit = async (commentId, newText) => {
    if (!newText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      await updateComment(commentId, { content: newText });
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 대댓글 작성 모드 관리
  const handleReplyStart = (commentId) => {
    setReplyToId(commentId);
  };

  const handleReplyCancel = () => {
    setReplyToId(null);
  };

  const handleReplySubmit = async (commentId, text) => {
    if (!text.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      await createComment(joinBoardId, { content: text }, commentId);
      setReplyToId(null);
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  const CommentItem = ({ comment, depth = 0 }) => {
    return (
      <Box key={comment.id}>
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #eee',
            py: 2,
            ml: `${depth * 40}px`,
            flexDirection: editingCommentId === comment.id ? 'column' : 'row',
            backgroundColor: depth > 0 ? '#f9f9f9' : 'transparent',
          }}
        >
          {editingCommentId === comment.id ? (
            <EditCommentInput
              initialValue={comment.content}
              onSubmit={(newText) => handleEditSubmit(comment.id, newText)}
              onCancel={handleEditCancel}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: '100px',
                }}
              >
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={
                      comment.memberProfileUrl ||
                      'https://www.cheonyu.com/_DATA/product/63900/63992_1672648178.jpg'
                    }
                    alt={`${comment.memberNickname}의 프로필`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Typography className="member-nickname" sx={{ fontSize: '0.9rem', color: '#333' }}>
                  {comment.memberNickname}
                </Typography>
              </Box>
              <ListItemText
                primary={comment.content}
                secondary={comment.createdAt}
                sx={{
                  '& .MuiListItemText-primary': { color: '#333', fontSize: '17px', mb: '5px' },
                  '& .MuiListItemText-secondary': { color: '#999999', fontSize: '11px' },
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                {depth < 1 && (
                  <IconButton onClick={() => handleReplyStart(comment.id)} sx={{ color: '#999' }}>
                    <ReplyIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => handleEditStart(comment)} sx={{ color: '#999' }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteComment(comment.id)} sx={{ color: '#999' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </ListItem>
        {replyToId === comment.id && (
          <Box sx={{ ml: `${(depth + 1) * 40}px`, mt: 2, mb: 2 }}>
            <ReplyInputContainer
              onSubmit={(text) => handleReplySubmit(comment.id, text)}
              onCancel={handleReplyCancel}
            />
          </Box>
        )}
        {comment.replies &&
          comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
      </Box>
    );
  };

  const organizedComments = organizeComments(comments);

  return (
    <Box>
      <Divider sx={{ my: 2, backgroundColor: '#ddd' }} />
      <Typography variant="h6" sx={{ color: '#333' }}>

      </Typography>
      <List>
        {organizedComments.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#777' }}>
            댓글이 없습니다.
          </Typography>
        ) : (
          organizedComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </List>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
        <TextField
          variant="outlined"
          label="댓글을 작성하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
            },
            '& .MuiInputLabel-outlined': {
              color: 'gray',
              '&.Mui-focused': { color: 'black' },
            },
          }}
        />
        <Button className="comment-input-button"
                color="black"
                variant="contained" onClick={handleCommentSubmit} sx={{ alignSelf: 'flex-end' }}
        >
          댓글 작성
        </Button>
      </Box>
    </Box>
  );
};

export default CommentsSection;