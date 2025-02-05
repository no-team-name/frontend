import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

function LoginButton({ onClick }) {
  return (
    <Button primary onClick={onClick} style={{ backgroundColor: '#494e5e' }}>
      <Icon name="sign in" />
      Login
    </Button>
  );
}

export default LoginButton;