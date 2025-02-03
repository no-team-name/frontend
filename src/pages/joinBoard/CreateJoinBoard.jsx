import React, { useState } from 'react';
import { createJoinBoard } from '../../service/JoinBoardService';
import { Card, CardContent, Typography, TextField, Button, Box, Container, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainHeader from "../../components/common/MainHeader";
import "./CreateJoinBoard.css";
//
const StyledCard = styled(Card)({
    width: '100%',
    maxWidth: '800px', // 600px에서 800px로 증가
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    margin: '40px 0' // 상하 여백 추가
});

const StyledContainer = styled(Container)({
    padding: '40px',  // 20px에서 40px로 증가
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh' // 최소 높이 설정
});

const StyledTextField = styled(TextField)({
    marginBottom: '24px', // 16px에서 24px로 증가
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.87)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'black',
        },
        // input 필드 크기 증가
        '& input': {
            padding: '16px 14px', // 패딩 증가
        },
        // textarea 크기 증가
        '& textarea': {
            padding: '16px 14px', // 패딩 증가
        }
    },
    '& .MuiInputLabel-root': {
        fontSize: '1.1rem', // 라벨 크기 증가
        '&.Mui-focused': {
            color: 'black',
        }
    }
});

const CreateJoinBoard = () => {
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        teamName: '',
        projectBio: '',
        teamBio: '',
        content: '',
        startDate: '',
        endDate: '',
        peopleNumber: 1,
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            peopleNumber: Number(formData.peopleNumber),
        };

        const result = await createJoinBoard(updatedFormData);

        if (result) {
            alert('게시글 작성이 완료되었습니다!');
            navigate('/join-board');
        } else {
            alert('게시글 작성에 실패했습니다.');
        }
    };

    return (
        <>
            <MainHeader />
            <StyledContainer maxWidth="lg"> {/* sm에서 lg로 변경 */}
                <StyledCard>
                    <CardContent sx={{ padding: '40px' }}> {/* 내부 여백 증가 */}
                        <Typography variant="h4" component="div" sx={{ // h5에서 h4로 변경
                            textAlign: 'center',
                            marginBottom: '40px', // 20px에서 40px로 증가
                            fontWeight: 'bold'
                        }}>
                            글 작성
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <StyledTextField
                                label="제목"
                                variant="outlined"
                                fullWidth
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                            <StyledTextField
                                label="주제"
                                variant="outlined"
                                fullWidth
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                required
                            />

                            <StyledTextField
                                label="팀 이름"
                                variant="outlined"
                                fullWidth
                                name="teamName"
                                value={formData.teamName}
                                onChange={handleChange}
                                required
                            />

                            <StyledTextField
                                label="프로젝트 소개"
                                variant="outlined"
                                fullWidth
                                name="projectBio"
                                value={formData.projectBio}
                                onChange={handleChange}
                                multiline
                                rows={5} // 4에서 5로 증가
                                required
                            />

                            <StyledTextField
                                label="팀 소개"
                                variant="outlined"
                                fullWidth
                                name="teamBio"
                                value={formData.teamBio}
                                onChange={handleChange}
                                multiline
                                rows={5} // 4에서 5로 증가
                                required
                            />

                            <StyledTextField
                                label="내용"
                                variant="outlined"
                                fullWidth
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                multiline
                                rows={8} // 6에서 8로 증가
                                required
                            />

                            <StyledTextField
                                label="시작일"
                                variant="outlined"
                                fullWidth
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <StyledTextField
                                label="종료일"
                                variant="outlined"
                                fullWidth
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <StyledTextField
                                label="현재 인원"
                                variant="outlined"
                                fullWidth
                                type="number"
                                name="peopleNumber"
                                value={formData.peopleNumber}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 1, max: 4 }}
                            />

                            <Box display="flex" justifyContent="center" sx={{ marginTop: '40px' }}> {/* 20px에서 40px로 증가 */}
                                <Button
                                    className="input-create-button"
                                    variant="contained"
                                    type="submit"
                                    color="black"
                                    sx={{
                                        width: '100%',
                                        padding: '16px', // 12px에서 16px로 증가
                                        backgroundColor: 'white',
                                        fontSize: '1.1rem', // 버튼 텍스트 크기 증가
                                        '&:hover': {
                                            backgroundColor: 'black',
                                        }
                                    }}
                                >
                                    게시글 작성
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </StyledCard>
            </StyledContainer>
        </>
    );
};

export default CreateJoinBoard;