import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  deleteJoinBoard,
  getJoinBoard,
  getJoinBoardCard,
} from '../../service/JoinBoardService';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MainHeader from "../../components/common/MainHeader";
import CommentsSection from "../../components/joinboard/CommentsSection";
import "./JoinBoardDetail.css";

function JoinBoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);

  // 게시글 상세 불러오기
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

  // 게시글 목록 (페이징) 불러오기
  const fetchPageData = async () => {
    const savedPage = localStorage.getItem('currentPage');
    const pageNum = savedPage ? parseInt(savedPage) : 1;
    try {
      await getJoinBoardCard(pageNum - 1);
      setPage(pageNum);
    } catch (error) {
      console.error("게시판 목록을 가져오는 데 실패했습니다.", error);
    }
  };

  // 게시글 삭제
  const handleDeleteClick = async () => {
    try {
      await deleteJoinBoard(id);
      alert('게시글이 삭제되었습니다.');
      navigate('/join-board', { replace: true });
    } catch (error) {
      alert('게시글 삭제에 실패하였습니다.');
      console.error('게시글 삭제 실패:', error);
    }
    handleClose();
  };

  // 모달(메뉴) 열기/닫기
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 게시글 수정 이동
  const handleEditClick = () => {
    navigate(`/edit-join-board/${id}`, { replace: false });
    handleClose();
  };

  // 초기 데이터 로드 및 페이지 상태 관리
  useEffect(() => {
    fetchPostDetail();
    fetchPageData();

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

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <>
      <MainHeader />
      <Container
        maxWidth="lg"
        sx={{
          padding: '40px 20px',
          backgroundColor: '#fff',
          minHeight: '100vh',
        }}
      >
        <Card
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: 3,
            padding: '20px',
            position: 'relative',
          }}
        >
          <CardContent>
            {/* 게시글 상세 내용 */}
            <IconButton
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
              }}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleEditClick}>수정</MenuItem>
              <MenuItem onClick={handleDeleteClick}>삭제</MenuItem>
            </Menu>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                marginTop: '50px',
                marginLeft: '20px',
              }}
            >
              {/* 프로필 섹션 */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '70px',
                }}
              >
                <Box
                  sx={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '10px',
                  }}
                >
                  <img
                    src={
                      post.memberProfileUrl ||
                      'https://www.cheonyu.com/_DATA/product/63900/63992_1672648178.jpg'
                    }
                    alt={`${post.memberNickname}의 프로필`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <Typography
                  className="member-nickname"
                  sx={{
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    color: '#333333',
                    width: '100px',
                  }}
                >
                  {post.memberNickname}
                </Typography>
              </Box>

              {/* 타이틀 및 작성 정보 */}
              <Box
                sx={{
                  flexGrow: 1,
                  marginLeft: '40px',
                  marginTop: '5px',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    color: '#333',
                    marginBottom: '10px',
                  }}
                >
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#999999' }}>
                  작성: {post.createdAt}
                </Typography>
                <Typography variant="body2" sx={{ color: '#999999' }}>
                  수정: {post.updatedAt}
                </Typography>
              </Box>
            </Box>

            {/* 게시글 본문 (예시) */}
            <Box sx={{ marginTop: '40px', marginLeft: '50px' }}>
              <Typography variant="h6" sx={{ color: '#333' }}>
                주제: {post.topic}
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', mt: 1 }}>
                팀 이름: {post.teamName}
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', mt: 1 }}>
                소개글: {post.projectBio}
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', mt: 1 }}>
                팀원 소개: {post.teamBio}
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', mt: 1 }}>
                프로젝트 기간: {new Date(post.startDate).toLocaleDateString()} ~ {new Date(post.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="h6" sx={{ color: '#333', mt: 1 }}>
                현재 팀 인원: {post.peopleNumber}명
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ color: '#333', fontSize: '18px', whiteSpace: 'pre-line' }}>
                  {post.content}
                </Typography>
              </Box>
            </Box>

            {/* 댓글 섹션 컴포넌트 */}
            <CommentsSection joinBoardId={id} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default JoinBoardDetail;