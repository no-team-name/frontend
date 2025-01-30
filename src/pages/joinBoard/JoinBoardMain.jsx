import React, { useState, useEffect, useRef } from 'react';
import { getJoinBoardCard, searchJoinBoard } from '../../service/JoinBoardService';
import { Card, CardContent, Typography, Pagination, Container, Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../../components/common/MainHeader.jsx';
import './JoinBoardMain.css';
//
function JoinBoardMain() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 수정 페이지로 가는 URL인 경우 뒤로가기를 누르면 목록 페이지로 이동하도록 설정
        if (location.pathname.includes('/edit-join-board/')) {
            const handlePopState = () => {
                // popstate 이벤트가 발생했을 때, 목록 페이지로 강제로 리디렉션
                navigate('/join-board', { replace: true });
            };

            // popstate 이벤트 리스너 추가
            window.addEventListener('popstate', handlePopState);

            // cleanup 함수로 이벤트 리스너 제거
            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [location, navigate]);

    // 검색어 입력 처리
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (!searchQuery) return;

        setIsSearching(true);
        setCurrentPage(1);
        setLoading(true);

        searchJoinBoard(searchQuery, 0)
            .then(response => {
                if (response && response.data && response.data.data) {
                    setPosts(response.data.data.content);
                    setTotalPages(response.data.data.totalPages);
                } else {
                    setPosts([]);
                }
            })
            .catch((error) => {
                console.error('검색 중 오류 발생', error);
                setPosts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchPosts = async (page = 0) => {
        setLoading(true);

        try {
            const response = await getJoinBoardCard(page);
            if (response && response.data && response.data.data && Array.isArray(response.data.data.content)) {
                setPosts(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            } else {
                setPosts([]);
            }
        } catch (error) {
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSearching) {
            searchJoinBoard(searchQuery, currentPage - 1).then(response => {
                if (response && response.data && response.data.data) {
                    setPosts(response.data.data.content);
                    setTotalPages(response.data.data.totalPages);
                } else {
                    setPosts([]);
                }
            });
        } else {
            fetchPosts(currentPage - 1);
        }
    }, [currentPage, isSearching]);

    useEffect(() => {
        if (!isSearching) {
            fetchPosts(0);
        }
    }, [isSearching]);

    if (loading) {
        return <p>Loading...</p>;
    }

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleCardClick = (id) => {
        navigate(`/join-board/${id}`);
    };

    const homeClick = () => {
        setIsSearching(false);
        setSearchQuery('');
        setCurrentPage(1);
        fetchPosts(0);
    };

    return (
        <>
            <MainHeader />

            <Container maxWidth="lg" style={{padding: '20px'}}>
                <br/>
                <Typography variant="h3" component="div" align="center"
                            style={{fontWeight: 'bold', marginBottom: '20px', color: 'black'}}>
                    <span className="home-title" onClick={homeClick}>Join Board</span>
                </Typography>

                <br/>

                <div className="search">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            ref={inputRef}
                            className="search-input"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button className="search-button" type="submit">검색</button>
                    </form>
                </div>

                <br/>

                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                    <Button
                        className="create-post-button"
                        variant="contained"
                        color="black"
                        onClick={() => navigate('/create-join-board')}
                    >
                        글 작성
                    </Button>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Card className="card" key={post.id} style={{
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                padding: '20px',
                                width: '100%',
                                maxWidth: '900px',
                                margin: '0 auto',
                                borderRadius: '10px'
                            }} onClick={() => handleCardClick(post.id)}>
                                <CardContent style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                    <Box style={{flex: 1}}>
                                        <Typography variant="h5" component="div"
                                                    style={{fontWeight: 'bold', marginBottom: '10px'}}>
                                            {post.title}
                                            <Typography variant="body2" color="text.secondary"
                                                        style={{marginBottom: '5px'}}>
                                                {post.createdAt}
                                            </Typography>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary"
                                                    style={{marginBottom: '5px' ,boxSizing: 'border-box', paddingBottom: '3px' }}>
                                            <strong>주제:</strong> {post.topic}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary"
                                                    style={{marginBottom: '5px' , boxSizing: 'border-box', paddingTop: '0px', paddingBottom: '2px'}}>
                                            <strong>팀 이름:</strong> {post.teamName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary"
                                                    style={{marginBottom: '5px', boxSizing: 'border-box', paddingTop: '3px'}}>
                                            <strong>소개글:</strong> {post.projectBio}
                                        </Typography>
                                    </Box>
                                    <Box style={{textAlign: 'right', paddingRight: '20px'}}>
                                        <Typography variant="body2" color="text.secondary"
                                                    style={{marginBottom: '5px' ,boxSizing: 'border-box', paddingBottom: '3px'}}>
                                            <strong>시작일:</strong> {new Date(post.startDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary"
                                                    style={{marginBottom: '5px' , boxSizing: 'border-box', paddingTop: '0px', paddingBottom: '2px'}}>
                                            <strong>종료일:</strong> {new Date(post.endDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary"
                                                    style={{marginBottom: '5px', boxSizing: 'border-box', paddingTop: '75px'}}>
                                            <strong>현재 인원:</strong> {post.peopleNumber} / 4
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="no-post">게시글이 존재하지 않습니다.</p>
                    )}
                </div>

                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <Pagination
                        count={totalPages}  // 총 페이지 수
                        page={currentPage}  // 현재 페이지
                        onChange={handlePageChange}  // 페이지 변경 시 실행될 함수
                        size="large"  // 페이지네이션 크기
                        sx={{
                            "& .MuiPaginationItem-root": {
                                backgroundColor: "white",  // 기본 배경색은 흰색
                                color: "black",  // 기본 글자 색상은 검정
                                borderRadius: '50%', // 동그라미 모양
                                "&:hover": {
                                    backgroundColor: "lightgray",  // 호버 시 배경을 밝은 회색으로 설정
                                    color: "black",  // 호버 시 글자 색상은 검정
                                },
                            },
                            "& .MuiPaginationItem-root.selected": {
                                backgroundColor: "gray !important",  // 선택된 페이지만 회색 배경
                                color: "white !important",  // 선택된 페이지 글자 색상은 흰색
                                fontWeight: 'bold',  // 선택된 페이지의 글자 두껍게
                                borderRadius: '50%', // 선택된 항목도 둥글게 유지
                            },
                            "& .MuiPaginationItem-previousNext": {
                                backgroundColor: "transparent",  // <, > 아이콘의 배경을 투명하게 설정
                                color: "black",  // 아이콘 색상은 검정
                            },
                        }}
                    />
                </div>
            </Container>
        </>
    );
}

export default JoinBoardMain;