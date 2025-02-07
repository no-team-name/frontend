// src/components/joinboard/ReplyInputContainer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import ReplyInput from './ReplyInput';

const ReplyInputContainer = ({ onSubmit, onCancel, initialValue = '' }) => {
  const [replyText, setReplyText] = useState(initialValue);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleCompositionStart = () => {
    // 추가 작업이 필요하면 여기에 작성
  };

  const handleCompositionEnd = (e) => {
    setReplyText(e.target.value);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <ReplyInput
        ref={inputRef}
        value={replyText}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="답글을 입력하세요"
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={onCancel}>
          취소
        </Button>
        <Button variant="contained" onClick={() => onSubmit(replyText)}>
          답글 작성
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(ReplyInputContainer);