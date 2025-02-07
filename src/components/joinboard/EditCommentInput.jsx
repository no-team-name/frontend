// src/components/joinboard/EditCommentInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import './EditCommentInput.css'


const EditCommentInput = ({ onSubmit, onCancel, initialValue = '' }) => {
  const [text, setText] = useState(initialValue);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleCompositionStart = () => {
    // 필요시 추가 처리
  };

  const handleCompositionEnd = (e) => {
    setText(e.target.value);
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
      <TextField
        fullWidth
        inputRef={inputRef}
        value={text}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
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
        <Button className="coment-edit-cancel-button" color="black" variant="contained" onClick={onCancel}>
          취소
        </Button>
        <Button className="coment-edit-input-button" color="black" variant="contained" onClick={() => onSubmit(text)}>
          수정 완료
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(EditCommentInput);