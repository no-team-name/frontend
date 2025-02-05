import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    deleteJoinBoard,
    getJoinBoard,
    getJoinBoardCard,
    getJoinBoardCardByTitle,
    searchJoinBoard,
    getAllCommentByJoinBoardId,
    createComment,
    deleteComment
} from '../../service/JoinBoardService';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import MainHeader from "../../components/common/MainHeader";
import "./JoinBoardDetail.css";

function JoinBoardDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

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

    const fetchPostDetail = async () => {
        try {
            const data = await getJoinBoard(id);
            setPost(data);
            localStorage.setItem('currentJoinBoardDetail', JSON.stringify({
                id: data.id,
                page: page,
            }));
        } catch (error) {
            console.error('게시글을 불러오는 데 실패했습니다.', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPageData = async () => {
        const savedPage = localStorage.getItem('currentPage');
        const pageNum = savedPage ? parseInt(savedPage) : 1;
        try {
            const data = await getJoinBoardCard(pageNum - 1);
            setPage(pageNum);
        } catch (error) {
            console.error("게시판 목록을 가져오는 데 실패했습니다.", error);
        }
    };

    // 댓글 불러오기
    const fetchComments = async () => {
        try {
            const data = await getAllCommentByJoinBoardId(id);
            console.log("댓글 데이터:", data);

            setComments(data);
        } catch (error) {
            console.error('댓글을 불러오는 데 실패했습니다.', error);
        }
    };

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            await createComment(id, { content: newComment });
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

    useEffect(() => {
        fetchPostDetail();
        fetchComments();

        const savedState = localStorage.getItem('joinBoardState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            setPage(parsedState.currentPage || 1);
        } else {
            setPage(1);
        }

        const handlePopState = () => {
            const savedState = localStorage.getItem('joinBoardState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                setPage(parsedState.currentPage || 1);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [id]);

    useEffect(() => {
        const savedDetail = localStorage.getItem('currentJoinBoardDetail');
        if (savedDetail) {
            const parsedDetail = JSON.parse(savedDetail);
            if (parsedDetail.id === parseInt(id)) {
                setPage(parsedDetail.page);
            }
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

    return (
        <>
            <MainHeader />
            <Container maxWidth="lg" sx={{ padding: '40px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>
                <Card sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: 3,
                    padding: '20px',
                    position: 'relative'
                }}>
                    <CardContent>
                        <IconButton sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px'
                        }} onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleEditClick}>수정</MenuItem>
                            <MenuItem onClick={handleDeleteClick}>삭제</MenuItem>
                        </Menu>

                        {/* 메인 콘텐츠 컨테이너 */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '20px'
                        }}>
                            {/* 프로필 섹션 */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '70px'
                            }}>
                                <Box sx={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    marginBottom: '10px'
                                }}>
                                    <img
                                        src={post.memberProfileUrl || 'https://www.cheonyu.com/_DATA/product/63900/63992_1672648178.jpg'}
                                        alt={`${post.memberNickname}의 프로필`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            aspectRatio: '1/1',
                                            borderRadius: '50%'
                                        }}
                                    />
                                </Box>
                                <Typography sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    width: '100px'
                                }}>
                                    {post.memberNickname}
                                </Typography>
                            </Box>

                            {/* 타이틀 및 메타데이터 섹션 */}
                            <Box sx={{flexGrow: 1}}>
                                <Typography sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '10px'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                    }}>
                                        <Box>
                                            <Typography sx={{
                                                fontWeight: 'bold',
                                                fontSize: '2rem',
                                                color: '#333',
                                                marginBottom: '10px'
                                            }}>
                                                {post.title}
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            boxSizing: 'border-box'
                                        }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#777',
                                                    boxSizing: 'border-box',
                                                    paddingBottom: '3px',
                                                    marginBottom: '0px'
                                                }}
                                            >
                                                작성: {post.createdAt}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#777',
                                                    boxSizing: 'border-box',
                                                    paddingTop: '3px',
                                                    marginTop: '0px'
                                                }}
                                            >
                                                수정: {post.updatedAt}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Typography>
                            </Box>

                            {/* 날짜 및 인원 섹션 */}
                            <Box sx={{
                                textAlign: 'right'
                            }}>
                                <Typography sx={{fontWeight: 600, fontSize: '0.9rem', color: '#555'}}>
                                    <strong>시작일:</strong> {new Date(post.startDate).toLocaleDateString()}
                                </Typography>
                                <Typography sx={{fontWeight: 600, fontSize: '0.9rem', color: '#555'}}>
                                    <strong>종료일:</strong> {new Date(post.endDate).toLocaleDateString()}
                                </Typography>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#555' }}>
                                    <strong>현재 인원:</strong> {post.peopleNumber}/4
                                </Typography>
                            </Box>
                        </Box>

                        {/* 나머지 본문 섹션 */}
                        <Divider sx={{ marginY: 2, backgroundColor: '#ddd' }} />
                        <Box sx={{ paddingTop: '20px' }}>
                            {/* 주제 */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>주제</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px' }}>
                                    {post.content}
                                </Typography>
                            </Box>

                            {/* 팀 이름 */}
                            <Box sx={{ display: 'flex',  flexDirection: 'column', marginTop: 1 , boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>팀 이름</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px' }}>
                                    {post.teamName}
                                </Typography>
                            </Box>

                            {/* 소개글 */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>소개글</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px' }}>
                                    {post.projectBio}
                                </Typography>
                            </Box>

                            {/* 팀원 소개 */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>팀원 소개</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px' }}>
                                    {post.teamBio}
                                </Typography>
                            </Box>

                            {/* 내용 */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, boxSizing: 'border-box', paddingTop:'50px' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>내용</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px' }}>
                                    {post.content}
                                </Typography>
                            </Box>
                        </Box>

                        {/* 댓글 섹션 */}
                        <Box sx={{ marginTop: '40px' }}>
                            <Typography variant="h6" sx={{ color: '#333' }}>댓글</Typography>
                            <Divider sx={{ marginY: 2, backgroundColor: '#ddd' }} />

                            <List>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <ListItem
                                            key={comment.id}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                borderBottom: '1px solid #eee',
                                                paddingY: 2
                                            }}
                                        >
                                            <ListItemText
                                                primary={comment.content}
                                                secondary={`작성자: ${comment.author} | ${comment.createdAt}`}
                                                sx={{
                                                    '& .MuiListItemText-primary': {
                                                        color: '#333',
                                                        fontSize: '1rem',
                                                        marginBottom: '5px'
                                                    },
                                                    '& .MuiListItemText-secondary': {
                                                        color: '#777',
                                                        fontSize: '0.8rem'
                                                    }
                                                }}
                                            />
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleDeleteComment(comment.id)}
                                                sx={{ color: '#999' }}
                                            >
                                                <DeleteIcon /> </IconButton>
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" sx={{ color: '#777' }}>댓글이 없습니다.</Typography>
                                )}
                            </List>

                            {/* 댓글 입력란 */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                                <TextField
                                    variant="outlined"
                                    label="댓글을 작성하세요"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    sx={{ marginBottom: '10px' }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCommentSubmit}
                                    sx={{ alignSelf: 'flex-end' }}
                                >
                                    댓글 작성
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}

export default JoinBoardDetail;