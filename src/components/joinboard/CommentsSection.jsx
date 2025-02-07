// CommentsSection.jsx
import React, { useState, useEffect, useRef } from 'react';
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

const CommentsSection = ({ joinBoardId }) => {
  // 상태 관리
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [replyToId, setReplyToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  // 대댓글 입력창 포커스 제어용 ref
  const replyInputRef = useRef(null);

  // 댓글 목록 불러오기
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

  // replyToId가 변경되면 해당 대댓글 입력창에 포커스
  useEffect(() => {
    if (replyToId && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyToId]);

  // 댓글/대댓글들을 트리 구조로 조직
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

  // 댓글 작성 핸들러
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

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  // 댓글 수정 시작
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  // 댓글 수정 제출
  const handleEditSubmit = async (commentId) => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      await updateComment(commentId, { content: editCommentContent });
      setEditingCommentId(null);
      setEditCommentContent('');
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 대댓글 작성 시작
  const handleReplyStart = (commentId) => {
    setReplyToId(commentId);
    setReplyContent('');
  };

  // 대댓글 작성 취소
  const handleReplyCancel = () => {
    setReplyToId(null);
    setReplyContent('');
  };

  // 대댓글 제출
  const handleReplySubmit = async (parentCommentId) => {
    if (!replyContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      await createComment(joinBoardId, { content: replyContent }, parentCommentId);
      setReplyToId(null);
      setReplyContent('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  // 댓글 및 대댓글 렌더링을 위한 재귀 컴포넌트
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
            // 수정 모드
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                value={editCommentContent}
                onChange={(e) => {
                  if (!isComposing) setEditCommentContent(e.target.value);
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(e) => {
                  setIsComposing(false);
                  setEditCommentContent(e.target.value);
                }}
                variant="outlined"
                multiline
                InputProps={{
                  sx: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'black',
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  className="comment-cancel-update-button"
                  onClick={handleEditCancel}
                >
                  취소
                </Button>
                <Button
                  variant="contained"
                  className="comment-update-button"
                  onClick={() => handleEditSubmit(comment.id)}
                >
                  수정 완료
                </Button>
              </Box>
            </Box>
          ) : (
            // 일반 댓글 모드
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
                <Typography className="member-nickname" sx={{ fontSize: '0.8rem', color: '#333' }}>
                  {comment.memberNickname}
                </Typography>
              </Box>
              <ListItemText
                primary={comment.content}
                secondary={comment.createdAt}
                sx={{
                  '& .MuiListItemText-primary': { color: '#333', fontSize: '1rem', mb: '5px' },
                  '& .MuiListItemText-secondary': { color: '#999999', fontSize: '0.8rem' },
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

        {/* 대댓글 입력 폼 */}
        {replyToId === comment.id && (
          <Box
            sx={{
              ml: `${(depth + 1) * 40}px`,
              mt: 2,
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              inputRef={replyInputRef}
              value={replyContent}
              onChange={(e) => {
                if (!isComposing) setReplyContent(e.target.value);
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                setReplyContent(e.target.value);
              }}
              placeholder="답글을 입력하세요"
              variant="outlined"
              size="small"
              InputProps={{
                sx: {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'black',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                className="comment-cancel-update-button"
                onClick={handleReplyCancel}
              >
                취소
              </Button>
              <Button
                variant="contained"
                className="comment-update-button"
                onClick={() => handleReplySubmit(comment.id)}
              >
                답글 작성
              </Button>
            </Box>
          </Box>
        )}

        {/* 재귀적으로 대댓글 렌더링 */}
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
        댓글
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
      {/* 새 댓글 입력란 – 대댓글 입력창과 별개로 존재 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
        <TextField
          variant="outlined"
          label="댓글을 작성하세요"
          value={newComment}
          onChange={(e) => {
            if (!isComposing) setNewComment(e.target.value);
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={(e) => {
            setIsComposing(false);
            setNewComment(e.target.value);
          }}
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
        <Button
          variant="contained"
          className="comment-create-button"
          onClick={handleCommentSubmit}
          sx={{ alignSelf: 'flex-end' }}
        >
          댓글 작성
        </Button>
      </Box>
    </Box>
  );
};

export default CommentsSection;