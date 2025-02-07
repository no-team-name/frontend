// src/components/joinboard/ReplyInput.jsx
import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';

const ReplyInput = forwardRef(({ value, onChange, onCompositionStart, onCompositionEnd, placeholder }, ref) => {
  return (
    <TextField
      fullWidth
      inputRef={ref}
      value={value}
      onChange={onChange}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      placeholder={placeholder}
      variant="outlined"
      size="large"
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
  );
});

export default React.memo(ReplyInput);