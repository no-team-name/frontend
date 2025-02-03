import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getJoinBoard, deleteJoinBoard } from '../../service/JoinBoardService';
import { Container, Typography, Box, Card, CardContent, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MainHeader from "../../components/common/MainHeader";
import "./JoinBoardDetail.css";

function JoinBoardDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        navigate(`/edit-join-board/${id}`, { replace: false });
        handleClose();
    };

    const handleDeleteClick = async () => {
        try {
            const result = await deleteJoinBoard(id);
                alert('게시글이 삭제되었습니다.');
                navigate('/join-board', { replace: true });
        } catch (error) {
            alert('게시글 삭제에 실패하였습니다.');
            console.error('게시글 삭제 실패:', error);
        }
        handleClose();
    };

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const data = await getJoinBoard(id);
                setPost(data);
            } catch (error) {
                console.error('게시글을 불러오는 데 실패했습니다.', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id]);

    useEffect(() => {
        if (location.state?.fromEdit) {
            const handlePopState = () => {
                navigate('/join-board', { replace: true });
            };
            window.addEventListener('popstate', handlePopState);
            return () => window.removeEventListener('popstate', handlePopState);
        }
    }, [location, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

    return (
        <>
            <MainHeader />
            <Container maxWidth="lg" sx={{ padding: '40px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>
                <Card sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3, padding: '20px', position: 'relative' }}>
                    <CardContent>
                        <IconButton sx={{ position: 'absolute', top: '10px', right: '10px' }} onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleEditClick}>수정</MenuItem>
                            <MenuItem onClick={handleDeleteClick}>삭제</MenuItem>
                        </Menu>

                        <Box sx={{ position: 'absolute', top: '80px', right: '30px', textAlign: 'right' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#555', marginBottom: '4px' , boxSizing: 'border-box', paddingBottom: '0px' }}>
                                <strong>시작일:</strong> {new Date(post.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#555', marginBottom: '4px' , boxSizing: 'border-box', paddingTop: '3px', paddingBottom: '3px'}}>
                                <strong>종료일:</strong> {new Date(post.endDate).toLocaleDateString()}
                            </Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#555' , boxSizing: 'border-box', paddingTop: '1px' }}>
                                <strong>현재 인원:</strong> {post.peopleNumber}/4
                            </Typography>
                        </Box>

                        <Box sx={{ paddingTop: '40px' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '2rem', color: '#333' }}>{post.title}</Typography>
                            <Typography variant="body2" sx={{ marginBottom: '0px' , boxSizing: 'border-box', paddingBottom: '0px' }}>
                                <span>작성:</span> {post.createdAt}
                            </Typography>
                            <Typography variant="body2" sx={{ marginTop: '0', boxSizing: 'border-box', marginBottom: '4px', paddingTop: '5px' }}>
                                <span>수정:</span> {post.updatedAt}
                            </Typography>
                            <Divider sx={{ marginY: 2, backgroundColor: '#ddd' }} />

                            <Typography sx={{ fontWeight: 600, color: '#555' }}><strong>주제:</strong> {post.topic}</Typography>
                            <Typography sx={{ fontWeight: 600, color: '#555' }}><strong>팀 이름:</strong> {post.teamName}</Typography>
                            <Typography sx={{ fontWeight: 600, color: '#555' }}><strong>소개글:</strong> {post.projectBio}</Typography>
                            <Typography sx={{ fontWeight: 600, color: '#555' }}><strong>팀원 소개:</strong> {post.teamBio}</Typography>

                            <Box sx={{ marginTop: 2 }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' ,  }}>
                                    <strong>내용:</strong> {post.content}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}

export default JoinBoardDetail;
