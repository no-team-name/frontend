import React, { useState, useEffect } from 'react';
import { Modal, Button, Icon, Header } from 'semantic-ui-react';
import apiClient from '../../utils/apiSpring';

function ProfileImageChangeModal({ open, onClose, currentprofileImageUrl, onProfileUrlUpdate }) {
    
  // 선택된 파일과 미리보기 URL 상태 관리
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentprofileImageUrl);

  // 모달이 열리거나 currentprofileImageUrl이 변경될 때 미리보기 업데이트
  useEffect(() => {
    setPreview(currentprofileImageUrl);
    setSelectedFile(null);
  }, [currentprofileImageUrl, open]);

  // 파일 선택 핸들러: FileReader를 이용하여 미리보기 생성
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 변경하기 버튼 클릭 시 처리
  // const handleUpdate = () => {
  //   // 실제 서비스에서는 파일 업로드 후 서버에서 받은 URL로 업데이트할 수 있음
  //   if (preview) {
  //     onProfileUrlUpdate(preview);
  //     onClose();
  //   }
  // };
  
  // 변경하기 버튼 클릭 시: 파일 업로드 후, 새로운 프로필 이미지 URL로 preview 상태 업데이트
  const handleUpdate = async () => {
    if (!selectedFile) {
      console.warn("파일이 선택되지 않았습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // apiClient를 사용해 axios POST 요청 전송 (헤더에 토큰 자동 포함)
      const response = await apiClient.post("/api/members/profile-images", formData);

      // 예시: 백엔드에서 { profileImageUrl: "https://new.image.url/..." } 형태의 JSON을 반환한다고 가정
      if (response.status === 200 || response.status === 204) {
        const newUrl = response.data?.profileImageUrl || preview;
        // useState를 통해 preview 업데이트하고, 부모 컴포넌트에도 새 URL 전달
        setPreview(newUrl);
        onProfileUrlUpdate(newUrl);
        onClose();
      } else {
        console.error("업로드 실패", response.statusText);
      }
    } catch (error) {
      console.error("업로드 중 에러 발생", error);
    }
  };


  return (
    <Modal open={open} onClose={onClose} size="small">
      <Header icon="user circle" content="프로필 이미지 변경" />
      <Modal.Content>
        <div style={styles.content}>
          <p style={{ textAlign: 'center', marginBottom: '1em' }}>
            새로운 프로필 이미지를 선택하거나 업로드 해주세요.
          </p>
          <div style={styles.imagePreviewWrapper}>
            {preview ? (
              <img src={preview} alt="Profile Preview" style={styles.imagePreview} />
            ) : (
              <div style={styles.placeholder}>이미지 미리보기</div>
            )}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={styles.fileInput}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" onClick={handleUpdate}>
          <Icon name="checkmark" /> 변경하기
        </Button>
        <Button color="grey" onClick={onClose}>
          <Icon name="remove" /> 취소
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

const styles = {
  content: {
    textAlign: 'center',
  },
  imagePreviewWrapper: {
    width: '150px',
    height: '150px',
    margin: '0 auto 1em',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    color: '#999',
    fontSize: '0.9rem',
  },
  fileInput: {
    marginTop: '1rem',
  },
};

export default ProfileImageChangeModal;
