import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJoinBoard, updateJoinBoard } from '../../service/JoinBoardService';
import {
    Container,
    TextField,
    Box,
    Button,
    Typography,
    styled
} from '@mui/material';
import MainHeader from "../../components/common/MainHeader";
import "./EditJoinBoard.css";
//
// styled components 사용
const StyledContainer = styled(Container)(({ theme }) => ({
    padding: '40px 20px',
    backgroundColor: '#ffffff',
    minHeight: '100vh'
}));

const FormBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
}));

const StyledTextField = styled(TextField)({
    marginBottom: '20px',
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
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'black',
    }
});

function EditJoinBoard(
    {
        openLoginModal,
        openLogoutModal,
        openAccountDeleteModal,
        openNicknameModal,
      }
) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        topic: '',
        teamName: '',
        projectBio: '',
        teamBio: '',
        content: '',
        startDate: '',
        endDate: '',
        peopleNumber: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const data = await getJoinBoard(id);
                setPost(data);
                setLoading(false);
            } catch (error) {
                console.error('게시글을 불러오는 데 실패했습니다.', error);
                setError('게시글을 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await updateJoinBoard(id, post);
            console.log(result);
            alert('게시글이 수정되었습니다.');
            navigate(`/join-board/${id}`, {
                state: { fromEdit: true }
            });
        } catch (error) {
            alert('게시글 수정에 실패하였습니다.');
            console.error('게시글 수정 실패:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <MainHeader 
            logoSrc="/path/to/your/logo.png"
            openLoginModal={openLoginModal}
            openLogoutModal={openLogoutModal}
            openAccountDeleteModal={openAccountDeleteModal}
            openNicknameModal={openNicknameModal}
            />
            <StyledContainer maxWidth="lg">
                <FormBox>
                    <Typography fontWeight="bold" variant="h5" gutterBottom >게시글 수정</Typography> <br/>
                    <form onSubmit={handleSubmit}>
                        <StyledTextField
                            label="제목"
                            name="title"
                            variant="outlined"
                            fullWidth
                            value={post.title}
                            onChange={handleChange}
                        />
                        <StyledTextField
                            label="주제"
                            name="topic"
                            variant="outlined"
                            fullWidth
                            value={post.topic}
                            onChange={handleChange}
                        />
                        <StyledTextField
                            label="팀 이름"
                            name="teamName"
                            variant="outlined"
                            fullWidth
                            value={post.teamName}
                            onChange={handleChange}
                        />
                        <StyledTextField
                            label="소개글"
                            name="projectBio"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={post.projectBio}
                            onChange={handleChange}
                        />
                        <StyledTextField
                            label="팀원 소개"
                            name="teamBio"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={post.teamBio}
                            onChange={handleChange}
                        />
                        <StyledTextField
                            label="내용"
                            name="content"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            value={post.content}
                            onChange={handleChange}
                        />
                        <StyledTextField
                            label="시작 날짜"
                            name="startDate"
                            variant="outlined"
                            fullWidth
                            type="date"
                            value={post.startDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <StyledTextField
                            label="종료 날짜"
                            name="endDate"
                            variant="outlined"
                            fullWidth
                            type="date"
                            value={post.endDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <StyledTextField
                            label="팀원 수"
                            name="peopleNumber"
                            variant="outlined"
                            fullWidth
                            type="number"
                            value={post.peopleNumber}
                            onChange={handleChange}
                            inputProps={{
                                min: 1,
                                max: 4,
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button
                                className="input-edit-button"
                                type="submit"
                                variant="contained"
                                color="black"
                                sx={{
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        backgroundColor: 'black',
                                    }
                                }}
                            >
                                게시글 수정
                            </Button>
                        </Box>
                    </form>
                </FormBox>
            </StyledContainer>
        </>
    );
}

export default EditJoinBoard;