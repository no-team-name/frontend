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
    deleteComment,
    updateComment // 댓글 수정 API 추가
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
import EditIcon from '@mui/icons-material/Edit'; // 수정 아이콘 추가
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
    const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
    const [editCommentContent, setEditCommentContent] = useState(''); // 수정 중인 댓글 내용


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
            console.log("댓글 data:", data);

            setComments(data);
        } catch (error) {
            console.error('댓글을 불러오는 데 실패했습니다.', error);
        }
    };

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!newComment.trim())
        { alert('댓글 내용을 입력해주세요.');
            return };

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

    // 댓글 수정 모드 시작
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
            fetchComments(); // 댓글 목록 새로고침
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            alert('댓글 수정에 실패했습니다.');
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
                            right: '10px',

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

                        {/* 프로필섹션, 제목, 작성, 수정일자 컨테이너 */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '20px',
                            boxSizing: 'border-box',
                            marginTop: '50px',
                            marginLeft: '20px'

                        }}>
                            {/* 프로필 섹션 */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '70px',
                                boxSizing: 'border-box',
                                marginTop: '0px'
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
                                <Typography className="member-nickname" sx={{
                                    fontSize: '0.9rem',
                                    textAlign: 'center',
                                    color: '#333333',
                                    width: '100px',
                                    className: 'member-nickname' ,
                                }}>
                                    {post.memberNickname}
                                </Typography>
                            </Box>



                            {/* 타이틀 섹션 */}
                            <Box sx={{
                                flexGrow: 1,
                                boxSizing: 'border-box',
                                marginLeft: '40px',
                                marginTop: '5px'
                            }}>
                                <Typography sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '10px'
                                }}>


                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'left'
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
                                            boxSizing: 'border-box',
                                        }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#999999',
                                                    boxSizing: 'border-box',
                                                    paddingBottom: '3px',
                                                    marginBottom: '0px',

                                                }}
                                            >
                                                작성: {post.createdAt}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#999999',
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

                        </Box>


                        {/* 나머지 본문 섹션 */}
                        {/*<Divider sx={{ marginY: 2, backgroundColor: '#ddd' }} />*/}
                        <Box sx={{ marginTop: '150px' }}>
                            {/* 주제 */}
                            <Box sx={{ display: 'flex', alignItems:'center', boxSizing: 'border-box' , padding: '0px' , marginBottom: '40px', marginLeft: '50px' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999'}}>
                                    <strong>주제</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px' , display: 'inline', padding: '0px' }}>
                                    {post.topic}
                                </Typography>
                            </Box>

                            {/* 팀 이름 */}
                            <Box sx={{ display: 'flex',  alignItems:'center', marginTop: 1 , boxSizing: 'border-box' , padding: '0px' , marginBottom: '40px', marginLeft: '50px'}}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>팀 이름</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px' ,padding: '0px' , marginBottom: '0px'}}>
                                    {post.teamName}
                                </Typography>
                            </Box>

                            {/* 소개글 */}
                            <Box sx={{ display: 'flex', alignItems:'center', marginTop: 1, boxSizing: 'border-box', padding: '0px' , marginBottom: '40px', marginLeft: '50px' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>소개글</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px', padding: '0px' , marginBottom: '20px' }}>
                                    {post.projectBio}
                                </Typography>
                            </Box>

                            {/* 팀원 소개 */}
                            <Box sx={{ display: 'flex', alignItems:'center', marginTop: 1,  boxSizing: 'border-box', padding: '0px'  , marginBottom: '40px', marginLeft: '50px'}}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>팀원 소개</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px', padding: '0px' , marginBottom: '0px' }}>
                                    {post.teamBio}
                                </Typography>
                            </Box>


                            {/* 프로젝트 기간 (시작일~종료일) */}
                            <Box sx={{ display: 'flex', alignItems:'center', marginTop: 1, boxSizing: 'border-box', padding: '0px'  , marginBottom: '40px', marginLeft: '50px' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong> 프로젝트 기간 </strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px', padding: '0px' , marginBottom: '0px' }}>
                                    {new Date(post.startDate).toLocaleDateString()} ~ {new Date(post.endDate).toLocaleDateString()}
                                </Typography>
                            </Box>



                            <Box sx={{ display: 'flex', alignItems:'center', marginTop: 1, boxSizing: 'border-box', padding: '0px'  , marginBottom: '40px', marginLeft: '50px' }}>
                                <Typography sx={{ fontWeight: 600, color: '#999999' }}>
                                    <strong>현재 팀 인원</strong>
                                </Typography>
                                <Typography sx={{ marginLeft: '10px', color: '#333', fontSize: '18px', padding: '0px' , marginBottom: '0px' }}>
                                    {post.peopleNumber}명
                                </Typography>
                            </Box>



                            {/* 내용 */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop:'100px', boxSizing: 'border-box', paddingTop:'0px', marginBottom: '350px',
                                marginLeft: '50px'}}>
                                <Typography sx={{ fontWeight: 600, color: '#999999', boxSizing: 'border-box', marginBottom: '30px' }}>
                                    <strong>내용</strong>
                                </Typography>
                                <Typography sx={{ boxSizing: 'border-box',  color: '#333', fontSize: '18px', whiteSpace: 'pre-line' }}>
                                    {post.content}
                                </Typography>
                            </Box>
                        </Box>



                        {/* 댓글 섹션 수정 */}
                        <Box sx={{ marginTop: '40px', boxSizing: 'border-box',
                            padding: '0px',
                            marginLeft: '0px'}}>
                            <Divider sx={{ marginY: 2, backgroundColor: '#ddd' }} />
                            <Typography variant="h6" sx={{ color: '#333' }}></Typography>


                            <List>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <ListItem
                                            key={comment.id}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                borderBottom: '1px solid #eee',
                                                paddingY: 2,
                                                flexDirection: editingCommentId === comment.id ? 'column' : 'row'
                                            }}
                                        >
                                            {editingCommentId === comment.id ? (
                                                // 수정 모드
                                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2}}>
                                                    <TextField
                                                        fullWidth
                                                        value={editCommentContent}
                                                        onChange={(e) => setEditCommentContent(e.target.value)}
                                                        variant="outlined"
                                                        multiline
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "black", // 마우스 호버 시 테두리 검정색
                                                                },
                                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: "black", // 클릭(포커스) 시 테두리 검정색
                                                                },
                                                            },
                                                        }}
                                                    />
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                        <Button
                                                            className='comment-cancel-update-button'
                                                            variant="contained"
                                                            color="black"
                                                            onClick={handleEditCancel}
                                                        >
                                                            취소
                                                        </Button>
                                                        <Button
                                                            className='comment-update-button'
                                                            variant="contained"
                                                            color="black"
                                                            onClick={() => handleEditSubmit(comment.id)}
                                                        >
                                                            수정 완료
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            ) : (







                                                // 일반 모드
                                                <>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%'  }}>


                                                        {/* 프로필 이미지와 닉네임을 포함하는 Box */}
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: '100px',
                                                            boxSizing: 'border-box', padding: '0px', marginTop: '5px', marginLeft: '0px' }}>
                                                            <Box sx={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: '50%',
                                                                overflow: 'hidden' ,
                                                                boxSizing: 'border-box' ,
                                                                paddingBottom: '0px' ,
                                                                marginBottom: '0px'
                                                            }}>
                                                                <img
                                                                    src={'https://cdn.goodnews1.com/news/photo/201907/89251_22763_3813.JPG' || 'https://www.cheonyu.com/_DATA/product/63900/63992_1672648178.jpg'}
                                                                    alt={`${comment.memberNickname}의 프로필`}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover'
                                                                    }}
                                                                />
                                                            </Box>


                                                            <Typography className="member-nickname"  sx={{
                                                                fontSize: '0.8rem',
                                                                color: '#333333' ,
                                                                boxSizing: 'border-box' ,
                                                                paddingTop: '3px',
                                                                marginBottom: '0px'
                                                            }}>
                                                                {comment.memberNickname}
                                                            </Typography>

                                                        </Box>




                                                        {/* 댓글 내용과 시간 */}
                                                        <ListItemText
                                                            primary={comment.content}
                                                            secondary={`${comment.createdAt}`}
                                                            sx={{
                                                                '& .MuiListItemText-primary': {
                                                                    color: '#333',
                                                                    fontSize: '1rem',
                                                                    marginBottom: '5px'
                                                                },
                                                                '& .MuiListItemText-secondary': {
                                                                    color: '#999999',
                                                                    fontSize: '0.8rem'
                                                                }
                                                            }}
                                                        />

                                                        {/* 수정/삭제 버튼 */}
                                                        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                                                            <IconButton
                                                                onClick={() => handleEditStart(comment)}
                                                                sx={{ color: '#999' }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                sx={{ color: '#999' }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </>







                                            )}
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
                                    sx={{ marginBottom: '10px' , "& .MuiOutlinedInput-root": {
                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "black", // 마우스 호버 시 테두리 검정색
                                            },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "black", // 클릭(포커스) 시 테두리 검정색
                                            },
                                        }, '& .MuiInputLabel-outlined': {
                                            color: "gray",
                                            '&.Mui-focused': {
                                                color: 'black',
                                            }},


                                    }}

                                />

                                <Button
                                    className="comment-create-button"
                                    variant="contained"
                                    color="black"
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